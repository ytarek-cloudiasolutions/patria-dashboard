import { useState } from "react";
import { Minus, Pencil, Plus, X } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartLineItem, ProductOption } from "../types";
import { cartSubtotal, formatCurrency, nextLineUid } from "../utils";
import ProductCustomizationModal from "./ProductCustomizationModal";

interface OrderProductsStepProps {
  productOptions: ProductOption[];
  cart: CartLineItem[];
  onCartChange: (cart: CartLineItem[]) => void;
}

const OrderProductsStep = ({
  productOptions,
  cart,
  onCartChange,
}: OrderProductsStepProps) => {
  const { t } = useTranslation();
  const [customizing, setCustomizing] = useState<ProductOption | null>(null);
  const [editingLine, setEditingLine] = useState<CartLineItem | null>(null);

  const handleProductClick = (product: ProductOption) => {
    if (product.customizable) {
      setEditingLine(null);
      setCustomizing(product);
      return;
    }

    // Plain product: stack quantity on an existing identical line.
    const existing = cart.find(
      (line) =>
        line.productId === product.id &&
        line.variantSelections.length === 0 &&
        line.extras.length === 0 &&
        !line.specialRequest,
    );

    if (existing) {
      onCartChange(
        cart.map((line) =>
          line.uid === existing.uid
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        ),
      );
      return;
    }

    onCartChange([
      ...cart,
      {
        uid: nextLineUid(),
        productId: product.id,
        name: product.name,
        basePrice: product.unitPrice,
        unitPrice: product.unitPrice,
        quantity: 1,
        variantSelections: [],
        extras: [],
      },
    ]);
  };

  const handleModalSubmit = (line: CartLineItem) => {
    const exists = cart.some((item) => item.uid === line.uid);
    onCartChange(
      exists
        ? cart.map((item) => (item.uid === line.uid ? line : item))
        : [...cart, line],
    );
  };

  const updateQuantity = (uid: string, delta: number) => {
    onCartChange(
      cart
        .map((line) =>
          line.uid === uid
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeLine = (uid: string) =>
    onCartChange(cart.filter((line) => line.uid !== uid));

  const startEdit = (line: CartLineItem) => {
    const product = productOptions.find((item) => item.id === line.productId);
    if (!product) return;
    setEditingLine(line);
    setCustomizing(product);
  };

  const subtotal = cartSubtotal(cart);

  return (
    <div className="space-y-5">
      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {productOptions.map((product) => {
          const inCart = cart.some((line) => line.productId === product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductClick(product)}
              className={`flex h-[88px] flex-col justify-between rounded-[12px] border bg-white p-3 text-start transition-colors ${
                inCart
                  ? "border-primary ring-1 ring-primary"
                  : "border-[#E5E5E5] hover:border-primary/40"
              }`}
            >
              <span className="line-clamp-2 text-[13px] font-semibold text-[#333333]">
                {product.name}
              </span>
              <span className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-semibold text-[#28293D]">
                  EGP {product.unitPrice}
                </span>
                {product.customizable && (
                  <Badge className="h-5 rounded-full border border-[#624f1c] bg-[#8f6900] px-2 text-[9px] font-medium text-white">
                    {t("Customizable")}
                  </Badge>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="space-y-3">
          {cart.map((line) => (
            <div
              key={line.uid}
              className="rounded-[12px] border border-[#E5E5E5] bg-white p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#333333]">
                    {line.name}
                  </p>
                  {line.variantSelections.length > 0 && (
                    <p className="mt-0.5 text-[11px] text-[#8B8B8B]">
                      {line.variantSelections
                        .map(
                          (selection) =>
                            `${t(selection.groupName)}: ${t(selection.optionName)}`,
                        )
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.uid)}
                  className="cursor-pointer text-[#8B8B8B] hover:text-[#C90000]"
                  aria-label="Remove item"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.uid, -1)}
                    className="flex size-[26px] items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7]"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-5 text-center text-[13px] font-bold text-[#28293D]">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.uid, 1)}
                    className="flex size-[26px] items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7]"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="text-[13px] font-semibold text-[#28293D]">
                  {formatCurrency(line.unitPrice * line.quantity)}
                </span>
              </div>

              {line.extras.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-dashed border-[#E5E5E5] pt-2">
                  {line.extras.map((extra) => (
                    <div
                      key={extra.name}
                      className="flex items-center justify-between text-[11px] text-[#8B8B8B]"
                    >
                      <span>{extra.name}</span>
                      <span>+{formatCurrency(extra.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {line.specialRequest && (
                <p className="mt-2 text-[11px] italic text-[#8B8B8B]">
                  {line.specialRequest}
                </p>
              )}

              {(line.variantSelections.length > 0 ||
                line.extras.length > 0 ||
                line.specialRequest) && (
                <button
                  type="button"
                  onClick={() => startEdit(line)}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-primary"
                >
                  <Pencil className="size-3.5" />
                  {t("Edit")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between rounded-[12px] border border-[#D9D9D9] bg-[#FAFAF7] px-4 py-3.5">
        <span className="text-[14px] font-semibold text-[#333333]">
          {t("TOTAL")}
        </span>
        <span className="text-[16px] font-bold text-[#28293D]">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <ProductCustomizationModal
        product={customizing}
        editingLine={editingLine}
        onClose={() => {
          setCustomizing(null);
          setEditingLine(null);
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default OrderProductsStep;
