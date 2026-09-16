import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { Check, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "../types";

const STATUS_STYLES: Record<string, string> = {
  "Out Of Stock": "bg-[#C90000] text-white border-[#C90000]",
  "Low Stock": "bg-[#FE9A001A] text-[#C7861E] border-[#C7861E]",
  Available: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
};

interface StockStatusTableProps {
  items: InventoryItem[];
  adjustments?: Record<string | number, number>;
  onAdjust?: (id: string | number, value: number) => void;
  selectedItemIds?: Set<string | number>;
  onToggleSelect?: (id: string | number) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  infiniteItemIds?: Set<string | number>;
}

const StockStatusTable = ({
  items,
  selectedItemIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected = false,
  isIndeterminate = false,
  infiniteItemIds = new Set(),
}: StockStatusTableProps) => {
  const { t } = useTranslation();

  const checkIsInfinite = (item: InventoryItem) =>
    infiniteItemIds.has(item.id) || !!item.isInfinite;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F5F0EA] hover:bg-[#F5F0EA] border-b border-[#E5E5E5]">
          {/* Checkbox Column */}
          <TableHead className="ps-5 py-3.5 w-12 text-start">
            {onToggleSelectAll && (
              <button
                type="button"
                onClick={onToggleSelectAll}
                aria-label="Select all rows"
                className={cn(
                  "size-5 rounded-[6px] border flex items-center justify-center transition-colors cursor-pointer",
                  isAllSelected || isIndeterminate
                    ? "bg-[#8F6900] border-[#8F6900] text-white"
                    : "border-[#BDBDBD] bg-white hover:border-[#8F6900]"
                )}
              >
                {isAllSelected && <Check className="size-3.5 stroke-[3]" />}
                {!isAllSelected && isIndeterminate && (
                  <div className="w-2.5 h-0.5 bg-white rounded-full" />
                )}
              </button>
            )}
          </TableHead>

          <TableHead className="py-3.5 text-start text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
            {t("PRODUCT")}
          </TableHead>
          <TableHead className="py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
            {t("CATEGORY")}
          </TableHead>
          <TableHead className="py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
            {t("CURRENT QTY")}
          </TableHead>
          <TableHead className="py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
            {t("MINIMUM QTY")}
          </TableHead>
          <TableHead className="pe-5 py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
            {t("STATUS")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-12 text-center text-[14px] text-[#8B8B8B]"
            >
              {t("No items found.")}
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => {
            const isSelected = selectedItemIds.has(item.id);
            const isInfinite = checkIsInfinite(item);

            return (
              <TableRow
                key={item.id}
                className={cn(
                  "transition-colors border-b-0 border-0",
                  isSelected ? "bg-[#FAF7F2] hover:bg-[#F5EFE6]" : "hover:bg-[#F9F9F9]"
                )}
              >
                {/* Row Checkbox */}
                <TableCell className="ps-5 py-4 w-12">
                  {onToggleSelect && (
                    <button
                      type="button"
                      onClick={() => onToggleSelect(item.id)}
                      aria-label={`Select ${item.name}`}
                      className={cn(
                        "size-5 rounded-[6px] border flex items-center justify-center transition-colors cursor-pointer",
                        isSelected
                          ? "bg-[#8F6900] border-[#8F6900] text-white"
                          : "border-[#BDBDBD] bg-white hover:border-[#8F6900]"
                      )}
                    >
                      {isSelected && <Check className="size-3.5 stroke-[3]" />}
                    </button>
                  )}
                </TableCell>

                {/* Product */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-10 rounded-[8px] object-cover shrink-0"
                      />
                    )}
                    <span className="text-[14px] font-normal text-[#333333]">
                      {item.name}
                    </span>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-center">
                  <Badge className="h-6 px-3 rounded-[30px] text-[12px] font-normal border border-[#624f1c] bg-[#8f6900] text-white">
                    {item.category}
                  </Badge>
                </TableCell>

                {/* Current Qty */}
                <TableCell className="text-center">
                  {isInfinite ? (
                    <div className="flex items-center justify-center" title={t("Infinite quantity")}>
                      <InfinityIcon className="size-5 text-black stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-[14px] font-medium text-black">
                      {item.currentQuantity}
                    </span>
                  )}
                </TableCell>

                {/* Minimum Qty */}
                <TableCell className="text-center">
                  {isInfinite ? (
                    <span className="text-[14px] font-medium text-[#8B8B8B]">—</span>
                  ) : (
                    <span className="text-[14px] font-medium text-black">
                      {item.minimumQuantity}
                    </span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="pe-5 text-center">
                  <Badge
                    className={`h-6 px-3 rounded-[30px] text-[12px] font-normal border ${
                      STATUS_STYLES[item.status] ?? ""
                    }`}
                  >
                    {t(item.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default StockStatusTable;
