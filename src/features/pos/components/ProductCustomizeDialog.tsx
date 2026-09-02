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

import { getRecipe } from "@/features/products/api/recipeApi";

type ProductCustomizeDialogProps = {
  open: boolean;
  product: PosProduct | null;
  editLine?: CartItem | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: {
    extras: CartExtra[];
    instructions: string;
    qty: number;
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
  const [fetchedRecipeItems, setFetchedRecipeItems] = useState<any[]>([]);
  const [isDefaultComponentsOpen, setIsDefaultComponentsOpen] = useState(true);
  const [extras, setExtras] = useState<CartExtra[]>([]);
  const [instructions, setInstructions] = useState("");
  const [qty, setQty] = useState(1);

  // Fetch recipe from backend (/recipes/{productId}) whenever dialog opens
  useEffect(() => {
    if (!open || !product?.id) return;

    setIsDefaultComponentsOpen(true);
    setFetchedRecipeItems(product.recipe ?? []);

    getRecipe(product.id)
      .then((recipeRes: any) => {
        const recipeObj = recipeRes?.recipe || recipeRes;
        const ingredientsList =
          recipeObj?.ingredients ||
          recipeObj?.recipe?.ingredients ||
          (Array.isArray(recipeObj) ? recipeObj : []);

        if (Array.isArray(ingredientsList) && ingredientsList.length > 0) {
          const mapped: any[] = ingredientsList.map((item: any, index: number) => {
            const matObj =
              typeof item.productId === "object" && item.productId !== null
                ? item.productId
                : typeof item.material === "object" && item.material !== null
                  ? item.material
                  : null;

            const matId = matObj
              ? String(matObj._id || matObj.id || "")
              : String(item.productId || item.material || item.ingredientId || "");

            const matName = matObj?.name || item.name || item.productName || "";

            return {
              id: String(item._id || item.id || matId || `r-${index}`),
              material: matId,
              name: matName,
              quantity: Number(item.quantity ?? item.amount ?? 0),
              unit: item.unit || item.ingredientUnit || "g",
            };
          });
          setFetchedRecipeItems(mapped);

          const defaultRecipeChoices: Record<string, boolean> = {};
          mapped.forEach((item, index) => {
            const itemKey = String(item.id || item.material || index);
            defaultRecipeChoices[itemKey] = true;
          });
          setRecipeSelection(defaultRecipeChoices);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch recipe for product in POS:", err);
      });
  }, [open, product?.id]);

  // Re-seed local state whenever the dialog opens for a product / edit line.
  useEffect(() => {
    if (!open || !product) return;

    if (editLine) {
      setExtras(editLine.extras.map((extra) => ({ ...extra })));
      setInstructions(editLine.instructions ?? "");
      setQty(editLine.qty);
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

      // Initialize default recipe choices (checked by default)
      const defaultRecipeChoices: Record<string, boolean> = {};
      (product.recipe ?? []).forEach((item: any, index: number) => {
        const itemKey = String(item.id || item.material || index);
        defaultRecipeChoices[itemKey] = true;
      });
      setRecipeSelection(defaultRecipeChoices);
    }
  }, [open, product, editLine]);

  if (!product) return null;

  const variantGroups = product.variantGroups ?? [];
  const recipeItems = fetchedRecipeItems.length > 0 ? fetchedRecipeItems : (product.recipe ?? []);
  const hasVariants = variantGroups.length > 0;
  const hasRecipe = recipeItems.length > 0;
  const hasExtras = extras.length > 0;

  // Calculate price adjustment from selected variants
  let variantPriceAdjustment = 0;
  variantGroups.forEach((group: any) => {
    const groupKey = String(group.id || group.name);
    const selectedOptKey = selectedVariants[groupKey];
    if (selectedOptKey && group.options) {
      const foundOpt = group.options.find(
        (o: any) => String(o.id || o.name || o.label) === selectedOptKey
      );
      if (foundOpt) {
        variantPriceAdjustment += Number(foundOpt.priceAdjustment || foundOpt.price) || 0;
      }
    }
  });

  const selectedExtras = extras.filter((extra) => extra.selected);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const total = (product.price + variantPriceAdjustment + extrasTotal) * qty;

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
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {/* 1. Variant Groups */}
          {hasVariants &&
            variantGroups.map((group: any) => {
              const groupKey = String(group.id || group.name);
              const selectedOptKey = selectedVariants[groupKey];

              return (
                <div key={groupKey} className="flex flex-col gap-3">
                  <p className="text-[14px] font-semibold tracking-[0.28px] text-[#28293D]">
                    {t(group.name)}{" "}
                    {group.required && <span className="text-[13px] text-[#C90000]">*</span>}
                  </p>
                  <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                    <div className="flex flex-wrap items-center gap-2">
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
                              "flex items-center justify-center rounded-[5px] px-6 py-4 text-[14px] font-medium transition-all cursor-pointer",
                              isSelected
                                ? "bg-[#F5F0EA] outline outline-2 outline-[#4A3F33] text-black"
                                : "bg-white outline outline-[1.5px] outline-[#CACBD4] text-[#595959] hover:bg-gray-50",
                            )}
                          >
                            {t(optName)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* 2. Recipe (Default components (Deselect what you want to remove)) */}
          {hasRecipe && (
            <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
              <button
                type="button"
                onClick={() => setIsDefaultComponentsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-semibold tracking-[0.28px] text-[#28293D]">
                    {t("Default components")}
                  </span>
                  <span className="text-[13px] font-medium text-[#595959]">
                    ({t("Deselect what you want to remove")})
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 text-black transition-transform duration-200",
                    isDefaultComponentsOpen && "rotate-180",
                  )}
                />
              </button>

              {isDefaultComponentsOpen && (
                <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-[#CACBD4]">
                  {recipeItems.map((item: any, index: number) => {
                    const itemKey = String(item.id || item.material || index);
                    const isChecked = recipeSelection[itemKey] ?? true;
                    const name = item.name || item.productName || "";
                    const qtyStr = item.quantity
                      ? `${item.quantity} ${item.unit || "g"}`
                      : "";

                    return (
                      <label
                        key={itemKey}
                        className="flex cursor-pointer items-center justify-between py-1"
                      >
                        <span className="flex items-center gap-2 text-[13px] font-medium leading-[13.91px] tracking-[0.26px] text-[#333333]">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleRecipeItem(itemKey)}
                          />
                          {t(name)}
                        </span>
                        {qtyStr && (
                          <span className="text-[13px] font-medium tracking-[0.26px] text-black">
                            {qtyStr}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. Extras (Optional) */}
          {hasExtras && (
            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-semibold tracking-[0.28px] text-[#28293D]">
                {t("Extras")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
                  ({t("Optional")})
                </span>
              </p>
              <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                <div className="flex flex-col gap-2">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex cursor-pointer items-center justify-between py-1"
                    >
                      <span className="flex items-center gap-2 text-[13px] font-medium leading-[13.91px] tracking-[0.26px] text-[#333333]">
                        <Checkbox
                          checked={extra.selected}
                          onCheckedChange={() => toggleExtra(extra.id)}
                        />
                        {t(extra.name)}
                      </span>
                      <span className="text-[13px] font-medium tracking-[0.26px] text-black">
                        EGP{" "}
                        <span className="font-semibold">
                          {extra.price.toFixed(2)}
                        </span>
                      </span>
                    </label>
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
                className="flex size-7 items-center justify-center rounded-[5.71px] border border-[#E5E5E5] bg-white p-[6px] text-black transition-colors hover:bg-gray-50 cursor-pointer disabled:opacity-40"
                aria-label={t("Decrease")}
                disabled={qty <= 1}
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                <Minus className="size-3.5 text-black" />
              </button>
              <span className="min-w-4 text-center text-[13px] font-bold tracking-[0.26px] text-black">
                {qty}
              </span>
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-[5.71px] border border-[#E5E5E5] bg-white p-[6px] text-black transition-colors hover:bg-gray-50 cursor-pointer"
                aria-label={t("Increase")}
                onClick={() => setQty((value) => value + 1)}
              >
                <Plus className="size-3.5 text-black" />
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
              className="h-[56px] px-[30px] py-4 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] transition-colors hover:bg-[#F5F0EA] cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              className="h-[56px] px-[30px] py-4 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white transition-colors hover:bg-[#8F6900]/90 cursor-pointer"
              onClick={() => onConfirm({ extras, instructions, qty })}
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
