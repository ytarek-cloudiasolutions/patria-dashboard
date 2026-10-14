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
import { api } from "@/config/api";
import type { EmployeeAccount } from "@/features/pos/types";
import { formatEgp } from "@/features/pos/utils";
import NewCallOrderDialog from "../components/NewCallOrderDialog";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import type { Order, OrderSource, OrderStatus, OrderStatusFilter, ProductOption } from "../types";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useOrders } from "../hooks/useOrders";
import { mapOrderStatusToBackend } from "../utils/orderMappers";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useLocations } from "@/features/locations/hooks/useLocations";
import type { CreateOrderRequest } from "../store/orderTypes";
import { showSuccessToast } from "@/shared/utils/toast";
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
  } = useOrders();
  const { products, getProducts, isFetchingProducts } = useProducts();
  const { locations, getLocations, isFetchingLocations } = useLocations();

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
  // The "Staff" tab used to be wired to `source: "staff"` — a value that
  // doesn't even exist in the backend's Order.source enum, so that fetch
  // always came back empty and the tab fell back to hardcoded mock data
  // (a fake "Layla Ibrahim" order repeated with different payment methods).
  // "Staff orders" really means orders billed to a staff member's personal
  // tab (Order.billedToStaffId), which GET /pos/employee-accounts already
  // aggregates correctly (same endpoint the POS's own Employee Accounts
  // panel uses) — so this tab now fetches and shows that real data instead
  // of pretending to be a plain order list.
  const [staffAccounts, setStaffAccounts] = useState<EmployeeAccount[]>([]);
  const [isLoadingStaffAccounts, setIsLoadingStaffAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [countsLoaded, setCountsLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const productsStarted = useRef(isFetchingProducts);
  const locationsStarted = useRef(isFetchingLocations);
  const ordersStarted = useRef(isFetchingOrders);

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

  // Fetch all source counts on mount for accurate initial badges
  useEffect(() => {
    import("@/config/api").then(({ api }) => {
      api.get("/orders/counts").then((res) => {
        const c = res.data as { application?: number; pos?: number; call?: number };
        setSourceCounts((prev) => ({
          ...prev,
          application: c.application ?? 0,
          pos: c.pos ?? 0,
          call: c.call ?? 0,
        }));
      })
        .catch(() => { })
        .finally(() => setCountsLoaded(true));
    });
  }, []);

  // Real per-staff tab data (see note above) — fetched once whenever the
  // Staff tab is opened, same endpoint and shape the POS's own Employee
  // Accounts dialog already uses.
  useEffect(() => {
    if (activeSource !== "staff") return;
    setIsLoadingStaffAccounts(true);
    api
      .get("/pos/employee-accounts")
      .then((res) => {
        const raw: any[] = res.data?.accounts ?? res.data?.data?.accounts ?? [];
        const accounts: EmployeeAccount[] = raw.map((a) => ({
          id: a.staffId,
          name: a.staffName || "Staff Member",
          total: a.totalOwed || 0,
          remaining: a.totalOwed || 0,
          pendingOrders: (a.pendingOrders || []).map((o: any) => ({
            id: o._id || o.id,
            total: o.total || 0,
          })),
          payBook: (a.payBook || []).map((o: any) => ({
            amount: o.total || 0,
            method: (o.paymentMethod || "cash").toLowerCase() === "card" ? "Card" : "Cash",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
          })),
        }));
        setStaffAccounts(accounts);
        setSourceCounts((prev) => ({ ...prev, staff: accounts.length }));
      })
      .catch(() => setStaffAccounts([]))
      .finally(() => setIsLoadingStaffAccounts(false));
  }, [activeSource]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Fetch orders when source, status or page changes
  // Fetch orders when source, status, search, or page changes
  // "staff" has its own real data source (the employee-accounts effect
  // above) — `source: "staff"` isn't a real backend value, so skip this
  // fetch entirely for that tab instead of firing a request that can only
  // ever come back empty.
  useEffect(() => {
    if (activeSource === "staff") return;
    const delayDebounceId = setTimeout(() => {
      getOrdersList({
        source: activeSource,
        limit: 100,
        page: currentPage,
        status: selectedStatus === "All statuses" ? undefined : mapOrderStatusToBackend(selectedStatus),
        search: searchValue.trim() || undefined,
      });
    }, 300);
    return () => clearTimeout(delayDebounceId);
  }, [activeSource, selectedStatus, currentPage, searchValue, getOrdersList]);

  // Live updates: play a sound and refresh the list when a new order comes in
  // or an existing order gets new items sent to the kitchen.
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      playNotificationSound();
      if (activeSource === "staff") return;
      getOrdersList({
        source: activeSource,
        limit: 100,
        page: currentPage,
        status: selectedStatus === "All statuses" ? undefined : mapOrderStatusToBackend(selectedStatus),
        search: searchValue.trim() || undefined,
      });
    };

    socket.on("newOrder", handleUpdate);
    socket.on("orderUpdated", handleUpdate);

    return () => {
      socket.off("newOrder", handleUpdate);
      socket.off("orderUpdated", handleUpdate);
    };
  }, [activeSource, selectedStatus, currentPage, getOrdersList]);

  // Remember the count for each source tab after load — staff's count comes
  // from the employee-accounts effect instead, since no order fetch runs
  // for that tab (see above).
  useEffect(() => {
    if (activeSource === "staff") return;
    if (!loading.fetch) {
      setSourceCounts((prev) => ({
        ...prev,
        [activeSource]: pagination?.total ?? orders.length,
      }));
    }
  }, [orders, activeSource, pagination, loading.fetch]);

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

  // The Staff tab no longer uses the generic order list/table at all (see
  // the real employee-accounts fetch above), so this only ever needs to be
  // the plain fetched orders now.
  const filteredOrders = orders;

  const summary = useMemo(() => {
    // Revenue must only count money actually collected — this used to add
    // every order's total the instant it was placed (status: "Pending"),
    // only excluding Cancelled, same class of bug already fixed on the
    // backend's /reports/overview (this card is computed client-side from
    // the orders list instead, so it needed its own fix).
    const revenue = orders.reduce(
      (sum, o) => sum + (o.paymentState === "Paid" && o.status !== "Cancelled" ? o.total : 0),
      0
    );
    const totalOrders = pagination?.total ?? orders.length;
    const pending = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Preparing" ||
        o.status === "Confirmed" ||
        o.status === "On The Way"
    ).length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;

    return { revenue, totalOrders, pending, delivered };
  }, [orders, pagination]);

  // Real numbers derived from the same /pos/employee-accounts data the POS's
  // own Employee Accounts panel uses — see the fetch effect above.
  const staffSummary = useMemo(() => {
    const revenue = staffAccounts.reduce(
      (sum, a) => sum + a.payBook.reduce((s, e) => s + e.amount, 0),
      0
    );
    const totalStaffOrders = staffAccounts.reduce((sum, a) => sum + a.pendingOrders.length, 0);
    const totalTabAmount = staffAccounts.reduce((sum, a) => sum + a.total, 0);
    const employeeCount = staffAccounts.length;

    return {
      revenue,
      totalStaffOrders,
      totalTabAmount,
      employeeCount,
    };
  }, [staffAccounts]);

  const tabCounts = useMemo(() => ({
    application: activeSource === "application" ? (pagination?.total ?? orders.length) : sourceCounts.application,
    pos: activeSource === "pos" ? (pagination?.total ?? orders.length) : sourceCounts.pos,
    call: activeSource === "call" ? (pagination?.total ?? orders.length) : sourceCounts.call,
    staff: activeSource === "staff" ? staffAccounts.length : sourceCounts.staff,
  }), [orders, pagination, activeSource, sourceCounts, staffAccounts]);

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
              count={tabCounts[source]}
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

        {activeSource === "staff" ? (
          <div className="space-y-4">
            {isLoadingStaffAccounts ? (
              <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
                {t("Loading staff accounts...")}
              </p>
            ) : staffAccounts.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
                {t("No employee accounts found")}
              </p>
            ) : (
              staffAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex flex-col gap-6 rounded-[20px] border border-[#CACBD4] bg-[#FAFAF7] p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-semibold tracking-[0.32px] text-black">
                      {account.name}
                    </p>
                    {account.pendingOrders.length > 0 && (
                      <div className="flex items-center justify-center rounded-[30px] border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1">
                        <span className="text-[11px] font-semibold tracking-[0.22px] text-[#C7861E]">
                          {account.pendingOrders.length} {t("unpaid orders")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-semibold leading-[11.77px] tracking-[0.22px] text-black">
                        {t("Total")}
                      </p>
                      <p className="text-[16px] font-normal leading-[22.40px] tracking-[0.32px] text-black">
                        {formatEgp(account.total)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 text-end">
                      <p className="text-[11px] font-semibold leading-[11.77px] tracking-[0.22px] text-black">
                        {t("Remaining")}
                      </p>
                      <p className="text-[16px] font-normal leading-[22.40px] tracking-[0.32px] text-black">
                        {formatEgp(account.remaining)}
                      </p>
                    </div>
                  </div>

                  {account.payBook.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-[16px] border border-dashed border-[#8F6900] bg-[#FAFAF7] px-5 py-4">
                      <p className="text-[13px] font-medium tracking-[0.26px] text-black">
                        {t("pay book")}:
                      </p>
                      <div className="flex max-h-[120px] flex-col gap-2 overflow-y-auto pe-1">
                        {account.payBook.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.22px] text-[#595959]"
                          >
                            <span className="inline-block size-1 shrink-0 rounded-full bg-[#595959]" />
                            <span>
                              {formatEgp(entry.amount)} - {t(entry.method)} - {entry.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
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
          />
        )}

        {/* Pagination Controls — not applicable to the Staff tab, which
            isn't paginated (employee-accounts returns every active account
            at once) and no longer fetches orders at all. */}
        {activeSource !== "staff" && pagination && (pagination.totalPages || pagination.pages || 1) > 1 && (
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
          getOrdersList({
            source: activeSource,
            limit: 100,
            page: currentPage,
            status: selectedStatus === "All statuses" ? undefined : mapOrderStatusToBackend(selectedStatus),
            search: searchValue.trim() || undefined,
          });
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
