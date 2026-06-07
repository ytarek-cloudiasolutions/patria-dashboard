import { Box, IdCard, MapPin } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Warehouse } from "../types";

interface WarehouseCardProps {
  warehouse: Warehouse;
}

const WarehouseCard = ({ warehouse }: WarehouseCardProps) => {
  const isMain = warehouse.kind === "Main Warehouse";
  const iconBg = isMain ? "bg-[#F5F0EA]" : "bg-[#BDC48A]";
  const iconColor = isMain ? "text-primary" : "text-[#444A18]";

  return (
  <Card className="rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
    <CardContent className="flex flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-9 items-center justify-center rounded-[10px] ${iconBg}`}
          aria-hidden="true"
        >
          <Box size={24} className={iconColor} />
        </span>
        <p className="text-[16px] font-semibold text-[#28293D] sm:text-[17px]">
          {warehouse.name}
        </p>
      </div>

      <div className="flex items-center gap-2 text-[13px] text-[#5A5A66]">
        <MapPin size={14} className="text-[#8B8B8B]" />
        {warehouse.address}
      </div>

      <div className="flex items-center gap-2 text-[13px] text-[#5A5A66]">
        <IdCard size={14} className="text-[#8B8B8B]" />
        ID: {warehouse.shortId}
      </div>
    </CardContent>
  </Card>
  );
};

export default WarehouseCard;
