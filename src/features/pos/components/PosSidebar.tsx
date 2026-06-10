import {
  CalendarClock,
  Clock3,
  LayoutDashboard,
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
  const { t } = useTranslation();

  const actionButton =
    "flex h-11 w-full items-center gap-2.5 rounded-[8px] border px-3.5 text-[12px] font-semibold transition-colors";

  return (
    <aside className="z-70 flex h-svh w-[230px] shrink-0 flex-col overflow-hidden border-e border-[#EDEBE7] bg-white">
      {/* Brand */}
      <div className="shrink-0 px-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[8px] bg-primary">
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
                "h-9 rounded-[6px] text-[11px] font-bold uppercase tracking-wide transition-colors",
                orderType === type
                  ? "bg-primary text-white"
                  : "text-primary hover:bg-white/60",
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
              options={POS_TABLE_OPTIONS}
              selected={selectedTable}
              onSelect={onTableChange}
              onOpenChange={onTableMenuOpenChange}
              placeholder={t("Select Table")}
              align="start"
              className="h-11 rounded-[8px] px-3 text-[13px] font-medium text-[#8B8B8B] md:w-full [&_svg]:size-5"
            />
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 space-y-2.5 border-t border-[#F3F3F3] px-4 pb-6 pt-4">
        <button
          className={cn(
            actionButton,
            "border-primary/40 bg-white text-primary hover:bg-[#FBF6EE]",
          )}
          onClick={onToggleShift}
        >
          <CalendarClock className="size-4 shrink-0" />
          {shiftOpen ? t("Close Shift") : t("Open Shift")}
        </button>

        <button
          className={cn(
            actionButton,
            "border-[#CBD9F7] bg-[#F2F6FF] text-[#2F66E0] hover:bg-[#E8F0FE]",
          )}
          onClick={onOpenPendingOrders}
        >
          <Clock3 className="size-4 shrink-0" />
          {t("Pending Orders")}
        </button>

        <button
          className={cn(
            actionButton,
            "border-[#DCCBF9] bg-[#F7F2FF] text-[#7A3FF2] hover:bg-[#F0E8FE]",
          )}
          onClick={onOpenEmployeeAccounts}
        >
          <Users className="size-4 shrink-0" />
          {t("Employees accounts")}
        </button>

        <button
          className={cn(
            actionButton,
            "border-[#F6D5D5] bg-[#FFF4F4] uppercase text-[#D40000] hover:bg-[#FFEAEA]",
          )}
          onClick={onCloseRegister}
        >
          <Lock className="size-4 shrink-0" />
          {t("Close Register")}
        </button>

        <button
          className={cn(
            actionButton,
            "border-[#EDE3D2] bg-[#F7F1E9] uppercase text-primary hover:bg-[#F1E8D9]",
          )}
          onClick={onBackToDashboard}
        >
          <LayoutDashboard className="size-4 shrink-0" />
          {t("Back to Dashboard")}
        </button>
      </div>
    </aside>
  );
};

export default PosSidebar;
