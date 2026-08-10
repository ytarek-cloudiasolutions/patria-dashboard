import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "@/shared/i18n/useTranslation";
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
  const [extras, setExtras] = useState<CartExtra[]>([]);
  const [instructions, setInstructions] = useState("");
  const [qty, setQty] = useState(1);

  // Re-seed local state whenever the dialog opens for a product / edit line.
  useEffect(() => {
    if (!open || !product) return;

    if (editLine) {
      setExtras(editLine.extras.map((extra) => ({ ...extra })));
      setInstructions(editLine.instructions ?? "");
      setQty(editLine.qty);
    } else {
      setExtras(
        (product.extras ?? []).map((extra) => ({ ...extra, selected: false })),
      );
      setInstructions("");
      setQty(1);
    }
  }, [open, product, editLine]);

  if (!product) return null;

  const selectedExtras = extras.filter((extra) => extra.selected);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const total = (product.price + extrasTotal) * qty;

  const toggleExtra = (id: string) =>
    setExtras((prev) =>
      prev.map((extra) =>
        extra.id === id ? { ...extra, selected: !extra.selected } : extra,
      ),
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[575px] max-w-[calc(100%-2rem)] gap-6 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[575px]"
      >
        <DialogHeader className="p-0">
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

        <div className="flex flex-col gap-5">
          {/* Extras Section */}
          {extras.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-medium tracking-[0.28px] text-[#28293D]">
                {t("Extras")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
                  ({t("Optional")})
                </span>
              </p>
              <div className="flex flex-col gap-2 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                <div className="space-y-1">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex cursor-pointer items-center justify-between px-0.5 py-2"
                    >
                      <span className="flex items-center gap-2 text-[13px] font-medium leading-[13.91px] tracking-[0.26px] text-[#333333]">
                        <Checkbox
                          checked={extra.selected}
                          onCheckedChange={() => toggleExtra(extra.id)}
                        />
                        {extra.name}
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

          {/* Special Instructions */}
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

        {/* Separator Line & Footer */}
        <div className="w-full border-t border-[#CACBD4] pt-4">
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
