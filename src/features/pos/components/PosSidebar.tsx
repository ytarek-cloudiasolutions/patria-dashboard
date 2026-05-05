import { BriefcaseBusiness, Clock3, Grid2X2, Lock, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderType } from "../types";
import { POS_CATEGORIES, POS_TABLE_OPTIONS } from "../data";

type PosSidebarProps = {
  orderType: OrderType;
  selectedTable: string;
  activeCategory: string;
  isShiftOpen: boolean;
  onOrderTypeChange: (value: OrderType) => void;
  onTableChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTableMenuOpenChange: (open: boolean) => void;
  onOpenShift: () => void;
  onCloseShift: () => void;
};

const PosSidebar = ({
  orderType,
  selectedTable,
  activeCategory,
  isShiftOpen,
  onOrderTypeChange,
  onTableChange,
  onCategoryChange,
  onTableMenuOpenChange,
  onOpenShift,
  onCloseShift,
}: PosSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="z-70 flex h-svh w-[218px] shrink-0 flex-col overflow-hidden border-r border-[#EDEBE7] bg-white">
      <div className="shrink-0 px-3 py-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#9B7200]">
            <Store className="size-5 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold leading-5 text-[#1F2433]">
              Patria POS
            </p>
            <p className="text-[11px] text-[#8B8B8B]">Cashier Terminal</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-[8px] bg-[#F5F0EA] p-1">
          <button
            className={cn(
              "h-9 rounded-[6px] text-[11px] font-semibold transition-colors",
              orderType === "dine-in"
                ? "bg-[#9B7200] text-white"
                : "text-[#9B7200]"
            )}
            onClick={() => onOrderTypeChange("dine-in")}
          >
            DINE-IN
          </button>
          <button
            className={cn(
              "h-9 rounded-[6px] text-[11px] font-semibold transition-colors",
              orderType === "takeaway"
                ? "bg-[#9B7200] text-white"
                : "text-[#9B7200]"
            )}
            onClick={() => onOrderTypeChange("takeaway")}
          >
            TAKEAWAY
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {orderType === "dine-in" && (
          <div className="mb-5 px-1">
            <p className="mb-2 text-[10px] font-semibold text-[#676767]">
              Table Number
            </p>
            <DropdownSelect
              options={POS_TABLE_OPTIONS}
              selected={selectedTable}
              onSelect={onTableChange}
              onOpenChange={onTableMenuOpenChange}
              placeholder="Select Table"
              align="start"
              className="h-10 rounded-[8px] px-3 text-[12px] font-medium text-[#8B8B8B] md:w-full [&_svg]:size-5"
            />
          </div>
        )}

        <div className="px-1">
          <p className="mb-2 text-[10px] font-semibold text-[#676767]">
            Categories
          </p>
          <div className="space-y-1">
            {POS_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  className={cn(
                    "flex h-8 w-full items-center justify-between rounded-[8px] px-3 text-[11px] font-medium",
                    isActive
                      ? "bg-[#9B7200] text-white"
                      : "text-[#252525] hover:bg-[#F5F0EA]"
                  )}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-3.5" />
                    {category.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[8px] leading-4",
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-[#FAF7F1] text-[#7B7B7B]"
                    )}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-3 bg-white px-2 pb-7 pt-3">
        {isShiftOpen ? (
          <>
            <Button
              variant="outline"
              className="h-9 w-full rounded-[4px] border-[#9B7200] bg-white text-[11px] font-semibold text-[#9B7200]"
            >
              <Clock3 className="size-3.5" />
              Pending orders
            </Button>
            <Button
              className="h-9 w-full rounded-[4px] bg-[#D40000] text-[11px] font-semibold text-white hover:bg-[#B90000]"
              onClick={onCloseShift}
            >
              <BriefcaseBusiness className="size-3.5" />
              Close Shift
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="h-9 w-full rounded-[4px] border-[#9B7200] bg-white text-[11px] font-semibold text-[#9B7200]"
            onClick={onOpenShift}
          >
            <BriefcaseBusiness className="size-3.5" />
            Open Shift
          </Button>
        )}

        <Button
          variant="outline"
          className="h-9 w-full rounded-[4px] border-[#FDE3E3] bg-[#FFF2F2] text-[10px] font-semibold uppercase text-[#D40000] hover:bg-[#FFEAEA]"
        >
          <Lock className="size-3.5" />
          Close Register
        </Button>
        <Button
          variant="outline"
          className="h-9 w-full rounded-[4px] border-[#F5F0EA] bg-[#F7F1E9] text-[10px] font-semibold uppercase text-[#9B7200]"
          onClick={() => navigate("/")}
        >
          <Grid2X2 className="size-3.5" />
          Back to Dashboard
        </Button>
      </div>
    </aside>
  );
};

export default PosSidebar;
