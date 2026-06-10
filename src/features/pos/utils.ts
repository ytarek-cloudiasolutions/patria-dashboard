import type { CartItem, CartTotals } from "./types";

export const TAX_RATE = 0.14;

/** "EGP 85.20" — currency-prefixed amount with two decimals. */
export const formatEgp = (value: number) => `EGP ${value.toFixed(2)}`;

/** "460" / "89.25" — bare amount used on product cards (no currency). */
export const formatEgpAmount = (value: number) =>
  Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);

/** "10:43 PM" — 12-hour clock used in the POS topbar. */
export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

/** Price of a single unit including its selected extras. */
export const lineUnitPrice = (item: CartItem) =>
  item.unitPrice +
  item.extras.reduce((sum, extra) => sum + (extra.selected ? extra.price : 0), 0);

/** Total price of a cart line (unit + extras) × quantity. */
export const lineTotal = (item: CartItem) => lineUnitPrice(item) * item.qty;

/** Derive the subtotal / extras / tax / total / item-count for a cart. */
export const computeTotals = (items: CartItem[]): CartTotals => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  );
  const extras = items.reduce(
    (sum, item) =>
      sum +
      item.extras.reduce(
        (extraSum, extra) => extraSum + (extra.selected ? extra.price : 0),
        0,
      ) *
        item.qty,
    0,
  );
  const tax = (subtotal + extras) * TAX_RATE;
  const total = subtotal + extras + tax;
  const itemCount = items.reduce(
    (count, item) =>
      count + item.qty + item.extras.filter((extra) => extra.selected).length,
    0,
  );

  return { subtotal, extras, tax, total, itemCount };
};
