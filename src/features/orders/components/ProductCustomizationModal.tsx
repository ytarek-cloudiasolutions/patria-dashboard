import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { Button } from "@/shared/components/ui/button";
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
  const { t } = useTranslation();
  // groupId -> optionId
  const [variantChoice, setVariantChoice] = useState<Record<number, number>>({});
  const [extraIds, setExtraIds] = useState<number[]>([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;

    if (editingLine) {
      const choice: Record<number, number> = {};
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
    const defaults: Record<number, number> = {};
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

  const toggleExtra = (id: number) =>
    setExtraIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );

  const submitLabel = editingLine
    ? t("Update product")
    : hasExtras
      ? t("Add products to cart")
      : t("Add product");

  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] bg-white p-0 ring-0 sm:max-w-140"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            {hasExtras ? (
              <div className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3">
                <DialogTitle className="text-[16px] font-semibold text-[#28293D]">
                  {product.name}
                </DialogTitle>
                <p className="mt-0.5 text-[12px] text-[#8B8B8B]">
                  {t("Original Price")}: {formatCurrency(product.unitPrice)}
                </p>
              </div>
            ) : (
              <>
                <DialogTitle className="text-[18px] font-semibold text-[#28293D]">
                  {product.name}
                </DialogTitle>
                <p className="mt-1 text-[13px] text-[#8B8B8B]">
                  {t("Origin Price")}: {product.unitPrice.toFixed(2)}
                </p>
              </>
            )}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
            {/* Variant groups */}
            {product.variantGroups?.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-[14px] font-semibold text-[#333333]">
                  {t(group.name)}
                  {group.required && <span className="text-[#C90000]"> *</span>}
                </p>
                <div className="grid grid-cols-3 gap-2.5">
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
                        className={`flex h-12 items-center justify-center rounded-[8px] border px-2 text-center text-[12px] transition-colors ${
                          active
                            ? "border-primary bg-[#F5F0EA] font-bold text-[#8F6900]"
                            : "border-[#E5E5E5] bg-white font-medium text-[#333333]"
                        }`}
                      >
                        {t(option.name)} +EGP {option.price}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Extras */}
            {hasExtras && (
              <div>
                <p className="mb-2 text-[14px] font-semibold text-[#333333]">
                  {t("Extras")}{" "}
                  <span className="font-normal text-[#8B8B8B]">
                    ({t("Optional")})
                  </span>
                </p>
                <div className="space-y-3 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] p-3.5">
                  {product.extras?.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex cursor-pointer items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2.5">
                        <Checkbox
                          checked={extraIds.includes(extra.id)}
                          onCheckedChange={() => toggleExtra(extra.id)}
                          className="h-5 w-5 rounded-[5.99px] border-[#8F6900] cursor-pointer"
                        />
                        <span className="text-[13px] text-[#333333]">
                          {extra.name}
                        </span>
                      </span>
                      <span className="text-[13px] text-[#8B8B8B]">
                        EGP{" "}
                        <span className="font-semibold text-[#333333]">
                          {extra.price.toFixed(2)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special request / instructions */}
            <div>
              <p className="mb-2 text-[14px] font-semibold text-[#333333]">
                {hasExtras ? t("Special Instructions") : t("Special Request")}{" "}
                <span className="font-normal text-[#8B8B8B]">
                  ({t("Optional")})
                </span>
              </p>
              <textarea
                value={specialRequest}
                onChange={(event) => setSpecialRequest(event.target.value)}
                rows={2}
                placeholder={
                  hasExtras
                    ? t("e.g. no sugar, heated")
                    : t("e.g No sugar, Extra hot")
                }
                className="w-full resize-none rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:outline-none"
              />
            </div>

            {/* Selected extras summary chips */}
            {hasExtras &&
              selectedExtras.map((extra) => (
                <div
                  key={extra.name}
                  className="flex items-center rounded-full border border-primary bg-white px-4 py-2 text-[12px] font-medium text-[#8F6900]"
                >
                  {t("Extra")} {extra.name} + {formatCurrency(extra.price)}
                </div>
              ))}

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-[#333333]">
                {t("Quantity")}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
                  className="flex size-7 items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7]"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center text-[14px] font-bold text-[#28293D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="flex size-7 items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7]"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white px-5 pb-5 sm:px-6 sm:pb-6">
            <Separator className="mb-4 bg-[#D9D9D9]" />
            <div className="flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: onClose,
                  className:
                    "border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex h-12 cursor-pointer items-center justify-center rounded-[5px] px-5 text-[14px] font-semibold text-white sm:h-14"
              >
                {submitLabel} {formatCurrency(unitPrice * quantity)}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationModal;
