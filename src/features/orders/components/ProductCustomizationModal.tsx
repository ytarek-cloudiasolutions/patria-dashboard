import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
  const [specialRequest, setSpecialRequest] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;

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

  const hasExtras = Boolean(product.extras && product.extras.length > 0);

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
    });
    onClose();
  };

  const toggleExtra = (id: string | number) =>
    setExtraIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );

  const submitLabel = editingLine
    ? t("Update product")
    : hasExtras
      ? t("Add product to cart")
      : t("Add product");

  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-6 ring-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] sm:max-w-[575px]"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col gap-6">
          {/* Header */}
          {hasExtras ? (
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

          <div className="flex-1 space-y-6 overflow-y-auto pr-1">
            {/* Variant groups */}
            {product.variantGroups?.map((group) => (
              <div key={group.id} className="flex flex-col gap-2.5">
                <p className="text-[16px] font-semibold text-black">
                  {t(group.name)}
                  {group.required && <span className="text-black"> *</span>}
                </p>
                <div className="flex items-center gap-3">
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
                        style={{
                          borderRadius: "4px",
                          border: active
                            ? "4px solid rgba(98, 79, 28, 0.50)"
                            : "4px solid #E5E5E5",
                          background: active ? "#F5F0EA" : "#FAFAF7",
                        }}
                        className="flex flex-1 items-center justify-center py-3.5 px-2 text-center cursor-pointer"
                      >
                        <span className="text-[14px] tracking-[0.28px]">
                          <span className={active ? "font-medium text-[#8F6900]" : "font-medium text-[#333333]"}>
                            {t(option.name)}
                          </span>{" "}
                          <span className={active ? "font-bold text-[#8F6900]" : "font-medium text-[#333333]"}>
                            +{option.price > 0 ? `EGP ${option.price}` : `EGP 0`}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Extras */}
            {hasExtras && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[14px] font-medium text-[#28293D] tracking-[0.28px]">
                  {t("Extras")}{" "}
                  <span className="text-[13px] font-medium text-[#595959]">
                    ({t("Optional")})
                  </span>
                </p>
                <div className="flex flex-col gap-2 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                  {product.extras?.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex cursor-pointer items-center justify-between gap-3 px-0.5 py-1"
                    >
                      <span className="flex items-center gap-2">
                        <Checkbox
                          checked={extraIds.includes(extra.id)}
                          onCheckedChange={() => toggleExtra(extra.id)}
                          className="h-5 w-5 rounded-[5.99px] border-[#8F6900] data-[state=checked]:bg-[#8F6900] cursor-pointer"
                        />
                        <span className="text-[13px] font-medium tracking-[0.26px] text-[#333333]">
                          {extra.name}
                        </span>
                      </span>
                      <span className="text-[13px] tracking-[0.26px] text-black">
                        <span className="font-medium">EGP </span>
                        <span className="font-semibold">{extra.price.toFixed(2)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions / Special Request */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-black">
                {hasExtras ? t("Special Instructions") : t("Special Request")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
                  ({t("Optional")})
                </span>
              </label>
              {hasExtras ? (
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
          <div className="flex items-center justify-end gap-4 border-t border-[#CACBD4] pt-6">
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
