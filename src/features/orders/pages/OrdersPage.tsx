import { useMemo, useState } from "react";
import {
  Smartphone,
  CheckCheck,
  ClipboardList,
  Hourglass,
  Monitor,
  Plus,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import {
  MOCK_ORDERS,
  ORDER_SOURCE_LABELS,
  ORDER_SOURCE_SUMMARIES,
  PRODUCT_OPTIONS,
} from "../data";
import NewPosOrderDialog from "../components/NewPosOrderDialog";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import type { Order, OrderCategory, OrderSource, OrderStatus } from "../types";
import TabItem from "@/shared/components/TabItem";

const SOURCE_ICONS: Record<OrderSource, LucideIcon> = {
  application: Smartphone,
  pos: Monitor,
};

const sourceCounts: Record<OrderSource, number> = {
  application: 44,
  pos: 16,
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategory>("All Categories");
  const [activeSource, setActiveSource] = useState<OrderSource>("application");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

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

  const handleCreateOrder = (order: Order) => {
    setOrders((previous) => [order, ...previous]);
    setActiveSource("pos");
  };

  return (
    <>
      {(isCategoryMenuOpen || isStatusMenuOpen) && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/15" />
      )}

      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <HeaderLayout
          title="Orders"
          description="Manage and track customer orders"
        />
        <DefaultButton
          data={{
            buttonText: "New POS Order",
            icon: <Plus className="size-4.5" />,
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      </div>

      <div className="space-y-6">
        <OrdersFilters
          searchValue={searchValue}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchValue}
          onCategoryChange={setSelectedCategory}
          onCategoryMenuOpenChange={setIsCategoryMenuOpen}
        />

        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(sourceCounts) as OrderSource[]).map((source) => (
            <TabItem
              key={source}
              value={source}
              label={ORDER_SOURCE_LABELS[source]}
              icon={SOURCE_ICONS[source]}
              count={sourceCounts[source]}
              isActive={source === activeSource}
              onClick={(value) => setActiveSource(value as OrderSource)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            data={{
              title: "Revenue",
              value: `EGP ${summary.revenue.toLocaleString()}`,
              icon: <TrendingUp className="size-5" />,
              iconColor: "text-primary",
              badgeColor: "bg-[#F5F0EA]",
            }}
          />
          <OverviewCard
            data={{
              title: "Total Orders",
              value: summary.totalOrders,
              icon: <ClipboardList className="size-5" />,
              iconColor: "text-[#3574FF]",
              badgeColor: "bg-[#DCEAFF]",
            }}
          />
          <OverviewCard
            data={{
              title: "Pending",
              value: summary.pending,
              icon: <Hourglass className="size-5" />,
              iconColor: "text-[#C7861E]",
              badgeColor: "bg-[#FFF7E6]",
            }}
          />
          <OverviewCard
            data={{
              title: "Delivered",
              value: summary.delivered,
              icon: <CheckCheck className="size-5" />,
              iconColor: "text-[#059B5A]",
              badgeColor: "bg-[#E2F4ED]",
            }}
          />
        </div>

        <OrdersTable
          orders={filteredOrders}
          onViewOrder={setSelectedOrder}
          onUpdateStatus={updateStatus}
          onStatusMenuOpenChange={setIsStatusMenuOpen}
        />
      </div>

      <OrderDetailsDialog
        open={selectedOrder !== null}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      />

      <NewPosOrderDialog
        open={isCreateDialogOpen}
        productOptions={PRODUCT_OPTIONS}
        onOpenChange={setIsCreateDialogOpen}
        onCreateOrder={handleCreateOrder}
      />
    </>
  );
};

export default OrdersPage;
