import { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { showErrorToast } from "@/shared/utils/toast";

export type BulkQuantityMode = "set" | "add";

export interface WarehouseOption {
  value: string;
  label: string;
}

interface InventoryBulkActionBarProps {
  selectedCount: number;
  warehouses: WarehouseOption[];
  selectedWarehouse: string;
  onSelectWarehouse: (warehouseId: string) => void;
  onApply: (params: {
    mode: BulkQuantityMode;
    quantity: number | null;
    isInfinite: boolean;
    warehouseId: string;
  }) => void;
  isLoading?: boolean;
  className?: string;
}

const InventoryBulkActionBar = ({
  selectedCount,
  warehouses,
  selectedWarehouse,
  onSelectWarehouse,
  onApply,
  isLoading = false,
  className,
}: InventoryBulkActionBarProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<BulkQuantityMode>("set");
  const [qtyInput, setQtyInput] = useState<string>("");
  const [isInfinite, setIsInfinite] = useState<boolean>(false);

  const numericQty = qtyInput.trim() !== "" ? Number(qtyInput) : null;
  const hasValidQty = numericQty !== null && !isNaN(numericQty) && numericQty >= 0;

  // Active button state determines label, type, and styling
  const isButtonActive = isInfinite || hasValidQty;

  let buttonText = t("Stock + Opening Balance");
  if (isInfinite) {
    buttonText = t("Set as infinite inventory");
  } else if (hasValidQty) {
    buttonText = t("Apply Stock & Post Balance");
  }

  const handleToggleInfinite = () => {
    setIsInfinite((prev) => !prev);
  };

  const handleActionClick = () => {
    if (!isButtonActive || isLoading) return;
    if (!selectedWarehouse) {
      showErrorToast(t("Please select a warehouse first"));
      return;
    }
    onApply({
      mode,
      quantity: isInfinite ? null : (numericQty ?? 0),
      isInfinite,
      warehouseId: selectedWarehouse,
    });
  };

  return (
    <div
      className={cn(
        "w-full px-3 py-4 bg-[#F5F0EA] rounded-[12px] border border-[#8F6900] flex flex-wrap items-center justify-between gap-3 select-none transition-all",
        className
      )}
    >
      {/* 1. Item selected counter */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="size-5 rounded-full bg-[#8F6900] text-white text-[10px] font-bold tracking-[0.20px] flex items-center justify-center shrink-0">
          {selectedCount}
        </div>
        <span className="text-[12px] font-semibold text-[#8F6900] leading-6">
          {selectedCount === 1 ? t("Item selected") : t("Items selected")}
        </span>
      </div>

      {/* 2. Warehouse selector dropdown */}
      <div className="w-[214px] sm:w-[240px] shrink-0">
        <DropdownSelect
          options={warehouses}
          selected={selectedWarehouse}
          onSelect={onSelectWarehouse}
          placeholder={t("Select Warehouse")}
          align="start"
          className="h-12 w-full border-[#E5E5E5] rounded-[12px]"
        />
      </div>

      {/* 3. Mode Toggle (Set Qty vs Add to Qty) */}
      <div className="h-12 px-1.5 py-1 bg-white rounded-[12px] flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setMode("set")}
          className={cn(
            "h-10 px-3 rounded-[5px] text-[12px] font-semibold transition-all cursor-pointer",
            mode === "set"
              ? "bg-[#8F6900] text-white shadow-sm"
              : "bg-transparent text-black hover:bg-neutral-100"
          )}
        >
          {t("Set Qty")}
        </button>
        <button
          type="button"
          onClick={() => setMode("add")}
          className={cn(
            "h-10 px-3 rounded-[5px] text-[12px] font-semibold transition-all cursor-pointer",
            mode === "add"
              ? "bg-[#8F6900] text-white shadow-sm"
              : "bg-transparent text-black hover:bg-neutral-100"
          )}
        >
          {t("Add to Qty")}
        </button>
      </div>

      {/* 4. Qty per item input */}
      <div className="w-[107px] shrink-0">
        <div
          className={cn(
            "h-12 px-2 py-2 rounded-[12px] border transition-colors flex items-center justify-center",
            isInfinite
              ? "bg-[#E5E5E5] border-[#CACBD4] cursor-not-allowed"
              : "bg-white border-[#E5E5E5] hover:border-[#8F6900] focus-within:border-[#8F6900]"
          )}
        >
          <input
            type="number"
            min="0"
            disabled={isInfinite}
            placeholder={t("Qty per item")}
            value={isInfinite ? "" : qtyInput}
            onChange={(e) => setQtyInput(e.target.value)}
            className={cn(
              "w-full text-center bg-transparent outline-none text-[14px] font-semibold transition-colors",
              isInfinite
                ? "text-[#8B8B8B] cursor-not-allowed placeholder:text-[#8B8B8B]"
                : "text-black placeholder:text-[#8B8B8B] placeholder:text-[12px] placeholder:font-normal"
            )}
          />
        </div>
      </div>

      {/* 5. Set as infinite qty checkbox */}
      <div
        onClick={handleToggleInfinite}
        className="flex items-center gap-2 cursor-pointer shrink-0 select-none py-1"
      >
        <div
          className={cn(
            "size-5 rounded-[6px] transition-all flex items-center justify-center shrink-0",
            isInfinite
              ? "bg-[#8F6900] border border-[#8F6900] text-white ring-2 ring-[#8F6900]/20"
              : "bg-white border border-[#8F6900]"
          )}
        >
          {isInfinite && <Check className="size-3.5 stroke-[3] text-white" />}
        </div>
        <span className="text-[14px] sm:text-[15px] font-medium text-[#333333]">
          {t("Set as infinite qty")}
        </span>
      </div>

      {/* 6. Action button */}
      <button
        type="button"
        disabled={!isButtonActive || isLoading}
        onClick={handleActionClick}
        className={cn(
          "h-12 px-4 py-3 rounded-[5px] flex items-center justify-center gap-2.5 transition-all shrink-0 font-semibold text-[14px] sm:text-[15px]",
          isButtonActive && !isLoading
            ? "bg-[#8F6900] text-white hover:bg-[#725400] cursor-pointer shadow-sm active:scale-[0.98]"
            : "bg-[#DCDCDC] text-[#8B8B8B] cursor-not-allowed pointer-events-none"
        )}
      >
        {isLoading ? (
          <Loader2 className="size-4.5 animate-spin text-[#8B8B8B]" />
        ) : (
          <Save
            className={cn(
              "size-4.5 shrink-0",
              isButtonActive ? "text-white" : "text-[#8B8B8B]"
            )}
          />
        )}
        <span>{buttonText}</span>
      </button>
    </div>
  );
};

export default InventoryBulkActionBar;
