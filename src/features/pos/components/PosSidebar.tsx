import { useState, useEffect } from "react";
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
import PendingApprovalsWidget from "./PendingApprovalsWidget";
import PendingRequestsWidget from "./PendingRequestsWidget";
import type { DiscountApprovalRequestItem } from "@/features/offers/api/cashierDiscountsApi";

type PosSidebarProps = {
  orderType: OrderType;
  selectedTable: string;
  tableOptions?: DropdownSelectOption[] | string[];
  customerCount?: number;
  shiftOpen: boolean;
  isTakeawayDisabled?: boolean;
  onOrderTypeChange: (value: OrderType) => void;
  onTableChange: (value: string) => void;
  onCustomerCountChange?: (count: number) => void;
  onTableMenuOpenChange: (open: boolean) => void;
  onToggleShift: () => void;
  onOpenPendingOrders: () => void;
  onOpenEmployeeAccounts: () => void;
  onCloseRegister: () => void;
  onBackToDashboard: () => void;
  onSelectPendingOrder?: (orderId: string, item?: DiscountApprovalRequestItem) => void;
};

const PosSidebar = ({
  orderType,
  selectedTable,
  tableOptions,
  customerCount = 1,
  shiftOpen,
  isTakeawayDisabled = false,
  onOrderTypeChange,
  onTableChange,
  onCustomerCountChange,
  onTableMenuOpenChange,
  onToggleShift,
  onOpenPendingOrders,
  onOpenEmployeeAccounts,
  onCloseRegister,
  onBackToDashboard,
  onSelectPendingOrder,
}: PosSidebarProps) => {
  const { t, language, toggleLanguage } = useTranslation();

  const [localCount, setLocalCount] = useState<string>(String(customerCount ?? 0));

  useEffect(() => {
    setLocalCount(String(customerCount ?? 0));
  }, [customerCount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setLocalCount(raw);
    if (raw !== "") {
      const parsed = parseInt(raw, 10);
      onCustomerCountChange?.(parsed);
    } else {
      onCustomerCountChange?.(0);
    }
  };

  const handleInputBlur = () => {
    if (localCount === "") {
      setLocalCount("0");
      onCustomerCountChange?.(0);
    } else {
      const parsed = parseInt(localCount, 10);
      setLocalCount(String(parsed));
      onCustomerCountChange?.(parsed);
    }
  };

  return (
    <aside className="z-30 flex h-svh w-[240px] shrink-0 flex-col overflow-hidden bg-white">
      {/* Brand */}
      <div className="shrink-0 px-4 pt-6">
        <div className="group flex items-center gap-4 cursor-default">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[5px] bg-[#8F6900] p-2 transition-transform duration-200 group-hover:scale-105">
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
          {(["dine-in", "takeaway"] as const).map((type) => {
            const isDisabled = type === "takeaway" && isTakeawayDisabled;
            return (
              <button
                key={type}
                type="button"
                disabled={isDisabled}
                title={isDisabled ? t("Takeaway is disabled for an active dine-in table order") : undefined}
                className={cn(
                  "flex h-[40px] flex-1 items-center justify-center rounded-[5px] px-[12px] text-[12px] font-semibold uppercase transition-all duration-200",
                  isDisabled
                    ? "opacity-40 cursor-not-allowed bg-transparent text-[#8F6900]/70"
                    : "cursor-pointer active:scale-95",
                  orderType === type
                    ? "bg-[#8F6900] text-white leading-6 shadow-xs"
                    : !isDisabled && "bg-transparent text-[#8F6900] leading-[16.80px] tracking-[0.24px] hover:bg-[#8F6900]/10",
                )}
                onClick={() => !isDisabled && onOrderTypeChange(type)}
              >
                {type === "dine-in" ? t("Dine-in") : t("Takeaway")}
              </button>
            );
          })}
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
                className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[14px] font-normal text-[#8B8B8B] md:w-full [&_svg]:size-5 cursor-pointer transition-colors hover:border-[#8F6900]/50"
              />
            </div>

            {/* Number of Customers */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-semibold text-[#595959]">
                {t("Number of Customers")}{" "}
                <span className="text-[#C90000]">*</span>
              </label>
              <div className="flex w-full items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(0, (customerCount ?? 0) - 1);
                    setLocalCount(String(next));
                    onCustomerCountChange?.(next);
                  }}
                  className="group/btn flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#8F6900] text-white transition-all duration-150 hover:bg-[#725400] active:scale-90 cursor-pointer"
                >
                  <Minus className="size-4 text-white transition-transform duration-150 group-hover/btn:scale-125" />
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={localCount}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="flex h-[46px] w-full min-w-0 flex-1 items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-white px-2 text-center text-[16px] font-medium text-[#333333] transition-colors duration-200 outline-none hover:border-[#D4D4D8] focus:border-[#8F6900] focus:ring-1 focus:ring-[#8F6900]"
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = (customerCount ?? 0) + 1;
                    setLocalCount(String(next));
                    onCustomerCountChange?.(next);
                  }}
                  className="group/btn flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#8F6900] text-white transition-all duration-150 hover:bg-[#725400] active:scale-90 cursor-pointer"
                >
                  <Plus className="size-4 text-white transition-transform duration-150 group-hover/btn:rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions - Matching Figma specs exactly */}
      <div className="shrink-0 space-y-[18px] px-3.5 pb-6 pt-4">
        {/* Pending Requests Widget (for Cashiers) */}
        <PendingRequestsWidget onSelectOrder={onSelectPendingOrder} className="w-full" />

        {/* Pending Approvals Widget (for Managers / Admins) */}
        <PendingApprovalsWidget className="w-full" />

        {/* Open/Close Shift */}
        <button
          className="group flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#8F6900] bg-white px-3 text-[12px] font-semibold leading-6 text-[#8F6900] cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#8F6900]/5 active:scale-98 hover:shadow-xs"
          onClick={onToggleShift}
        >
          <CalendarClock className="size-[18px] text-[#8F6900] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="whitespace-nowrap">{shiftOpen ? t("Close Shift") : t("Open Shift")}</span>
        </button>

        {/* Pending Orders */}
        <button
          className="group flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#004EF9] bg-[#EDF4FB] px-3 text-[12px] font-semibold leading-6 text-[#3574FF] cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#004EF9]/10 active:scale-98 hover:shadow-xs"
          onClick={onOpenPendingOrders}
        >
          <Clock3 className="size-[18px] text-[#3574FF] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="whitespace-nowrap">{t("Pending Orders")}</span>
        </button>

        {/* Employees accounts */}
        <button
          className="group flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#7E00D7] bg-[#F3E9FA] px-3 text-[12px] font-semibold leading-6 text-[#9524E4] cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#7E00D7]/10 active:scale-98 hover:shadow-xs"
          onClick={onOpenEmployeeAccounts}
        >
          <Users className="size-[18px] text-[#9524E4] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="whitespace-nowrap">{t("Employees accounts")}</span>
        </button>

        {/* Close Register */}
        <button
          className="group flex h-[40px] w-full items-center justify-center gap-2.5 rounded-[5px] bg-[#C90000] px-3 text-[12px] font-semibold uppercase leading-6 text-white cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#B30000] active:scale-98 hover:shadow-xs"
          onClick={onCloseRegister}
        >
          <Lock className="size-[18px] text-white shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="whitespace-nowrap">{t("CLOSE REGISTER")}</span>
        </button>

        {/* Back to Dashboard */}
        <button
          className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#F5F0EA] px-2 text-[11.5px] font-bold uppercase tracking-tight text-[#8F6900] cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#EFE7DC] active:scale-98 hover:shadow-xs"
          onClick={onBackToDashboard}
        >
          <LayoutGrid className="size-[18px] text-[#8F6900] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="whitespace-nowrap">{t("Back to Dashboard")}</span>
        </button>
      </div>
    </aside>
  );
};

export default PosSidebar;
