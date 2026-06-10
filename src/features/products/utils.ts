import type { ProductDiscount } from "./types";

export const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

/** Short label shown under a product's price when it carries a discount. */
export const discountLabel = (discount: ProductDiscount) =>
  discount.type === "fixed"
    ? `Discount: ${formatEgp(discount.value)}`
    : `Discount ${discount.value}%`;
