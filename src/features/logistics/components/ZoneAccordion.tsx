import { useState } from "react";
import { ChevronDown, Truck } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { Zone, ZoneOrder, ZoneOrderStatus } from "../types";

interface ZoneAccordionProps {
  zones: Zone[];
  selectedIds: Set<string>;
  onToggleOrder: (id: string) => void;
  onToggleZone: (zone: Zone) => void;
}

const STATUS_STYLES: Record<ZoneOrderStatus, string> = {
  Waiting: "border-[#B56C00] text-[#B56C00]",
  Processing: "border-[#B56C00] text-[#B56C00]",
  Cancelled: "border-[#C90000] text-[#C90000]",
};

const OrderBadge = ({ order }: { order: ZoneOrder }) => {
  const { t } = useTranslation();
  if (order.assignedDriverName) {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-full border border-[#B58A00] bg-white px-2.5 text-[11px] font-semibold text-[#B58A00]">
        <Truck size={12} />
        {order.assignedDriverName}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border bg-white px-2.5 text-[11px] font-semibold",
        STATUS_STYLES[order.status],
      )}
    >
      {t(order.status)}
    </span>
  );
};

const formatEgp = (value: number) => `EGP ${value.toLocaleString("en-US")}`;

const ZoneAccordion = ({
  zones,
  selectedIds,
  onToggleOrder,
  onToggleZone,
}: ZoneAccordionProps) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-3">
      {zones.map((zone) => {
        const unassigned = zone.orders.filter((o) => !o.assignedDriverName);
        const unassignedCount = unassigned.length;
        const allSelected =
          unassignedCount > 0 &&
          unassigned.every((o) => selectedIds.has(o.id));
        const isOpen = !collapsed.has(zone.id);

        return (
          <div
            key={zone.id}
            className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white"
          >
            {/* Zone header */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Checkbox
                checked={allSelected}
                disabled={unassignedCount === 0}
                onCheckedChange={() => onToggleZone(zone)}
                className="size-5 rounded-[6px] border-[#8F6900]"
                aria-label={`Select all in ${zone.name}`}
              />
              <span className="flex-1 text-[15px] font-bold text-[#28293D]">
                {zone.name}
              </span>
              <span
                className={cn(
                  "inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold",
                  unassignedCount > 0
                    ? "bg-primary text-white"
                    : "bg-[#E5E5E5] text-[#595959]",
                )}
              >
                {t("Unassigned")} ({unassignedCount})
              </span>
              <button
                type="button"
                onClick={() => toggleCollapse(zone.id)}
                aria-label={`Toggle ${zone.name}`}
                className="cursor-pointer text-[#28293D]"
              >
                <ChevronDown
                  className={cn(
                    "size-5 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </div>

            {/* Orders */}
            {isOpen && (
              <div className="border-t border-[#F0EEEA]">
                {zone.orders.map((order) => {
                  const assigned = !!order.assignedDriverName;
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 border-b border-[#F4F2EE] px-4 py-3 last:border-b-0"
                    >
                      <Checkbox
                        checked={selectedIds.has(order.id)}
                        disabled={assigned}
                        onCheckedChange={() => onToggleOrder(order.id)}
                        className="size-5 rounded-[6px] border-[#8F6900] disabled:opacity-40"
                        aria-label={`Select ${order.reference}`}
                      />
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-white">
                        {order.customer.trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[#28293D]">
                          <span dir="ltr">{order.reference}</span> ·{" "}
                          {order.customer}
                        </p>
                        <p className="truncate text-[11px] text-[#8B8B8B]">
                          {order.address}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[13px] font-semibold text-[#28293D]" dir="ltr">
                          {formatEgp(order.amount)}
                        </span>
                        <OrderBadge order={order} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ZoneAccordion;
