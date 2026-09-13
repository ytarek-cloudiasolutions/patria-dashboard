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
import { Check, ChevronDown, ChevronUp, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "../types";

const STATUS_STYLES: Record<string, string> = {
  "Out Of Stock": "bg-[#C90000] text-white border-[#C90000]",
  "Low Stock": "bg-[#FE9A001A] text-[#C7861E] border-[#C7861E]",
  Available: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
};

interface StockStatusTableProps {
  items: InventoryItem[];
  adjustments: Record<string | number, number>;
  onAdjust: (id: string | number, value: number) => void;
  selectedItemIds?: Set<string | number>;
  onToggleSelect?: (id: string | number) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  infiniteItemIds?: Set<string | number>;
  stockingAdjustments?: Record<string | number, number>;
  onStockingAdjust?: (id: string | number, value: number) => void;
}

const StockStatusTable = ({
  items,
  adjustments,
  onAdjust,
  selectedItemIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected = false,
  isIndeterminate = false,
  infiniteItemIds = new Set(),
  stockingAdjustments = {},
  onStockingAdjust,
}: StockStatusTableProps) => {
  const { t } = useTranslation();

  const getQty = (item: InventoryItem) =>
    adjustments[item.id] ?? item.currentQuantity;

  const getStockingQty = (item: InventoryItem) =>
    stockingAdjustments[item.id] ?? (item.stockingQuantity ?? 0);

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
                  aria-label="Select all items"
                  className={cn(
                    "size-5 rounded-[6px] border flex items-center justify-center transition-colors cursor-pointer",
                    isAllSelected || isIndeterminate
                      ? "bg-[#8F6900] border-[#8F6900] text-white"
                      : "border-[#8F6900] bg-white hover:border-[#735400]"
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
            <TableHead className="py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
              {t("STATUS")}
            </TableHead>
            <TableHead className="py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
              {t("ADJUST QTY")}
            </TableHead>
            <TableHead className="pe-5 py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.26px] text-[#28293D]">
              {t("STOCKING QTY")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-12 text-center text-[14px] text-[#8B8B8B]"
              >
                {t("No items found.")}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isSelected = selectedItemIds.has(item.id);
              const isInfinite = checkIsInfinite(item);
              const qty = getQty(item);
              const stockingQty = getStockingQty(item);

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
                  <TableCell className="text-center">
                    <Badge
                      className={`h-6 px-3 rounded-[30px] text-[12px] font-normal border ${
                        STATUS_STYLES[item.status] ?? ""
                      }`}
                    >
                      {t(item.status)}
                    </Badge>
                  </TableCell>

                  {/* Adjust Qty with Stepper */}
                  <TableCell className="text-center">
                    <div className="relative mx-auto w-24 sm:w-28 flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={isInfinite ? "" : qty}
                        placeholder={isInfinite ? "—" : "0"}
                        disabled={isInfinite}
                        onChange={(e) =>
                          onAdjust(item.id, Math.max(0, Number(e.target.value)))
                        }
                        className={cn(
                          "w-full h-11 rounded-[12px] border border-[#E5E5E5] bg-white text-center text-[16px] outline-none transition-colors",
                          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                          !isInfinite && "focus:border-[#8F6900] pe-7 ps-2",
                          qty === 0 ? "text-[#8B8B8B]" : "text-black",
                          isInfinite && "opacity-50 cursor-not-allowed bg-[#F9F9F9] text-[#8B8B8B]"
                        )}
                      />
                      {!isInfinite && (
                        <div className="absolute end-1.5 flex flex-col justify-center">
                          <button
                            type="button"
                            onClick={() => onAdjust(item.id, qty + 1)}
                            className="text-[#8B8B8B] hover:text-[#28293D] p-0.5 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                          >
                            <ChevronUp className="size-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onAdjust(item.id, Math.max(0, qty - 1))}
                            className="text-[#8B8B8B] hover:text-[#28293D] p-0.5 flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <ChevronDown className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Stocking Qty with Stepper */}
                  <TableCell className="pe-5 text-center">
                    <div className="relative mx-auto w-24 sm:w-28 flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={isInfinite ? "" : stockingQty}
                        placeholder={isInfinite ? "—" : "0"}
                        disabled={isInfinite}
                        onChange={(e) =>
                          onStockingAdjust?.(
                            item.id,
                            Math.max(0, Number(e.target.value))
                          )
                        }
                        className={cn(
                          "w-full h-11 rounded-[12px] border border-[#E5E5E5] bg-white text-center text-[16px] outline-none transition-colors",
                          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                          !isInfinite && "focus:border-[#8F6900] pe-7 ps-2",
                          stockingQty === 0 ? "text-[#8B8B8B]" : "text-black",
                          isInfinite && "opacity-50 cursor-not-allowed bg-[#F9F9F9] text-[#8B8B8B]"
                        )}
                      />
                      {!isInfinite && (
                        <div className="absolute end-1.5 flex flex-col justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              onStockingAdjust?.(item.id, stockingQty + 1)
                            }
                            className="text-[#8B8B8B] hover:text-[#28293D] p-0.5 flex items-center justify-center transition-colors"
                            aria-label="Increase stocking quantity"
                          >
                            <ChevronUp className="size-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onStockingAdjust?.(
                                item.id,
                                Math.max(0, stockingQty - 1)
                              )
                            }
                            className="text-[#8B8B8B] hover:text-[#28293D] p-0.5 flex items-center justify-center transition-colors"
                            aria-label="Decrease stocking quantity"
                          >
                            <ChevronDown className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>
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
