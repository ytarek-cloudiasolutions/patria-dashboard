import { useEffect, useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartLineItem, ProductOption } from "../types";
import { computeUnitPrice, formatCurrency, nextLineUid } from "../utils";

interface ProductCustomizationModalProps {
  product: ProductOption | null;
  editingLine?: CartLineItem | null;
  onClose: () => void;
  onSubmit: (line: CartLineItem) => void;
}

const ProductCustomizationModal = ({
  product,
  editingLine,
  onClose,
  onSubmit,
}: ProductCustomizationModalProps) => {
  const { t, dir } = useTranslation();
  // groupId -> optionId
  const [variantChoice, setVariantChoice] = useState<Record<string | number, string | number>>({});
  const [extraIds, setExtraIds] = useState<(string | number)[]>([]);
  const [recipeSelection, setRecipeSelection] = useState<Record<string, boolean>>({});
  const [isRecipeOpen, setIsRecipeOpen] = useState(true);
  const [specialRequest, setSpecialRequest] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;

    setIsRecipeOpen(true);

    // Recipe ingredients start selected; restore the exclusions of a line
    // that is being edited.
    const excludedIds = new Set(
      (editingLine?.excludedIngredients ?? []).map((item) => item.productId),
    );
    const recipeChoices: Record<string, boolean> = {};
    (product.recipe ?? []).forEach((item, index) => {
      const itemKey = String(item.id || item.material || index);
      const materialId = String(item.material || item.id || "");
      recipeChoices[itemKey] = !excludedIds.has(materialId);
    });
    setRecipeSelection(recipeChoices);

    if (editingLine) {
      const choice: Record<string | number, string | number> = {};
      product.variantGroups?.forEach((group) => {
        const picked = group.options.find((option) =>
          editingLine.variantSelections.some(
            (selection) =>
              selection.groupName === group.name &&
              selection.optionName === option.name,
          ),
        );
        if (picked) choice[group.id] = picked.id;
      });
      setVariantChoice(choice);
      setExtraIds(
        (product.extras ?? [])
          .filter((extra) =>
            editingLine.extras.some((selected) => selected.name === extra.name),
          )
          .map((extra) => extra.id),
      );
      setSpecialRequest(editingLine.specialRequest ?? "");
      setQuantity(editingLine.quantity);
      return;
    }

    // Defaults: required single-select groups start on their first option.
    const defaults: Record<string | number, string | number> = {};
    product.variantGroups?.forEach((group) => {
      if (group.required && group.options.length > 0) {
        defaults[group.id] = group.options[0].id;
      }
    });
    setVariantChoice(defaults);
    setExtraIds([]);
    setSpecialRequest("");
    setQuantity(1);
  }, [product, editingLine]);

  if (!product) return null;

  const recipeItems = product.recipe ?? [];
  const hasRecipe = recipeItems.length > 0;
  const hasExtras = Boolean(product.extras && product.extras.length > 0);
  const hasOptions = hasExtras || hasRecipe;

  const variantSelections = (product.variantGroups ?? [])
    .map((group) => {
      const option = group.options.find(
        (candidate) => candidate.id === variantChoice[group.id],
      );
      return option
        ? { groupName: group.name, optionName: option.name, price: option.price }
        : null;
    })
    .filter((value): value is NonNullable<typeof value> => value !== null);

  const selectedExtras = (product.extras ?? [])
    .filter((extra) => extraIds.includes(extra.id))
    .map((extra) => ({ name: extra.name, price: extra.price }));

  const unitPrice = computeUnitPrice(
    product.unitPrice,
    variantSelections,
    selectedExtras,
  );

  const handleSubmit = () => {
    const excludedIngredients = recipeItems.flatMap((item, index) => {
      const itemKey = String(item.id || item.material || index);
      if (recipeSelection[itemKey] !== false) return [];
      const ingredientId = String(item.material || item.id || "");
      return ingredientId
        ? [{ productId: ingredientId, name: item.name || "" }]
        : [];
    });

    onSubmit({
      uid: editingLine?.uid ?? nextLineUid(),
      productId: product.id,
      name: product.name,
      basePrice: product.unitPrice,
      unitPrice,
      quantity,
      variantSelections,
      extras: selectedExtras,
      specialRequest: specialRequest.trim() || undefined,
      excludedIngredients:
        excludedIngredients.length > 0 ? excludedIngredients : undefined,
    });
    onClose();
  };

  const toggleExtra = (id: string | number) =>
    setExtraIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );

  const toggleRecipeItem = (key: string) =>
    setRecipeSelection((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

  const submitLabel = editingLine
    ? t("Update product")
    : hasOptions
      ? t("Add product to cart")
      : t("Add product");

  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-6 ring-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[575px]"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-6">
          {/* Header */}
          {hasOptions ? (
            <div className="flex flex-col gap-1 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-6 py-4">
              <DialogTitle className="text-[16px] font-semibold tracking-[0.32px] text-[#333333] leading-[17.12px]">
                {product.name}
              </DialogTitle>
              <p className="text-[13px] tracking-[0.26px] text-[#8B8B8B] leading-[18.20px]">
                {t("Original Price")}: {formatCurrency(product.unitPrice)}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-[#28293D]">
                {product.name}
              </DialogTitle>
              <p className="text-[18px] font-semibold tracking-[0.36px] text-[#8B8B8B]">
                {t("Origin Price")}: {product.unitPrice.toFixed(2)}
              </p>
            </div>
          )}

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
            {/* Variant groups */}
            {product.variantGroups?.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <p className="flex items-center gap-1 text-[14px] font-semibold tracking-[0.28px] text-[#28293D]">
                  {t(group.name)}
                  {group.required && (
                    <span className="text-[12px] font-semibold text-[#C90000]">*</span>
                  )}
                </p>
                <div className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                  <div className="grid grid-cols-3 gap-2 px-0.5 py-2">
                    {group.options.map((option) => {
                      const active = variantChoice[group.id] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setVariantChoice((previous) => ({
                              ...previous,
                              [group.id]: option.id,
                            }))
                          }
                          className={cn(
                            "flex w-full flex-col items-center justify-center gap-2 rounded-[5px] px-6 py-4 text-center transition-colors cursor-pointer",
                            active
                              ? "bg-[#F5F0EA] outline outline-2 outline-offset-[-2px] outline-[#4A3F33]"
                              : "bg-white outline outline-[1.5px] outline-offset-[-1.5px] outline-[#CACBD4]",
                          )}
                        >
                          <span
                            className={cn(
                              "text-[14px] font-medium leading-4 tracking-[0.28px]",
                              active ? "text-black" : "text-[#595959]",
                            )}
                          >
                            {t(option.name)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Recipe / Customize Product */}
            {hasRecipe && (
              <div className="overflow-hidden rounded-[16px] bg-[#FAFAF7] p-4 outline outline-1 outline-offset-[-1px] outline-[#CACBD4]">
                <button
                  type="button"
                  onClick={() => setIsRecipeOpen((previous) => !previous)}
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
                      isRecipeOpen && "rotate-180",
                    )}
                  />
                </button>

                {isRecipeOpen && (
                  <div className="mt-3.5 flex flex-col gap-2.5 rounded-[16px] border border-[#8F6900] bg-[#FAFAF7] p-4">
                    {recipeItems.map((item, index) => {
                      const itemKey = String(item.id || item.material || index);
                      const isChecked = recipeSelection[itemKey] ?? true;
                      const qtyStr = item.quantity
                        ? `${item.quantity} ${item.unit || "g"}`
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
                                {t(item.name)}
                              </span>
                            </span>
                            {qtyStr && (
                              <span className="shrink-0 text-[12px] font-medium tracking-[0.24px] text-black">
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

            {/* Extras */}
            {hasExtras && (
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-1 text-[14px] font-medium tracking-[0.28px] text-[#333333]">
                  {t("Extras")}{" "}
                  <span className="text-[12px] font-medium text-[#8B8B8B]">
                    ({t("Optional")})
                  </span>
                </p>
                <div className="flex flex-col gap-3 overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] px-3 pb-1.5 pt-3">
                  <p className="text-[12px] font-medium tracking-[0.24px] text-black">
                    {t("Select extras for this product")}
                  </p>
                  <div className="h-px w-full bg-[#CACBD4]" />
                  <div className="flex flex-col gap-2 px-0.5 py-2">
                    {product.extras?.map((extra, index) => {
                      const isChecked = extraIds.includes(extra.id);
                      return (
                        <div key={extra.id} className="flex flex-col gap-2">
                          <label className="flex min-h-6 cursor-pointer items-center justify-between gap-3">
                            <span className="flex flex-1 items-center gap-1.5">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleExtra(extra.id)}
                                className={cn(
                                  "size-5 rounded-[6px] border bg-white transition-shadow",
                                  isChecked
                                    ? "border-[#8F6900] bg-[#8F6900] text-white ring-4 ring-[#8F6900]/10 data-checked:border-[#8F6900] data-checked:bg-[#8F6900] data-checked:text-white"
                                    : "border-[#CACBD4]",
                                )}
                              />
                              <span className="text-[13px] font-medium leading-4 tracking-[0.26px] text-[#28293D]">
                                {t(extra.name)}
                              </span>
                            </span>
                            <span className="shrink-0 text-[13px] font-medium tracking-[0.26px] text-black">
                              EGP{" "}
                              <span className="font-semibold">
                                {extra.price.toFixed(2)}
                              </span>
                            </span>
                          </label>
                          {index < (product.extras?.length ?? 0) - 1 && (
                            <div className="h-px w-full bg-[#CACBD4]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions / Special Request */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-black">
                {hasOptions ? t("Special Instructions") : t("Special Request")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
                  ({t("Optional")})
                </span>
              </label>
              {hasOptions ? (
                <textarea
                  value={specialRequest}
                  onChange={(event) => setSpecialRequest(event.target.value)}
                  rows={3}
                  placeholder={t("e.g. no sugar, heated")}
                  className="w-full resize-none rounded-[8px] border border-[#8E8E8E] bg-[#FEFEFE] px-3.5 py-3 text-[13px] text-black placeholder:text-[#595959] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <input
                  type="text"
                  value={specialRequest}
                  onChange={(event) => setSpecialRequest(event.target.value)}
                  placeholder={t("e.g No sugar, Extra hot")}
                  className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-black placeholder:text-[#8B8B8B] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}
            </div>

            {/* Selected extras summary badge pill */}
            {hasExtras &&
              selectedExtras.map((extra) => (
                <div
                  key={extra.name}
                  className="flex w-fit items-center rounded-[30px] border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]"
                >
                  {t("Extra")} {extra.name} + {formatCurrency(extra.price)}
                </div>
              ))}

            {/* Quantity */}
            <div className="flex items-center justify-between py-1">
              <p className="text-[14px] font-medium text-black">
                {t("Quantity")}
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
                  className="flex size-[28px] items-center justify-center rounded-[5.7px] border border-[#E5E5E5] bg-white cursor-pointer hover:bg-gray-50"
                >
                  <Minus className="size-3.5 text-black" />
                </button>
                <span className="w-5 text-center text-[13px] font-bold tracking-[0.26px] text-black">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="flex size-[28px] items-center justify-center rounded-[5.7px] border border-[#E5E5E5] bg-white cursor-pointer hover:bg-gray-50"
                >
                  <Plus className="size-3.5 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex shrink-0 items-center justify-end gap-4 border-t border-[#CACBD4] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-[56px] rounded-[5px] border border-primary px-[30px] py-4 text-[16px] font-semibold text-primary cursor-pointer"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-[56px] rounded-[5px] bg-primary px-[30px] py-4 text-[16px] font-semibold text-white cursor-pointer"
            >
              {submitLabel} <span className="font-bold">{formatCurrency(unitPrice * quantity)}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationModal;
