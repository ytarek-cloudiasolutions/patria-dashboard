import { Box, Store } from "lucide-react";
import WarehouseCard from "./WarehouseCard";
import type { Warehouse, WarehouseKind } from "../types";

interface WarehouseSectionProps {
  title: string;
  kind: WarehouseKind;
  warehouses: Warehouse[];
}

const WarehouseSection = ({
  title,
  kind,
  warehouses,
}: WarehouseSectionProps) => {
  const isMain = kind === "Main Warehouse";
  const Icon = isMain ? Store : Box;
  const titleColor = isMain ? "text-primary" : "text-[#444A18]";

  return (
    <section className="mb-6">
      <div
        className={`mb-3 flex items-center gap-2 text-[15px] font-semibold sm:text-[16px] ${titleColor}`}
      >
        <Icon size={20} />
        {title}
      </div>

      {warehouses.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-white px-4 py-6 text-center text-[13px] text-[#8B8B8B]">
          No {title.toLowerCase()} yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => (
            <WarehouseCard key={warehouse.id} warehouse={warehouse} />
          ))}
        </div>
      )}
    </section>
  );
};

export default WarehouseSection;
