import { Box, IdCard, MapPin, SquarePen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Warehouse } from "../types";

interface WarehouseCardProps {
  warehouse: Warehouse;
  onSelect?: (warehouse: Warehouse) => void;
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
}

const WarehouseCard = ({
  warehouse,
  onSelect,
  onEdit,
  onDelete,
}: WarehouseCardProps) => {
  const isMain = warehouse.kind === "Main Warehouse";
  const iconBg = isMain ? "bg-[#F5F0EA]" : "bg-[#E5E8D3]";
  const iconColor = isMain ? "text-primary" : "text-[#444A18]";

  return (
    <Card
      onClick={() => onSelect?.(warehouse)}
      className="group rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 hover:border-[#D4D4D8] cursor-pointer"
    >
      <CardContent className="flex flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${iconBg} transition-transform duration-300 ease-out group-hover:scale-105`}
              aria-hidden="true"
            >
              <Box
                size={24}
                className={`${iconColor} transition-transform duration-300 ease-out group-hover:scale-110`}
              />
            </span>
            <p className="truncate text-[16px] font-semibold text-[#28293D] sm:text-[17px]">
              {warehouse.name}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onEdit && (
              <button
                type="button"
                aria-label={`Edit ${warehouse.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(warehouse);
                }}
                className="group/edit flex size-5 cursor-pointer items-center justify-center text-black transition-all duration-150 hover:opacity-80 active:scale-90"
              >
                <SquarePen className="size-4.5 transition-transform duration-150 group-hover/edit:scale-115" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                aria-label={`Delete ${warehouse.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(warehouse);
                }}
                className="group/del flex size-5 cursor-pointer items-center justify-center text-[#C90000] transition-all duration-150 hover:opacity-80 active:scale-90"
              >
                <Trash2 className="size-4.5 transition-transform duration-150 group-hover/del:scale-115" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[#5A5A66]">
          <MapPin size={14} className="text-[#8B8B8B] shrink-0" />
          <span className="truncate">{warehouse.address}</span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[#5A5A66]">
          <IdCard size={14} className="text-[#8B8B8B] shrink-0" />
          ID: {warehouse.shortId}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseCard;
