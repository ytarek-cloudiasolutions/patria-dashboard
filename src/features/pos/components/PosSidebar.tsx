import {
  CalendarClock,
  Clock3,
  LayoutGrid,
  Lock,
  Minus,
  Plus,
  Store,
  Users,
} from "lucide-react";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { POS_TABLE_OPTIONS } from "../data";
import type { OrderType } from "../types";
import type { DropdownSelectOption } from "@/shared/types/DropdownSelect.types";

type PosSidebarProps = {
  orderType: OrderType;
  selectedTable: string;
  tableOptions?: DropdownSelectOption[] | string[];
  customerCount?: number;
  shiftOpen: boolean;
  onOrderTypeChange: (value: OrderType) => void;
  onTableChange: (value: string) => void;
  onCustomerCountChange?: (count: number) => void;
  onTableMenuOpenChange: (open: boolean) => void;
  onToggleShift: () => void;
  onOpenPendingOrders: () => void;
  onOpenEmployeeAccounts: () => void;
  onCloseRegister: () => void;
  onBackToDashboard: () => void;
};

const PosSidebar = ({
  orderType,
  selectedTable,
  tableOptions,
  customerCount = 1,
  shiftOpen,
  onOrderTypeChange,
  onTableChange,
  onCustomerCountChange,
  onTableMenuOpenChange,
  onToggleShift,
  onOpenPendingOrders,
  onOpenEmployeeAccounts,
  onCloseRegister,
  onBackToDashboard,
}: PosSidebarProps) => {
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <aside className="z-30 flex h-svh w-[240px] shrink-0 flex-col overflow-hidden bg-white">
      {/* Brand */}
      <div className="shrink-0 px-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[5px] bg-[#8F6900] p-2">
            <Store className="size-6 text-white" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[18px] font-semibold leading-[19.26px] tracking-[0.36px] text-[#333333]">
              Patria POS
            </h1>
            <p className="text-[12px] font-normal leading-[16.80px] tracking-[0.24px] text-[#595959]">
              {t("Cashier Terminal")}
            </p>
          </div>
        </div>

        {/* Order type toggle */}
        <div className="mt-6 flex h-[56px] w-full items-center justify-center gap-[6px] overflow-hidden rounded-[12px] bg-[#F5F0EA] p-1">
          {(["dine-in", "takeaway"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={cn(
                "flex h-[40px] flex-1 items-center justify-center rounded-[5px] px-[12px] text-[12px] font-semibold uppercase transition-colors cursor-pointer",
                orderType === type
                  ? "bg-[#8F6900] text-white leading-6"
                  : "bg-transparent text-[#8F6900] leading-[16.80px] tracking-[0.24px]",
              )}
              onClick={() => onOrderTypeChange(type)}
            >
              {type === "dine-in" ? t("Dine-in") : t("Takeaway")}
            </button>
          ))}
        </div>
      </div>

      {/* Table & Guests selection */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-6">
        {orderType === "dine-in" && (
          <div className="flex flex-col gap-6">
            {/* Table Number */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-medium text-[#595959]">
                {t("Table Number")}{" "}
                <span className="text-[#C90000]">*</span>
              </label>
              <DropdownSelect
                options={
                  tableOptions && tableOptions.length > 0
                    ? tableOptions
                    : POS_TABLE_OPTIONS
                }
                selected={selectedTable}
                onSelect={onTableChange}
                onOpenChange={onTableMenuOpenChange}
                placeholder={t("Select Table")}
                align="start"
                className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[14px] font-normal text-[#8B8B8B] md:w-full [&_svg]:size-5 cursor-pointer"
              />
            </div>

            {/* Number of Customers */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-semibold text-[#595959]">
                {t("Number of Customers")}{" "}
                <span className="text-[#C90000]">*</span>
              </label>
              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onCustomerCountChange?.(Math.max(0, customerCount - 1))
                  }
                  className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#8F6900] text-white transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <Minus className="size-4 text-white" />
                </button>

                <div className="flex h-[46px] flex-1 items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-center">
                  <span className="text-[16px] font-medium text-[#333333]">
                    {customerCount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onCustomerCountChange?.(customerCount + 1)
                  }
                  className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#8F6900] text-white transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <Plus className="size-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions - Matching Figma specs exactly */}
      <div className="shrink-0 space-y-[18px] px-3.5 pb-6 pt-4">
        {/* Open/Close Shift */}
        <button
          className="flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#8F6900] bg-white px-3 text-[12px] font-semibold leading-6 text-[#8F6900] cursor-pointer whitespace-nowrap"
          onClick={onToggleShift}
        >
          <CalendarClock className="size-[18px] text-[#8F6900] shrink-0" />
          <span className="whitespace-nowrap">{shiftOpen ? t("Close Shift") : t("Open Shift")}</span>
        </button>

        {/* Pending Orders */}
        <button
          className="flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#004EF9] bg-[#EDF4FB] px-3 text-[12px] font-semibold leading-6 text-[#3574FF] cursor-pointer whitespace-nowrap"
          onClick={onOpenPendingOrders}
        >
          <Clock3 className="size-[18px] text-[#3574FF] shrink-0" />
          <span className="whitespace-nowrap">{t("Pending Orders")}</span>
        </button>

        {/* Employees accounts */}
        <button
          className="flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#7E00D7] bg-[#F3E9FA] px-3 text-[12px] font-semibold leading-6 text-[#9524E4] cursor-pointer whitespace-nowrap"
          onClick={onOpenEmployeeAccounts}
        >
          <Users className="size-[18px] text-[#9524E4] shrink-0" />
          <span className="whitespace-nowrap">{t("Employees accounts")}</span>
        </button>

        {/* Close Register */}
        <button
          className="flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] bg-[#C90000] px-3 text-[12px] font-semibold uppercase leading-6 text-white cursor-pointer whitespace-nowrap"
          onClick={onCloseRegister}
        >
          <Lock className="size-[18px] text-white shrink-0" />
          <span className="whitespace-nowrap">{t("CLOSE REGISTER")}</span>
        </button>

        {/* Back to Dashboard */}
        <button
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#F5F0EA] px-2 text-[11.5px] font-bold uppercase tracking-tight text-[#8F6900] cursor-pointer whitespace-nowrap"
          onClick={onBackToDashboard}
        >
          <LayoutGrid className="size-[18px] text-[#8F6900] shrink-0" />
          <span className="whitespace-nowrap">{t("Back to Dashboard")}</span>
        </button>
      </div>
    </aside>
  );
};

export default PosSidebar;
