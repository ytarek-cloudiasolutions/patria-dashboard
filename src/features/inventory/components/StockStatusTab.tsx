import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { cn } from "@/lib/utils";
import type { InventoryProduct } from "../types";
import AdjustQuantityCell from "./AdjustQuantityCell";

interface StockStatusTabProps {
  products: InventoryProduct[];
  adjustments: Record<string, number>;
  onAdjust: (productId: string, value: number) => void;
}

const StatusBadge = ({ status }: { status: InventoryProduct["status"] }) => {
  const styles: Record<InventoryProduct["status"], string> = {
    "Out Of Stock": "border border-[#F5A8A8] bg-white text-[#C90000]",
    "Low Stock": "border border-[#F5D8A8] bg-white text-[#B56C00]",
    "In Stock": "border border-[#A8DFC4] bg-white text-[#1A7A45]",
  };
  return (
    <span
      className={cn(
        "rounded-full px-4 py-1.5 text-[12px] font-semibold",
        styles[status]
      )}
    >
      {status}
    </span>
  );
};

const CategoryBadge = ({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) => (
  <span
    className={cn(
      "rounded-full px-3 py-1 text-[11px] font-semibold",
      colorClass
    )}
  >
    {label}
  </span>
);

const StockStatusTab = ({
  products,
  adjustments,
  onAdjust,
}: StockStatusTabProps) => {
  const [search, setSearch] = useState("");
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-3">
        <Search size={16} className="shrink-0 text-[#AAAAAA]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-3 whitespace-nowrap">
              PRODUCT
            </TableHead>
            <TableHead className="px-4 py-3 whitespace-nowrap">
              CATEGORY
            </TableHead>
            <TableHead className="px-4 py-3 whitespace-nowrap">
              CURRENT QUANTITY
            </TableHead>
            <TableHead className="px-4 py-3 whitespace-nowrap">
              MINIMUM QUANTITY
            </TableHead>
            <TableHead className="px-4 py-3 whitespace-nowrap">
              STATUS
            </TableHead>
            <TableHead className="px-4 py-3 whitespace-nowrap">
              ADJUST QUANTITY
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((product) => {
            const qty = adjustments[product.id] ?? product.currentQuantity;
            return (
              <TableRow
                key={product.id}
                className="hover:bg-[#FAFAF8] cursor-default"
                onClick={() => setActiveCell(null)}
              >
                {/* Product */}
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] bg-[#F5F0EA]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-[#28293D]">
                      {product.name}
                    </span>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <CategoryBadge
                    label={product.category}
                    colorClass={product.categoryColor}
                  />
                </TableCell>

                {/* Current Qty */}
                <TableCell className="px-4 py-3 whitespace-nowrap text-center text-[14px] text-[#28293D]">
                  {product.currentQuantity}
                </TableCell>

                {/* Min Qty */}
                <TableCell className="px-4 py-3 whitespace-nowrap text-center text-[14px] text-[#28293D]">
                  {product.minimumQuantity}
                </TableCell>

                {/* Status */}
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={product.status} />
                </TableCell>

                {/* Adjust Quantity */}
                <TableCell
                  className="px-4 py-3 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AdjustQuantityCell
                    productId={product.id}
                    value={qty}
                    isActive={activeCell === product.id}
                    onChange={(id, val) => {
                      onAdjust(id, val);
                    }}
                    onActivate={(id) => setActiveCell(id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockStatusTab;
