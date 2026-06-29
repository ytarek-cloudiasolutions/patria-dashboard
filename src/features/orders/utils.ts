import type { CartLineItem, OrderLineItem } from "./types";

/**
 * Translate the words inside a payment-method string while preserving any
 * numbers/symbols (e.g. "Cash 90 + Visa 190" → "نقدي 90 + فيزا 190").
 *
 * In English `t()` returns the same word, so each replace is a no-op.
 */
export const translatePaymentMethod = (
  method: string,
  t: (key: string) => string,
) =>
  method
    .replace(/Online Payment/g, t("Online Payment"))
    .replace(/Visa\/Card/g, t("Visa/Card"))
    .replace(/\bCash\b/g, t("Cash"))
    .replace(/\bVisa\b/g, t("Visa"))
    .replace(/\bMix\b/g, t("Mix"));

export const formatCurrency = (amount: number) =>
  `EGP ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

let lineCounter = 0;
export const nextLineUid = () => `line-${Date.now()}-${++lineCounter}`;

/** Per-unit price of a configured line: base + variant deltas + extra deltas. */
export const computeUnitPrice = (
  base: number,
  variantSelections: { price: number }[],
  extras: { price: number }[],
) =>
  base +
  variantSelections.reduce((sum, v) => sum + v.price, 0) +
  extras.reduce((sum, e) => sum + e.price, 0);

export const cartSubtotal = (cart: CartLineItem[]) =>
  cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

/** Flatten configured cart lines into the line items stored on an Order. */
export const cartToOrderItems = (cart: CartLineItem[]): OrderLineItem[] =>
  cart.map((line, index) => ({
    id: index + 1,
    productId: line.productId,
    name: line.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    note:
      line.specialRequest ??
      (line.extras.length > 0
        ? line.extras.map((extra) => extra.name).join(", ")
        : undefined),
  }));
