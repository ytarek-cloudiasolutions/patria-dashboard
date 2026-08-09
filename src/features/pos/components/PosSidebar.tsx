import {
  CalendarClock,
  Clock3,
  LayoutGrid,
  Lock,
  Store,
  Users,
} from "lucide-react";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { POS_TABLE_OPTIONS } from "../data";
import type { OrderType } from "../types";

type PosSidebarProps = {
  orderType: OrderType;
  selectedTable: string;
  tableOptions?: string[];
  shiftOpen: boolean;
  onOrderTypeChange: (value: OrderType) => void;
  onTableChange: (value: string) => void;
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
  shiftOpen,
  onOrderTypeChange,
  onTableChange,
  onTableMenuOpenChange,
  onToggleShift,
  onOpenPendingOrders,
  onOpenEmployeeAccounts,
  onCloseRegister,
  onBackToDashboard,
}: PosSidebarProps) => {
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <aside className="z-70 flex h-svh w-[240px] shrink-0 flex-col overflow-hidden border-e border-[#EDEBE7] bg-white">
      {/* Brand */}
      <div className="shrink-0 px-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#8F6900]">
            <Store className="size-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold leading-5 text-[#333333]">
              Patria POS
            </p>
            <p className="truncate text-[11px] text-[#8B8B8B]">
              {t("Cashier Terminal")}
            </p>
          </div>
        </div>

        {/* Order type toggle */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-[8px] bg-[#F5F0EA] p-1">
          {(["dine-in", "takeaway"] as const).map((type) => (
            <button
              key={type}
              className={cn(
                "h-9 rounded-[6px] text-[11px] font-bold uppercase tracking-wide cursor-pointer",
                orderType === type
                  ? "bg-[#8F6900] text-white"
                  : "text-[#8F6900] bg-transparent",
              )}
              onClick={() => onOrderTypeChange(type)}
            >
              {type === "dine-in" ? t("Dine-in") : t("Takeaway")}
            </button>
          ))}
        </div>
      </div>

      {/* Table selection */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-5">
        {orderType === "dine-in" && (
          <div>
            <p className="mb-2 text-[11px] font-semibold text-[#676767]">
              {t("Table Number")}
            </p>
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
              className="h-11 rounded-[8px] px-3 text-[13px] font-medium text-[#8B8B8B] md:w-full [&_svg]:size-5 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Bottom actions - Matching Figma specs exactly */}
      <div className="shrink-0 space-y-[18px] border-t border-[#F3F3F3] px-3.5 pb-6 pt-4">
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
