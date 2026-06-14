import { useMemo, useState } from "react";
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
  ORDER_SOURCE_COUNTS,
  ORDER_SOURCE_LABELS,
  ORDER_SOURCE_SUMMARIES,
  PRODUCT_OPTIONS,
} from "../data";
import NewPosOrderDialog from "../components/NewPosOrderDialog";
import NewCallOrderDialog from "../components/NewCallOrderDialog";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import type { Order, OrderCategory, OrderSource, OrderStatus } from "../types";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";

const SOURCE_ICONS: Record<OrderSource, LucideIcon> = {
  application: Smartphone,
  pos: Monitor,
  call: Phone,
};

const OrdersPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategory>("All Categories");
  const [activeSource, setActiveSource] = useState<OrderSource>("application");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPosDialogOpen, setIsPosDialogOpen] = useState(false);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSource = order.source === activeSource;
      const matchesCategory =
        selectedCategory === "All Categories" ||
        order.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.customerPhone.toLowerCase().includes(normalizedSearch) ||
        order.paymentMethod.toLowerCase().includes(normalizedSearch) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(normalizedSearch)
        );

      return matchesSource && matchesCategory && matchesSearch;
    });
  }, [activeSource, orders, searchValue, selectedCategory]);

  const summary = ORDER_SOURCE_SUMMARIES[activeSource];
  const isCallTab = activeSource === "call";

  const handleSourceChange = (source: OrderSource) => {
    setActiveSource(source);
    setSelectedIds([]);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    setSelectedOrder((previous) =>
      previous && previous.id === orderId ? { ...previous, status } : previous
    );
  };

  const assignDriver = (orderId: string, driver: string) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, driver } : order
      )
    );
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
    setOrders((previous) =>
      previous.filter((order) => !selectedIds.includes(order.id))
    );
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  const handleCreateOrder = (order: Order) => {
    setOrders((previous) => [order, ...previous]);
    setActiveSource(order.source);
    setSelectedIds([]);
  };

  return (
    <>
      {(isCategoryMenuOpen || isStatusMenuOpen) && (
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
              buttonText: isCallTab ? t("New Call Order") : t("New POS Order"),
              icon: <Plus className="size-4.5" />,
              onClick: () =>
                isCallTab
                  ? setIsCallDialogOpen(true)
                  : setIsPosDialogOpen(true),
            }}
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <OrdersFilters
          searchValue={searchValue}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchValue}
          onCategoryChange={setSelectedCategory}
          onCategoryMenuOpenChange={setIsCategoryMenuOpen}
        />

        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(ORDER_SOURCE_COUNTS) as OrderSource[]).map((source) => (
            <TabItem
              key={source}
              value={source}
              label={t(ORDER_SOURCE_LABELS[source])}
              icon={SOURCE_ICONS[source]}
              count={ORDER_SOURCE_COUNTS[source]}
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

      <NewPosOrderDialog
        open={isPosDialogOpen}
        productOptions={PRODUCT_OPTIONS}
        onOpenChange={setIsPosDialogOpen}
        onCreateOrder={handleCreateOrder}
      />

      <NewCallOrderDialog
        open={isCallDialogOpen}
        productOptions={PRODUCT_OPTIONS}
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
