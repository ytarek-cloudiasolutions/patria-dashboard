import { useEffect, useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Separator } from "@/shared/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { CartExtra, CartItem, PosProduct } from "../types";
import { formatEgp } from "../utils";

type ProductCustomizeDialogProps = {
  open: boolean;
  product: PosProduct | null;
  editLine?: CartItem | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: {
    extras: CartExtra[];
    instructions: string;
    qty: number;
    excludedIngredients?: Array<{ productId: string; name: string }>;
    unitPrice?: number;
    variants?: Array<{ name: string; option: string; price?: number }>;
    selectedVariants?: Record<string, string>;
  }) => void;
};

const ProductCustomizeDialog = ({
  open,
  product,
  editLine,
  onOpenChange,
  onConfirm,
}: ProductCustomizeDialogProps) => {
  const { t } = useTranslation();

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [recipeSelection, setRecipeSelection] = useState<Record<string, boolean>>({});
  const [isDefaultComponentsOpen, setIsDefaultComponentsOpen] = useState(true);
  const [extras, setExtras] = useState<CartExtra[]>([]);
  const [instructions, setInstructions] = useState("");
  const [qty, setQty] = useState(1);

  // Re-seed local state whenever the dialog opens for a product / edit line.
  // The recipe itself is fetched by the POS screen when the product is chosen
  // (`GET /recipes/{productId}`) and arrives here on `product.recipe`.
  useEffect(() => {
    if (!open || !product) return;

    setIsDefaultComponentsOpen(true);

    // Initialize recipe choices: checked by default, unless the line being
    // edited had explicitly excluded an ingredient.
    const excludedIds = new Set(
      (editLine?.excludedIngredients ?? []).map((item) => item.productId),
    );
    const defaultRecipeChoices: Record<string, boolean> = {};
    (product.recipe ?? []).forEach((item: any, index: number) => {
      const itemKey = String(item.id || item.material || index);
      const materialId = String(item.material || item.productId || item.id || "");
      defaultRecipeChoices[itemKey] = !excludedIds.has(materialId);
    });
    setRecipeSelection(defaultRecipeChoices);

    if (editLine) {
      setExtras(editLine.extras.map((extra) => ({ ...extra })));
      setInstructions(editLine.instructions ?? "");
      setQty(editLine.qty);
      if (editLine.selectedVariants && Object.keys(editLine.selectedVariants).length > 0) {
        setSelectedVariants(editLine.selectedVariants);
      } else {
        const defaultVariantChoices: Record<string, string> = {};
        (product.variantGroups ?? []).forEach((group: any) => {
          const groupKey = String(group.id || group.name);
          if (group.options && group.options.length > 0) {
            const firstOptKey = String(group.options[0].id || group.options[0].name || group.options[0].label);
            defaultVariantChoices[groupKey] = firstOptKey;
          }
        });
        setSelectedVariants(defaultVariantChoices);
      }
    } else {
      setExtras(
        (product.extras ?? []).map((extra) => ({ ...extra, selected: false }))
      );
      setInstructions("");
      setQty(1);

      // Initialize default variant choices
      const defaultVariantChoices: Record<string, string> = {};
      (product.variantGroups ?? []).forEach((group: any) => {
        const groupKey = String(group.id || group.name);
        if (group.options && group.options.length > 0) {
          const firstOptKey = String(group.options[0].id || group.options[0].name || group.options[0].label);
          defaultVariantChoices[groupKey] = firstOptKey;
        }
      });
      setSelectedVariants(defaultVariantChoices);
    }
  }, [open, product, editLine]);

  if (!product) return null;

  const variantGroups = product.variantGroups ?? [];
  const recipeItems = product.recipe ?? [];
  const hasVariants = variantGroups.length > 0;
  const hasRecipe = recipeItems.length > 0;
  const hasExtras = extras.length > 0;

  // Calculate price from base product price and selected variants.
  // If a variant group (such as Size) specifies absolute option prices (e.g. S=120, M=150, L=180
  // where the base pizza price is 120), the selected variant option's price replaces the base price
  // rather than adding on top of it, avoiding the base price being added twice.
  let effectiveBasePrice = product.price;
  let hasReplacedBasePrice = false;
  let variantAdditionalAdjustment = 0;
  const selectedVariantDetails: Array<{ name: string; option: string; price: number }> = [];

  variantGroups.forEach((group: any) => {
    const groupKey = String(group.id || group.name);
    const selectedOptKey = selectedVariants[groupKey];
    if (selectedOptKey && group.options) {
      const foundOpt = group.options.find(
        (o: any) => String(o.id || o.name || o.label) === selectedOptKey
      );
      if (foundOpt) {
        const optPrice = Number(foundOpt.priceAdjustment ?? foundOpt.price) || 0;
        const groupName = String(group.name || "");
        const optLabel = String(foundOpt.label || foundOpt.name || "");

        selectedVariantDetails.push({
          name: groupName,
          option: optLabel,
          price: optPrice,
        });

        const hasFullPriceOption =
          (product.price > 0 &&
            group.options.some(
              (o: any) => (Number(o.priceAdjustment ?? o.price) || 0) >= product.price,
            )) ||
          product.price === 0;

        const isAbsoluteTier = hasFullPriceOption && optPrice > 0;

        if (isAbsoluteTier && !hasReplacedBasePrice) {
          effectiveBasePrice = optPrice;
          hasReplacedBasePrice = true;
        } else {
          variantAdditionalAdjustment += optPrice;
        }
      }
    }
  });

  const unitPrice = effectiveBasePrice + variantAdditionalAdjustment;
  const selectedExtras = extras.filter((extra) => extra.selected);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const total = (unitPrice + extrasTotal) * qty;

  const toggleExtra = (id: string) =>
    setExtras((prev) =>
      prev.map((extra) =>
        extra.id === id ? { ...extra, selected: !extra.selected } : extra,
      ),
    );

  const toggleRecipeItem = (key: string) =>
    setRecipeSelection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85vh] w-[575px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-0 shadow-xl sm:max-w-[575px]"
      >
        {/* Header - Fixed Top */}
        <DialogHeader className="shrink-0 p-6 pb-0">
          <div className="flex flex-col gap-1 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-6 py-4">
            <DialogTitle className="text-[16px] font-semibold leading-[17.12px] tracking-[0.32px] text-[#333333]">
              {product.name}
            </DialogTitle>
            <p className="text-[13px] font-normal leading-[18.20px] tracking-[0.26px] text-[#8B8B8B]">
              {product.originalPrice ? (
                <>
                  {t("Original Price")}:{" "}
                  <span className="line-through">
                    {formatEgp(product.originalPrice)}
                  </span>{" "}
                  <span className="font-semibold text-[#8F6900]">
                    {formatEgp(product.price)}
                  </span>
                </>
              ) : (
                `${t("Original Price")}: EGP ${product.price.toFixed(2)}`
              )}
            </p>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {/* 1. Variant Groups */}
          {hasVariants &&
            variantGroups.map((group: any) => {
              const groupKey = String(group.id || group.name);
              const selectedOptKey = selectedVariants[groupKey];

              return (
                <div key={groupKey} className="flex flex-col gap-3">
                  <p className="flex items-center gap-1 text-[14px] font-semibold tracking-[0.28px] text-[#28293D]">
                    {t(group.name)}
                    {group.required && (
                      <span className="text-[12px] font-semibold text-[#C90000]">*</span>
                    )}
                  </p>
                  <div className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                    <div className="grid grid-cols-3 gap-2 px-0.5 py-2">
                      {(group.options || []).map((option: any) => {
                        const optKey = String(option.id || option.name || option.label);
                        const optName = option.name || option.label || "";
                        const isSelected = selectedOptKey === optKey;

                        return (
                          <button
                            key={optKey}
                            type="button"
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [groupKey]: optKey,
                              }))
                            }
                            className={cn(
                              "flex w-full flex-col items-center justify-center gap-2 rounded-[5px] px-6 py-4 text-center transition-all duration-150 cursor-pointer active:scale-95",
                              isSelected
                                ? "bg-[#F5F0EA] outline outline-2 outline-offset-[-2px] outline-[#4A3F33]"
                                : "bg-white outline outline-[1.5px] outline-offset-[-1.5px] outline-[#CACBD4] hover:bg-gray-50",
                            )}
                          >
                            <span
                              className={cn(
                                "text-[14px] font-medium leading-4 tracking-[0.28px]",
                                isSelected ? "text-black" : "text-[#595959]",
                              )}
                            >
                              {t(optName)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* 2. Customize Product (recipe / removable ingredients) */}
          {hasRecipe && (
            <div className="shrink-0 overflow-hidden rounded-[16px] bg-[#FAFAF7] p-4 outline outline-1 outline-offset-[-1px] outline-[#CACBD4] transition-colors">
              <button
                type="button"
                onClick={() => setIsDefaultComponentsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex flex-col items-start gap-2 text-left">
                  <span className="text-[14px] font-semibold leading-4 tracking-[0.28px] text-[#28293D]">
                    {t("Customize Product")}
                  </span>
                  <span className="text-[10px] font-medium leading-3 tracking-[0.2px] text-[#595959]">
                    {t("Remove any item in your product")}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "size-6 shrink-0 text-black transition-transform duration-200",
                    isDefaultComponentsOpen && "rotate-180",
                  )}
                />
              </button>

              {isDefaultComponentsOpen && (
                <div className="mt-3.5 flex flex-col gap-2.5 rounded-[16px] border border-[#8F6900] bg-[#FAFAF7] p-4">
                  {recipeItems.map((item: any, index: number) => {
                    const itemKey = String(item.id || item.material || index);
                    const isChecked = recipeSelection[itemKey] ?? true;
                    const name = item.name || item.productName || "";
                    const qtyValue = Number(item.quantity ?? 0);
                    const qtyStr = qtyValue
                      ? `${qtyValue} ${item.unit || "g"}`
                      : "";

                    return (
                      <div key={itemKey} className="flex flex-col gap-2.5">
                        <label className="flex cursor-pointer items-center justify-between gap-2.5">
                          <span className="flex flex-1 items-center gap-1.5">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleRecipeItem(itemKey)}
                              className={cn(
                                "size-5 rounded-[6px] border bg-white transition-shadow",
                                isChecked
                                  ? "border-[#8F6900] bg-[#8F6900] text-white ring-4 ring-[#8F6900]/10 data-checked:border-[#8F6900] data-checked:bg-[#8F6900] data-checked:text-white"
                                  : "border-[#CACBD4]",
                              )}
                            />
                            <span className="flex-1 text-[14px] font-medium leading-4 tracking-[0.28px] text-[#28293D]">
                              {t(name)}
                            </span>
                          </span>
                          {qtyStr && (
                            <span className="shrink-0 text-[12px] font-medium tracking-[0.24px] text-[#000000]">
                              {qtyStr}
                            </span>
                          )}
                        </label>
                        {index < recipeItems.length - 1 && (
                          <div className="h-px w-full bg-[#CACBD4]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. Extras (Optional) */}
          {hasExtras && (
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-1 text-[14px] font-medium tracking-[0.28px] text-[#333333]">
                {t("Extras")}{" "}
                <span className="text-[12px] font-medium text-[#8B8B8B]">
                  ({t("Optional")})
                </span>
              </p>
              <div className="flex flex-col gap-3 overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-3 pb-1.5 pt-3">
                <p className="text-[12px] font-medium tracking-[0.24px] text-[#000000]">
                  {t("Select extras for this product")}
                </p>
                <div className="h-px w-full bg-[#CACBD4]" />
                <div className="flex flex-col gap-2 px-0.5 py-2">
                  {extras.map((extra, index) => (
                    <div key={extra.id} className="flex flex-col gap-2">
                      <label className="flex min-h-6 cursor-pointer items-center justify-between gap-3">
                        <span className="flex flex-1 items-center gap-1.5">
                          <Checkbox
                            checked={extra.selected}
                            onCheckedChange={() => toggleExtra(extra.id)}
                            className={cn(
                              "size-5 rounded-[6px] border bg-white transition-shadow",
                              extra.selected
                                ? "border-[#8F6900] bg-[#8F6900] text-white ring-4 ring-[#8F6900]/10 data-checked:border-[#8F6900] data-checked:bg-[#8F6900] data-checked:text-white"
                                : "border-[#CACBD4]",
                            )}
                          />
                          <span className="text-[13px] font-medium leading-4 tracking-[0.26px] text-[#28293D]">
                            {t(extra.name)}
                          </span>
                        </span>
                        <span className="shrink-0 text-[13px] font-medium tracking-[0.26px] text-[#000000]">
                          EGP{" "}
                          <span className="font-semibold">
                            {extra.price.toFixed(2)}
                          </span>
                        </span>
                      </label>
                      {index < extras.length - 1 && (
                        <div className="h-px w-full bg-[#CACBD4]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Special Instructions */}
          <div className="flex flex-col gap-2.5">
            <p className="text-[14px] font-medium text-black">
              {t("Special Instructions")}{" "}
              <span className="text-[13px] font-medium text-[#595959]">
                ({t("Optional")})
              </span>
            </p>
            <Textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder={t("e.g. no sugar, heated")}
              className="min-h-[90px] rounded-[8px] border border-[#8E8E8E] bg-[#FEFEFE] px-3.5 py-3 text-[13px] font-normal text-[#333333] placeholder:text-[#595959] outline-none focus:border-[#8F6900] focus:ring-1 focus:ring-[#8F6900] transition-colors"
            />
          </div>

          {/* Summary Yellow Badge */}
          {selectedExtras.length > 0 && (
            <div className="flex items-center rounded-[30px] border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]">
              <span>
                Extra {selectedExtras.map((extra) => extra.name).join(", ")} +
                EGP {extrasTotal.toFixed(2)}
              </span>
            </div>
          )}

          {/* Quantity Row */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-[14px] font-medium text-black">
              {t("Quantity")}
            </p>
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                className="group/btn flex size-7 items-center justify-center rounded-[5.71px] border border-[#E5E5E5] bg-white p-[6px] text-black transition-all duration-150 hover:bg-gray-100 active:scale-90 cursor-pointer disabled:opacity-40"
                aria-label={t("Decrease")}
                disabled={qty <= 1}
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                <Minus className="size-3.5 text-black transition-transform duration-150 group-hover/btn:scale-125" />
              </button>
              <span className="min-w-4 text-center text-[13px] font-bold tracking-[0.26px] text-black">
                {qty}
              </span>
              <button
                type="button"
                className="group/btn flex size-7 items-center justify-center rounded-[5.71px] border border-[#E5E5E5] bg-white p-[6px] text-black transition-all duration-150 hover:bg-gray-100 active:scale-90 cursor-pointer"
                aria-label={t("Increase")}
                onClick={() => setQty((value) => value + 1)}
              >
                <Plus className="size-3.5 text-black transition-transform duration-150 group-hover/btn:rotate-90" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Sticky Bottom */}
        <div className="shrink-0 bg-white px-6 pb-6 pt-2">
          <Separator className="mb-4 bg-[#CACBD4]" />
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] active:scale-[0.98] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white active:scale-[0.98] cursor-pointer"
              onClick={() => {
                const excludedIngredients: Array<{ productId: string; name: string }> = [];
                recipeItems.forEach((item: any, index: number) => {
                  const itemKey = String(item.id || item.material || index);
                  if (recipeSelection[itemKey] === false) {
                    const pId = String(item.material || item.productId || item.id || "");
                    if (pId) {
                      excludedIngredients.push({
                        productId: pId,
                        name: item.name || "",
                      });
                    }
                  }
                });

                onConfirm({
                  extras,
                  instructions,
                  qty,
                  excludedIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
                  unitPrice,
                  variants: selectedVariantDetails,
                  selectedVariants,
                });
              }}
            >
              <span>
                {editLine ? t("Update cart") : t("Add product to cart")}{" "}
                <span className="font-bold">EGP {total.toFixed(2)}</span>
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizeDialog;
