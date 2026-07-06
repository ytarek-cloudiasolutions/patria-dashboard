import { useEffect, useMemo, useState } from "react";
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
  type LucideIcon,
} from "lucide-react";

import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import DeleteDialog from "@/shared/components/DeleteDialog";
import {
  MOCK_ORDERS,
  ORDER_SOURCE_LABELS,
} from "../data";
import NewCallOrderDialog from "../components/NewCallOrderDialog";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import type { Order, OrderSource, OrderStatus, OrderStatusFilter, ProductOption } from "../types";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useOrders } from "../hooks/useOrders";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useLocations } from "@/features/locations/hooks/useLocations";
import type { CreateOrderRequest } from "../store/orderTypes";
import { showSuccessToast } from "@/shared/utils/toast";

const SOURCE_ICONS: Record<OrderSource, LucideIcon> = {
  application: Smartphone,
  pos: Monitor,
  call: Phone,
};

const OrdersPage = () => {
  const { t } = useTranslation();
  const { orders, getOrdersList, updateOrderStatusValue, createNewOrder, deleteOrderValue } = useOrders();
  const { products, getProducts } = useProducts();
  const { locations, getLocations } = useLocations();

  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatusFilter>("All statuses");
  const [activeSource, setActiveSource] = useState<OrderSource>("application");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Fetch initial list once on page mount
  useEffect(() => {
    getOrdersList({
      type: "takeaway",
    });
  }, [getOrdersList]);

  // Fetch products and locations for call orders
  useEffect(() => {
    getProducts();
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
    return products.map((p) => {
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

  const displayedOrders = useMemo(() => {
    if (activeSource === "call") {
      return orders;
    }
    return MOCK_ORDERS;
  }, [orders, activeSource]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return displayedOrders.filter((order) => {
      const matchesSource = order.source === activeSource;
      const matchesStatus =
        selectedStatus === "All statuses" ||
        order.status === selectedStatus;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.customerPhone.toLowerCase().includes(normalizedSearch) ||
        order.paymentMethod.toLowerCase().includes(normalizedSearch) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(normalizedSearch)
        );

      return matchesSource && matchesStatus && matchesSearch;
    });
  }, [activeSource, displayedOrders, searchValue, selectedStatus]);

  const summary = useMemo(() => {
    const activeOrders = displayedOrders.filter((o) => o.source === activeSource);
    const revenue = activeOrders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
    const totalOrders = activeOrders.length;
    const pending = activeOrders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Preparing" ||
        o.status === "Confirmed" ||
        o.status === "On The Way"
    ).length;
    const delivered = activeOrders.filter((o) => o.status === "Delivered").length;

    return {
      revenue,
      totalOrders,
      pending,
      delivered,
    };
  }, [displayedOrders, activeSource]);

  const tabCounts = useMemo(() => {
    return {
      application: MOCK_ORDERS.filter((o) => o.source === "application").length,
      pos: MOCK_ORDERS.filter((o) => o.source === "pos").length,
      call: orders.filter((o) => o.source === "call").length,
    };
  }, [orders]);

  const sources: OrderSource[] = ["application", "pos", "call"];

  const handleSourceChange = (source: OrderSource) => {
    setActiveSource(source);
    setSelectedIds([]);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatusValue({ orderId, status });
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const assignDriver = (_orderId: string, _driver: string) => {
    showSuccessToast(t("Driver assigned successfully (local)"));
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
    }));

    const createRequest: CreateOrderRequest = {
      type: order.source === "pos" ? "dine_in" : "takeaway",
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: order.address,
      zone: order.zone,
      deliveryFee: order.deliveryFee,
      items: requestItems,
      notes: order.items.map((item) => item.note).filter(Boolean).join("; ") || undefined,
    };

    createNewOrder(createRequest);
  };

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
                className: "bg-[#C90000] text-white hover:bg-[#C90000]/90",
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
          onStatusChange={setSelectedStatus}
          onStatusMenuOpenChange={setIsStatusMenuOpen}
        />

        <div className="grid grid-cols-3 gap-1.5">
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

        <OrdersTable
          orders={filteredOrders}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onToggleSelectAll={toggleSelectAll}
          onViewOrder={setSelectedOrder}
          onUpdateStatus={updateStatus}
          onAssignDriver={assignDriver}
          onStatusMenuOpenChange={setIsStatusMenuOpen}
        />
      </div>

      <OrderDetailsDialog
        open={selectedOrder !== null}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      />

      <NewCallOrderDialog
        open={isCallDialogOpen}
        productOptions={productOptions}
        deliveryZones={deliveryZones}
        onOpenChange={setIsCallDialogOpen}
        onCreateOrder={handleCreateOrder}
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
