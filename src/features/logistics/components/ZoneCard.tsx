import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";

import { Clock, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { VISIBLE_ORDERS_COUNT } from "../data";
import type { Zone } from "../types";

interface ZoneCardProps {
  zone: Zone;
  onDispatch: (zone: Zone) => void;
}

const OrderTag = ({ status }: { status: Zone["orders"][number]["status"] }) => {
  if (status === "pending") {
    return (
      <span className="rounded-full border border-[#F5D8A8] bg-[#FFF5E6] px-3 py-1 text-[11px] font-semibold text-[#B56C00]">
        Pending
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full border border-[#A8DFBC] bg-[#E8F5EE] px-3 py-1 text-[11px] font-semibold text-[#1A7A45]">
      <Truck size={12} />
      Omnia
    </span>
  );
};

const ZoneCard = ({ zone, onDispatch }: ZoneCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const visibleOrders = expanded
    ? zone.orders
    : zone.orders.slice(0, VISIBLE_ORDERS_COUNT);

  const hiddenCount = zone.orders.length - VISIBLE_ORDERS_COUNT;

  return (
    <div className="flex flex-col rounded-[16px] border border-[#E5E5E5] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[20px] font-bold text-[#28293D]">{zone.name}</span>
        <Badge className="flex items-center gap-1.5 rounded-full bg-[#5C4A0E] px-3 py-1 text-[12px] font-semibold text-white">
          <Clock size={13} />
          {zone.totalOrders} Orders
        </Badge>
      </div>

      {/* Orders */}
      <div className="flex flex-col">
        {visibleOrders.map((order, index) => (
          <div
            key={`${order.id}-${index}`}
            className={cn(
              "flex items-center justify-between py-2.5",
              index < visibleOrders.length - 1 && "border-b border-[#F3F3F3]"
            )}
          >
            <div>
              <p className="text-[13px] font-bold text-[#28293D]">{order.id}</p>
              <p className="text-[11px] text-[#6B6B6B]">{order.customer}</p>
            </div>
            <OrderTag status={order.status} />
          </div>
        ))}
      </div>

      {/* View more / less */}
      {hiddenCount > 0 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="rounded-full border border-[#E5E5E5] px-4 py-1 text-[12px] text-[#6B6B6B] transition hover:bg-[#F8F7F4] cursor-pointer"
          >
            {expanded ? "Show less" : `View ${hiddenCount} more orders`}
          </button>
        </div>
      )}

      {/* Dispatch Button */}
      <button
        onClick={() => onDispatch(zone)}
        className="mt-4 w-full cursor-pointer rounded-[6px] border-[1.5px] border-[#5C4A0E] py-3 text-[14px] font-bold text-[#5C4A0E] transition hover:bg-[#F5F0EA]"
      >
        Dispatch Driver
      </button>
    </div>
  );
};

export default ZoneCard;