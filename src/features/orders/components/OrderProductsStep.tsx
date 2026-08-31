import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, SquarePen, X, Check } from "lucide-react";

import SearchInputField from "@/shared/components/SearchInputField";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CartLineItem, ProductOption } from "../types";
import { cartSubtotal, formatCurrency, nextLineUid } from "../utils";
import ProductCustomizationModal from "./ProductCustomizationModal";

interface OrderProductsStepProps {
  productOptions: ProductOption[];
  cart: CartLineItem[];
  onCartChange: (cart: CartLineItem[]) => void;
  onSearchProducts?: (search: string) => void;
  cartError?: string;
}

const OrderProductsStep = ({
  productOptions,
  cart,
  onCartChange,
  onSearchProducts,
  cartError,
}: OrderProductsStepProps) => {
  const { t } = useTranslation();
  const [customizing, setCustomizing] = useState<ProductOption | null>(null);
  const [editingLine, setEditingLine] = useState<CartLineItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchProducts?.(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearchProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return productOptions;
    return productOptions.filter((product) =>
      product.name.toLowerCase().includes(query),
    );
  }, [productOptions, searchQuery]);

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
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex flex-col gap-2">
        <SearchInputField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("Search products...")}
          className="w-full"
        />
        {cartError && (
          <p className="text-[13px] font-medium text-[#C90000]">{cartError}</p>
        )}
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filteredProducts.map((product) => {
          const totalQtyInCart = cart
            .filter((line) => line.productId === product.id)
            .reduce((sum, line) => sum + line.quantity, 0);
          const inCart = totalQtyInCart > 0;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductClick(product)}
              className={`flex flex-col justify-between rounded-[16px] p-3 text-start transition-colors min-h-[96px] cursor-pointer ${
                inCart
                  ? "border-[1.5px] border-primary bg-[#F5F0EA]"
                  : "border-[1.5px] border-[#E5E5E5] bg-[#FAFAF7] hover:border-primary/50"
              }`}
            >
              <span className="line-clamp-2 text-[16px] font-semibold tracking-[0.32px] text-black leading-[17.12px]">
                {product.name}
              </span>
              <div className="mt-4 flex items-center justify-between gap-1 w-full">
                <span className="text-[14px] tracking-[0.28px] text-black">
                  <span className="font-medium">EGP</span>{" "}
                  <span className="font-semibold">{product.unitPrice.toFixed(2)}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {product.customizable && (
                    <span className="rounded-[30px] border border-[#C7861E] bg-[rgba(254,154,0,0.10)] px-2 py-0.5 text-[11px] font-semibold tracking-[0.26px] text-[#C7861E]">
                      {t("Customizable")}
                    </span>
                  )}
                  {inCart && (
                    <span className="rounded-[50px] bg-primary px-2 py-0.5 text-[10px] font-bold tracking-[0.16px] text-white">
                      X{totalQtyInCart}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        </div>
      ) : (
        <div className="py-8 text-center text-[#8B8B8B] text-[14px]">
          {t("No products found")}
        </div>
      )}

      {/* Cart Items */}
      {cart.length > 0 && (
        <div className="space-y-4">
          {cart.map((line) => (
            <div
              key={line.uid}
              className="flex flex-col gap-3 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] p-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-[13px] font-bold tracking-[0.26px] text-[#333333]">
                    {line.name}
                  </p>
                  {line.variantSelections.length > 0 && (
                    <p className="text-[10px] font-semibold tracking-[0.20px] text-[#8B8B8B]">
                      {line.variantSelections
                        .map(
                          (selection) =>
                            `${t(selection.groupName)}: ${t(selection.optionName)}`,
                        )
                        .join(" - ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.uid)}
                  className="cursor-pointer text-black p-1"
                  aria-label="Remove item"
                >
                  <X className="size-[18px]" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.uid, -1)}
                    className="flex size-[28px] items-center justify-center rounded-[5.7px] border border-[#E5E5E5] bg-white cursor-pointer hover:bg-gray-50"
                  >
                    <Minus className="size-3.5 text-black" />
                  </button>
                  <span className="w-5 text-center text-[13px] font-bold tracking-[0.26px] text-black">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.uid, 1)}
                    className="flex size-[28px] items-center justify-center rounded-[5.7px] border border-[#E5E5E5] bg-white cursor-pointer hover:bg-gray-50"
                  >
                    <Plus className="size-3.5 text-black" />
                  </button>
                </div>
                <span className="text-[13px] tracking-[0.26px] text-black">
                  <span className="font-medium">EGP</span>{" "}
                  <span className="font-normal">
                    {(line.unitPrice * line.quantity).toFixed(2)}
                  </span>
                </span>
              </div>

              {line.extras.length > 0 && (
                <div
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%238F6900' stroke-width='1.5' stroke-dasharray='10 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                  }}
                  className="flex flex-col gap-2 rounded-[16px] bg-[#FAFAF7] p-3"
                >
                  {line.extras.map((extra) => (
                    <div
                      key={extra.name}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="rounded-[10px] p-1 bg-[#624F1C1A]">
                          <span className="flex size-[20px] items-center justify-center rounded-[5.99px] bg-[#8F6900] text-white">
                            <Check className="size-3.5 stroke-[3]" />
                          </span>
                        </div>
                        <span className="font-medium text-[#333333]">
                          {extra.name}
                        </span>
                      </div>
                      <span className="font-semibold text-black">
                        + {formatCurrency(extra.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {line.specialRequest && (
                <p className="text-[11px] italic text-[#8B8B8B]">
                  {line.specialRequest}
                </p>
              )}

              {(line.variantSelections.length > 0 ||
                line.extras.length > 0 ||
                line.specialRequest) && (
                <button
                  type="button"
                  onClick={() => startEdit(line)}
                  className="flex h-[40px] items-center justify-center gap-2 rounded-[5px] text-[12px] font-semibold tracking-[0.24px] text-primary cursor-pointer"
                >
                  <SquarePen className="size-[18px] text-primary" />
                  {t("Edit")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between rounded-[16px] border border-primary bg-[#F5F0EA] px-4 py-5">
        <span className="text-[14px] font-semibold uppercase tracking-wide text-black">
          {t("TOTAL")}
        </span>
        <span className="text-[20px] text-black">
          <span className="font-medium">EGP</span>{" "}
          <span className="font-bold">
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
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
