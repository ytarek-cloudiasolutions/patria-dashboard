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
        className="w-[560px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[560px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {product.name}
          </DialogTitle>
          <p className="text-[12px] text-[#8B8B8B]">
            {product.originalPrice ? (
              <>
                {t("Original Price")}:{" "}
                <span className="line-through">
                  {formatEgp(product.originalPrice)}
                </span>{" "}
                <span className="font-semibold text-primary">
                  {formatEgp(product.price)}
                </span>
              </>
            ) : (
              formatEgp(product.price)
            )}
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          {extras.length > 0 && (
            <div>
              <p className="mb-2 text-[13px] font-semibold text-[#333333]">
                {t("Extras")}{" "}
                <span className="text-[11px] font-normal text-[#8B8B8B]">
                  ({t("Optional")})
                </span>
              </p>
              <div className="space-y-2">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-[#EDEBE7] px-3 py-2.5 text-[13px] text-[#333333]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Checkbox
                        checked={extra.selected}
                        onCheckedChange={() => toggleExtra(extra.id)}
                      />
                      {extra.name}
                    </span>
                    <span className="font-semibold">
                      {formatEgp(extra.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#333333]">
              {t("Special Instructions")}{" "}
              <span className="text-[11px] font-normal text-[#8B8B8B]">
                ({t("Optional")})
              </span>
            </p>
            <Textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder={t("e.g. no sugar, heated")}
              className="min-h-16 rounded-[8px] border-[#E5E2DD] bg-white px-3 py-2.5 text-[13px] placeholder:text-[#A5A5A5] focus-visible:ring-0"
            />
          </div>

          {selectedExtras.length > 0 && (
            <div className="flex items-center justify-between rounded-[8px] border border-primary/60 bg-[#FBF6EE] px-3 py-2.5 text-[12px] font-semibold text-primary">
              <span>
                {t("Extra")}{" "}
                {selectedExtras.map((extra) => extra.name).join(", ")}
              </span>
              <span>+ {formatEgp(extrasTotal)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#333333]">
              {t("Quantity")}
            </p>
            <div className="flex items-center gap-3">
              <button
                className="flex size-8 items-center justify-center rounded-[6px] border border-[#E5E2DD] bg-[#FAFAFA] text-[#333333] hover:bg-[#F2F0EC] disabled:opacity-40"
                aria-label={t("Decrease")}
                disabled={qty <= 1}
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                <Minus className="size-3.5" />
              </button>
              <span className="min-w-6 text-center text-[14px] font-bold text-[#333333]">
                {qty}
              </span>
              <button
                className="flex size-8 items-center justify-center rounded-[6px] border border-[#E5E2DD] bg-[#FAFAFA] text-[#333333] hover:bg-[#F2F0EC]"
                aria-label={t("Increase")}
                onClick={() => setQty((value) => value + 1)}
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="h-12 flex-1 rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90"
            onClick={() => onConfirm({ extras, instructions, qty })}
          >
            {editLine ? t("Update cart") : t("Add product to cart")}{" "}
            {formatEgp(total)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizeDialog;
