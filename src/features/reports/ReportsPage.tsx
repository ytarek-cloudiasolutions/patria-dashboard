import { useState } from "react";
import { RefreshCw } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import type { StockStatus } from "@/features/inventory/types";

import ReportsTabs from "./components/ReportsTabs";
import OrdersReportTab from "./components/OrdersReportTab";
import SalesReportTab from "./components/SalesReportTab";
import InventoryReportTab from "./components/InventoryReportTab";
import DiscountsReportTab from "./components/DiscountsReportTab";
import type { ReportsTab, OrderType } from "./types";

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: "All Types", label: "All Types" },
  { value: "Dine-In", label: "Dine-In" },
  { value: "Takeaway", label: "Takeaway" },
  { value: "Delivery", label: "Delivery" },
  { value: "Call", label: "Call" },
];

const ReportsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ReportsTab>("orders");
  const [refreshKey, setRefreshKey] = useState(0);

  // Shared Filter States
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | StockStatus>("All");
  const [warehouse, setWarehouse] = useState("All");

  // Get categories from inventory items
  const { items } = useInventory();
  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))),
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Reports and Statistics")}
          description={t("Detailed Performance Data")}
        />
        <DefaultButton
          data={{
            buttonText: "",
            onClick: handleRefresh,
            icon: <RefreshCw className="size-5" />,
            className:
              "bg-[#F5F0EA] text-[#8F6900] hover:bg-[#F5F0EA]/80 h-14 w-14 min-w-0 px-0 rounded-[8px]",
          }}
        />
      </div>

      {/* Filters Container (Above the Tabs) */}
      <div className="mb-6 w-full">
        {tab === "orders" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("From")}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("To")}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("Type")}
              </label>
              <DropdownSelect
                options={ORDER_TYPES.map((opt) => ({ value: opt.value, label: t(opt.label) }))}
                selected={orderType}
                onSelect={(val) => setOrderType(val as OrderType)}
                className="h-[50px] w-full md:w-full"
                contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
              />
            </div>
          </div>
        )}

        {tab === "sales" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("From")}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("To")}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("Category")}
              </label>
              <DropdownSelect
                options={categories.map((c) => ({ value: c, label: c === "All" ? t("All Categories") : c }))}
                selected={categoryFilter}
                onSelect={(val) => setCategoryFilter(val)}
                className="h-[50px] w-full md:w-full"
                contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("Stock Status")}
              </label>
              <DropdownSelect
                options={[
                  { value: "All", label: t("All Status") },
                  { value: "Available", label: t("Available") },
                  { value: "Low Stock", label: t("Low Stock") },
                  { value: "Out Of Stock", label: t("Out Of Stock") },
                ]}
                selected={statusFilter}
                onSelect={(val) => setStatusFilter(val as "All" | StockStatus)}
                className="h-[50px] w-full md:w-full"
                contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
              />
            </div>
          </div>
        )}

        {tab === "discounts" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("From")}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("To")}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-[#333333]">
                {t("Warehouse")}
              </label>
              <DropdownSelect
                options={[{ value: "All", label: t("All") }]}
                selected={warehouse}
                onSelect={(val) => setWarehouse(val)}
                className="h-[50px] w-full md:w-full"
                contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <ReportsTabs active={tab} onChange={setTab} />

      {/* Tab Content */}
      <div key={refreshKey}>
        {tab === "orders" && (
          <OrdersReportTab
            fromDate={fromDate}
            toDate={toDate}
            orderType={orderType}
          />
        )}
        {tab === "sales" && (
          <SalesReportTab
            fromDate={fromDate}
            toDate={toDate}
          />
        )}
        {tab === "inventory" && (
          <InventoryReportTab
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
          />
        )}
        {tab === "discounts" && (
          <DiscountsReportTab
            fromDate={fromDate}
            toDate={toDate}
            warehouse={warehouse}
          />
        )}
      </div>
    </>
  );
};

export default ReportsPage;
