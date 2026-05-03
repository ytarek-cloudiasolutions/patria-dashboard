import { MapPin, Hash, Package } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Warehouse } from "../types";

interface WarehouseCardProps {
  warehouse: Warehouse;
}

const WarehouseCard = ({ warehouse }: WarehouseCardProps) => {
  const isMain = warehouse.type === "Main Warehouse";

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-[#E5E5E5] bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Icon + Name */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]",
            isMain ? "bg-[#F5F0EA]" : "bg-[#E8F5EE]"
          )}
        >
          <Package
            size={20}
            className={isMain ? "text-[#7A6518]" : "text-[#1A7A45]"}
          />
        </div>
        <span className="text-[16px] font-bold text-[#28293D]">
          {warehouse.name}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <MapPin size={13} className="shrink-0" />
        {warehouse.address}
      </div>

      {/* ID */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <Hash size={13} className="shrink-0" />
        ID: {warehouse.id.replace("wh-", "1D9DEE").toUpperCase()}
      </div>
    </div>
  );
};

export default WarehouseCard;
