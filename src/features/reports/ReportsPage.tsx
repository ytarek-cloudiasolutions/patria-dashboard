import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Receipt } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { useWarehouses } from "@/features/warehouses/hooks/useWarehouses";
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

const getDefaultFromDate = () => {
  const d = new Date();
  const prevMonthDate = new Date(d.getFullYear(), d.getMonth() - 1, 29);
  const year = prevMonthDate.getFullYear();
  const month = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
  const day = String(prevMonthDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultToDate = () => {
  const d = new Date();
  const currMonthDate = new Date(d.getFullYear(), d.getMonth(), 29);
  const year = currMonthDate.getFullYear();
  const month = String(currMonthDate.getMonth() + 1).padStart(2, "0");
  const day = String(currMonthDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ReportsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ReportsTab>("orders");
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Shared Filter States
  const [fromDate, setFromDate] = useState(getDefaultFromDate);
  const [toDate, setToDate] = useState(getDefaultToDate);
  const [orderType, setOrderType] = useState<OrderType>("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | StockStatus>("All");
  const [warehouse, setWarehouse] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get categories from inventory items
  const { items } = useInventory();
  const { warehouses: warehouseData, getWarehouses } = useWarehouses();

  useEffect(() => {
    getWarehouses();
  }, [getWarehouses]);

  const warehouseOptions = useMemo(() => {
    const list = Array.isArray(warehouseData)
      ? warehouseData
      : (warehouseData as any)?.warehouses ?? [];
    return [
      { value: "All", label: t("All") },
      ...list.map((w: any) => ({
        value: w._id,
        label: w.name,
      })),
    ];
  }, [warehouseData, t]);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))),
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      {isDropdownOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      {!hasLoaded && (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <Receipt className="size-16 animate-spin text-primary" />
        </div>
      )}

      <div className={!hasLoaded ? "hidden" : ""}>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("From")}
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder={t("From")}
                  popoverPlacement="bottom-right"
                  withBackdrop
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("To")}
                </label>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder={t("To")}
                  popoverPlacement="bottom-right"
                  minDate={fromDate || undefined}
                  withBackdrop
                />
              </div>
            </div>
          )}

          {tab === "sales" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("From")}
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder={t("From")}
                  popoverPlacement="bottom-right"
                  withBackdrop
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("To")}
                </label>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder={t("To")}
                  popoverPlacement="bottom-right"
                  minDate={fromDate || undefined}
                  withBackdrop
                />
              </div>
            </div>
          )}

          {tab === "inventory" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("From")}
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder={t("From")}
                  popoverPlacement="bottom-right"
                  withBackdrop
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("To")}
                </label>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder={t("To")}
                  popoverPlacement="bottom-right"
                  minDate={fromDate || undefined}
                  withBackdrop
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("Warehouse")}
                </label>
                <DropdownSelect
                  options={warehouseOptions}
                  selected={warehouse}
                  onSelect={(val) => setWarehouse(val)}
                  onOpenChange={setIsDropdownOpen}
                  className="h-[50px] w-full md:w-full"
                  contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  align="start"
                />
              </div>
            </div>
          )}

          {tab === "discounts" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("From")}
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder={t("From")}
                  popoverPlacement="bottom-right"
                  withBackdrop
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-medium text-[#333333]">
                  {t("To")}
                </label>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder={t("To")}
                  popoverPlacement="bottom-right"
                  minDate={fromDate || undefined}
                  withBackdrop
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
              onOrderTypeChange={setOrderType}
              onDropdownOpenChange={setIsDropdownOpen}
              onInitialLoadComplete={() => setHasLoaded(true)}
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
              warehouse={warehouse}
            />
          )}
          {tab === "discounts" && (
            <DiscountsReportTab
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
