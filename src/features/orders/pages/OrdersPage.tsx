import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  CheckCheck,
  ClipboardList,
  Hourglass,
  Monitor,
  Phone,
  Plus,
  Trash2,
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { ORDER_SOURCE_LABELS } from "../data";
import NewCallOrderDialog from "../components/NewCallOrderDialog";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import type { Order, OrderSource, OrderStatus, OrderStatusFilter, ProductOption } from "../types";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useOrders } from "../hooks/useOrders";
import { mapOrderStatusToBackend } from "../utils/orderMappers";
import { payOrder } from "../api/ordersApi";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useLocations } from "@/features/locations/hooks/useLocations";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import type { CreateOrderRequest } from "../store/orderTypes";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { getSocket } from "@/shared/lib/socket";
import { playNotificationSound } from "@/shared/lib/notificationSound";

const SOURCE_ICONS: Record<OrderSource, LucideIcon> = {
  application: Smartphone,
  pos: Monitor,
  call: Phone,
  staff: Users,
};

const OrdersPage = () => {
  const { t } = useTranslation();
  const {
    orders,
    pagination,
    loading,
    getOrdersList,
    updateOrderStatusValue,
    updateOrderSuccess,
    updateOrderLocal,
    createNewOrder,
    deleteOrderValue,
    isFetchingOrders,
    isCreatingOrder,
    successMessage,
    errors,
  } = useOrders();
  const { products, getProducts, isFetchingProducts } = useProducts();
  const { locations, getLocations, isFetchingLocations } = useLocations();
  const { isSuperAdmin } = usePermissions();

  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatusFilter>("All statuses");
  const [activeSource, setActiveSource] = useState<OrderSource>("application");
  const [sourceCounts, setSourceCounts] = useState<Record<OrderSource, number>>({
    application: 0,
    pos: 0,
    call: 0,
    staff: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [countsLoaded, setCountsLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const productsStarted = useRef(isFetchingProducts);
  const locationsStarted = useRef(isFetchingLocations);
  const ordersStarted = useRef(isFetchingOrders);
  const shouldRefreshCountsAfterCallOrder = useRef(false);

  const refreshSourceCounts = useCallback(async () => {
    try {
      const { api } = await import("@/config/api");
      const res = await api.get("/orders/counts");
      const counts = res.data as Partial<Record<OrderSource, number>>;
      setSourceCounts((previous) => ({
        ...previous,
        application: counts.application ?? previous.application,
        pos: counts.pos ?? previous.pos,
        call: counts.call ?? previous.call,
        // The backend can add this field without requiring a frontend
        // change. Until then, retain the current staff badge value.
        staff: counts.staff ?? previous.staff,
      }));
    } catch {
      // Keep the last confirmed badge values if the refresh fails.
    } finally {
      setCountsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isFetchingProducts) {
      productsStarted.current = true;
    } else if (productsStarted.current) {
      setProductsLoaded(true);
    }
  }, [isFetchingProducts]);

  useEffect(() => {
    if (isFetchingLocations) {
      locationsStarted.current = true;
    } else if (locationsStarted.current) {
      setLocationsLoaded(true);
    }
  }, [isFetchingLocations]);

  useEffect(() => {
    if (isFetchingOrders) {
      ordersStarted.current = true;
    } else if (ordersStarted.current) {
      setOrdersLoaded(true);
    }
  }, [isFetchingOrders]);

  // Badges are deliberately sourced from the aggregate counts endpoint, not
  // from the currently displayed list. The list still contains the previous
  // tab's orders for a render while the next request is being scheduled.
  useEffect(() => {
    void refreshSourceCounts();
  }, [refreshSourceCounts]);

  // Refresh the aggregate badges only after this call-order request has
  // succeeded. This ensures the just-created order is included in the API
  // response rather than refreshing before persistence finishes.
  useEffect(() => {
    if (!shouldRefreshCountsAfterCallOrder.current || isCreatingOrder) return;

    if (errors.create) {
      shouldRefreshCountsAfterCallOrder.current = false;
      return;
    }

    if (successMessage) {
      shouldRefreshCountsAfterCallOrder.current = false;
      void refreshSourceCounts();
    }
  }, [errors.create, isCreatingOrder, refreshSourceCounts, successMessage]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // "Staff" isn't a real `source` value in the backend — it's every order
  // billed to ANY staff member's personal tab (Order.billedToStaffId),
  // which `billedToStaffId=any` fetches regardless of source.
  const buildOrdersQuery = useCallback(
    () => ({
      ...(activeSource === "staff" ? { billedToStaffId: "any" } : { source: activeSource }),
      limit: 100,
      page: currentPage,
      status: selectedStatus === "All statuses" ? undefined : mapOrderStatusToBackend(selectedStatus),
      search: searchValue.trim() || undefined,
    }),
    [activeSource, currentPage, selectedStatus, searchValue],
  );

  // Fetch orders when source, status, search, or page changes
  useEffect(() => {
    const delayDebounceId = setTimeout(() => {
      getOrdersList(buildOrdersQuery());
    }, 300);
    return () => clearTimeout(delayDebounceId);
  }, [buildOrdersQuery, getOrdersList]);

  // Live updates: play a sound and refresh the list when a new order comes in
  // or an existing order gets new items sent to the kitchen.
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      playNotificationSound();
      getOrdersList(buildOrdersQuery());
    };

    socket.on("newOrder", handleUpdate);
    socket.on("orderUpdated", handleUpdate);

    return () => {
      socket.off("newOrder", handleUpdate);
      socket.off("orderUpdated", handleUpdate);
    };
  }, [buildOrdersQuery, getOrdersList]);

  // Fetch products and locations for call orders
  useEffect(() => {
    getProducts({ page: 1, limit: 100 });
    getLocations();
  }, [getProducts, getLocations]);

  // Map backend locations to delivery zones
  const deliveryZones = useMemo(() => {
    return locations.map((loc) => ({
      id: loc._id || loc.id,
      name: loc.name,
      deliveryFee: loc.deliveryFee,
      minOrder: loc.minOrderAmount,
    }));
  }, [locations]);

  // Map backend products to product options
  const productOptions: ProductOption[] = useMemo(() => {
    return products
      .filter((p: any) => {
        if (p.isActive === false || p.available === false || p.status === "Inactive") {
          return false;
        }
        const pType = (p.productType || p.type || "").toLowerCase();
        const pCat = (p.category || "").toLowerCase();
        if (
          p.isIngredient ||
          pType === "raw ingredients" ||
          pType === "raw ingredient" ||
          pCat === "raw ingredients" ||
          pCat === "raw ingredient"
        ) {
          return false;
        }
        return true;
      })
      .map((p) => {
        const rawCat = p.category;
        const category =
          rawCat === "Bakery" || rawCat === "Meals" || rawCat === "Sandwiches" || rawCat === "Coffee"
            ? rawCat
            : "Coffee";

        return {
          id: p.id,
          name: p.name,
          unitPrice: p.price,
          category,
          customizable:
            (p.variantGroups && p.variantGroups.length > 0) ||
            (p.extras && p.extras.length > 0),
          variantGroups: p.variantGroups?.map((vg) => ({
            id: vg.id,
            name: vg.name,
            required: vg.required,
            options: vg.options.map((opt) => ({
              id: opt.id,
              name: opt.name,
              price: opt.price,
            })),
          })),
          extras: p.extras?.map((ext) => ({
            id: ext.id,
            name: ext.name,
            price: ext.price,
          })),
        };
      });
  }, [products]);

  // Staff-tab purchases are created through the POS, so the backend's POS
  // source query can include them. They belong exclusively in the Staff tab
  // in this screen and must not be rendered alongside walk-in POS orders.
  const filteredOrders = useMemo(
    () =>
      activeSource === "pos"
        ? orders.filter((order) => !order.isStaffOrder && !order.billedToStaffId)
        : orders,
    [activeSource, orders],
  );

  const summary = useMemo(() => {
    // Revenue must only count money actually collected — this used to add
    // every order's total the instant it was placed (status: "Pending"),
    // only excluding Cancelled, same class of bug already fixed on the
    // backend's /reports/overview (this card is computed client-side from
    // the orders list instead, so it needed its own fix).
    const revenue = filteredOrders.reduce(
      (sum, o) => sum + (o.paymentState === "Paid" && o.status !== "Cancelled" ? o.total : 0),
      0
    );
    const totalOrders = activeSource === "pos"
      ? filteredOrders.length
      : pagination?.total ?? filteredOrders.length;
    const pending = filteredOrders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Preparing" ||
        o.status === "Confirmed" ||
        o.status === "On The Way"
    ).length;
    const delivered = filteredOrders.filter((o) => o.status === "Delivered").length;

    return { revenue, totalOrders, pending, delivered };
  }, [activeSource, filteredOrders, pagination]);

  // Real numbers derived straight from the orders billed to staff tabs (see
  // the unified fetch above) — previously computed from hardcoded mock data.
  const staffSummary = useMemo(() => {
    const list = activeSource === "staff" ? orders : [];
    const isPaid = (o: Order) =>
      (o.staffStatus || (o.paymentState === "Paid" ? "Paid" : "Charged to tab")) === "Paid";
    const revenue = list.reduce((sum, o) => sum + (isPaid(o) ? o.total : 0), 0);
    const totalStaffOrders = pagination?.total ?? list.length;
    const totalTabAmount = list.reduce((sum, o) => sum + (isPaid(o) ? 0 : o.total), 0);
    const employeeCount = new Set(
      list.map((o) => o.billedToStaffId || o.staffName).filter(Boolean)
    ).size;

    return { revenue, totalStaffOrders, totalTabAmount, employeeCount };
  }, [activeSource, orders, pagination]);

  const sources: OrderSource[] = ["application", "pos", "call", "staff"];

  const handleSourceChange = (source: OrderSource) => {
    setActiveSource(source);
    setSelectedIds([]);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: OrderStatusFilter) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatusValue({ orderId, status });
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  // Marking a staff tab order "Paid" actually settles it (there's no
  // backend support for reversing a paid order back to "Charged to tab"),
  // and it's restricted to super admins — same bar as any other action that
  // clears someone else's running balance.
  const handleUpdateStaffStatus = async (orderId: string, status: "Charged to tab" | "Paid") => {
    if (status !== "Paid") return;
    if (!isSuperAdmin) {
      showErrorToast(t("Only a super admin can settle a staff order"));
      return;
    }
    try {
      await payOrder(orderId, "cash");
      showSuccessToast(t("Order marked as paid"));
      getOrdersList(buildOrdersQuery());
    } catch {
      showErrorToast(t("Failed to settle order"));
    }
  };

  const assignDriver = (orderId: string, driverName: string, updatedOrderData?: any) => {
    if (updatedOrderData && (updatedOrderData._id || updatedOrderData.id || updatedOrderData.order)) {
      const rawOrder = updatedOrderData.order || updatedOrderData;
      updateOrderSuccess(rawOrder);
    } else {
      updateOrderLocal({ orderId, driverName, status: "confirmed" });
    }
  };

  const toggleSelected = (orderId: string) => {
    setSelectedIds((previous) =>
      previous.includes(orderId)
        ? previous.filter((id) => id !== orderId)
        : [...previous, orderId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((previous) =>
      previous.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order.id)
    );
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => {
      if (activeSource === "call") {
        deleteOrderValue(id);
      }
    });
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  const handleCreateOrder = (order: Order) => {
    // A call order may be created after looking up a customer. Do not leave
    // that customer name as an active Orders-list filter once the dialog
    // closes, otherwise the user sees a filtered Call tab unexpectedly.
    setSearchValue("");
    setCurrentPage(1);
    shouldRefreshCountsAfterCallOrder.current = true;

    const requestItems = order.items.map((item) => ({
      productId: String(item.productId || item.id),
      quantity: item.quantity,
      price: item.unitPrice,
      notes: item.note || undefined,
      selectedVariants: item.selectedVariants,
      selectedExtras: item.selectedExtras,
    }));

    const createRequest: CreateOrderRequest = {
      type: order.source === "pos" ? "dine_in" : "takeaway",
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: order.address,
      zone: order.zone,
      deliveryFee: order.deliveryFee,
      items: requestItems,
      // The discount code entered in the call-center wizard was never
      // forwarded here at all — the order was always created at its full,
      // undiscounted total regardless of what the agent typed and "applied"
      // in the payment step. The backend now validates this code for real
      // (createOrder, mirroring placeCustomerOrder) and computes the
      // discount itself, rather than trusting a client-side number.
      couponCode: order.discountCode || undefined,
      notes: order.items.map((item) => item.note).filter(Boolean).join("; ") || undefined,
    };

    createNewOrder(createRequest);
  };

  const handleSearchProducts = useCallback(
    (query: string) => {
      getProducts({ page: 1, limit: 100, search: query || undefined });
    },
    [getProducts],
  );

  const isLoading = !countsLoaded || !productsLoaded || !locationsLoaded || !ordersLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <ShoppingBag className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isStatusMenuOpen && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/50" />
      )}

      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:gap-4 md:flex-row md:items-end md:justify-between">
        <HeaderLayout
          title={t("Orders")}
          description={t("Manage and track customer orders")}
        />
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <DefaultButton
              data={{
                buttonText: `${t("Delete")} (${selectedIds.length}) ${t("Order")}`,
                icon: <Trash2 className="size-4.5" />,
                onClick: () => setIsBulkDeleteOpen(true),
                className: "bg-[#C90000] text-white hover:bg-[#C90000]",
              }}
            />
          )}
          <DefaultButton
            data={{
              buttonText: t("New Call Order"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsCallDialogOpen(true),
            }}
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <OrdersFilters
          searchValue={searchValue}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchValue}
          onStatusChange={handleStatusChange}
          onStatusMenuOpenChange={setIsStatusMenuOpen}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {sources.map((source) => (
            <TabItem
              key={source}
              value={source}
              label={t(ORDER_SOURCE_LABELS[source])}
              icon={SOURCE_ICONS[source]}
              count={sourceCounts[source]}
              isActive={source === activeSource}
              onClick={(value) => handleSourceChange(value as OrderSource)}
            />
          ))}
        </div>

        {activeSource === "staff" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
            <OverviewCard
              data={{
                title: t("Revenue"),
                value: `EGP ${staffSummary.revenue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`,
                icon: <TrendingUp className="size-5" />,
                iconColor: "text-primary",
                badgeColor: "bg-[#F5F0EA]",
              }}
            />
            <OverviewCard
              data={{
                title: t("Total Staff Orders"),
                value: staffSummary.totalStaffOrders,
                icon: <ShoppingBag className="size-5" />,
                iconColor: "text-[#3574FF]",
                badgeColor: "bg-[#DBEAFE]",
              }}
            />
            <OverviewCard
              data={{
                title: t("Total Tab amount"),
                value: `EGP ${staffSummary.totalTabAmount.toLocaleString()}`,
                icon: <DollarSign className="size-5" />,
                iconColor: "text-[#FE9A00]",
                badgeColor: "bg-[rgba(254,154,0,0.1)]",
              }}
            />
            <OverviewCard
              data={{
                title: t("Employee count"),
                value: staffSummary.employeeCount,
                icon: <Users className="size-5" />,
                iconColor: "text-[#059B5A]",
                badgeColor: "bg-[#E2F4ED]",
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
            <OverviewCard
              data={{
                title: t("Revenue"),
                value: `EGP ${summary.revenue.toLocaleString()}`,
                icon: <TrendingUp className="size-5" />,
                iconColor: "text-primary",
                badgeColor: "bg-[#F5F0EA]",
              }}
            />
            <OverviewCard
              data={{
                title: t("Total Orders"),
                value: summary.totalOrders,
                icon: <ClipboardList className="size-5" />,
                iconColor: "text-[#3574FF]",
                badgeColor: "bg-[#DCEAFF]",
              }}
            />
            <OverviewCard
              data={{
                title: t("Pending"),
                value: summary.pending,
                icon: <Hourglass className="size-5" />,
                iconColor: "text-[#C7861E]",
                badgeColor: "bg-[#FFF7E6]",
              }}
            />
            <OverviewCard
              data={{
                title: t("Delivered"),
                value: summary.delivered,
                icon: <CheckCheck className="size-5" />,
                iconColor: "text-[#059B5A]",
                badgeColor: "bg-[#E2F4ED]",
              }}
            />
          </div>
        )}

        <OrdersTable
          orders={filteredOrders}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onToggleSelectAll={toggleSelectAll}
          onViewOrder={setSelectedOrder}
          onUpdateStatus={updateStatus}
          onAssignDriver={assignDriver}
          onStatusMenuOpenChange={setIsStatusMenuOpen}
          isPos={activeSource === "pos"}
          isStaffTab={activeSource === "staff"}
          onUpdateStaffStatus={handleUpdateStaffStatus}
        />

        {/* Pagination Controls */}
        {pagination && (pagination.totalPages || pagination.pages || 1) > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA] disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
            >
              &lt;
            </button>
            {Array.from({ length: pagination.totalPages || pagination.pages || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-[8px] text-[14px] font-semibold transition-colors cursor-pointer",
                  p === currentPage
                    ? "bg-primary text-white"
                    : "border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA]"
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === (pagination.totalPages || pagination.pages || 1)}
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages || pagination.pages || 1, p + 1))}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA] disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <OrderDetailsDialog
        open={selectedOrder !== null}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        onOrderUpdated={(updated) => {
          setSelectedOrder(updated);
          getOrdersList(buildOrdersQuery());
        }}
      />

      <NewCallOrderDialog
        open={isCallDialogOpen}
        productOptions={productOptions}
        deliveryZones={deliveryZones}
        onOpenChange={setIsCallDialogOpen}
        onCreateOrder={handleCreateOrder}
        onSearchProducts={handleSearchProducts}
      />

      <DeleteDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        data={{
          item: `${selectedIds.length}`,
          type: "order",
        }}
        onConfirm={handleBulkDelete}
      />
    </>
  );
};

export default OrdersPage;
