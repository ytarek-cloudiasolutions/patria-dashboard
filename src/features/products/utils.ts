import type { ProductDiscount } from "./types";

export const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

export const formatUnit = (unit?: string): string => {
  if (!unit) return "pcs";
  const u = unit.trim().toLowerCase();
  if (u === "g" || u === "gram" || u === "grams" || u === "gram(s)") return "g";
  if (u === "kg" || u === "kilogram" || u === "kilograms" || u === "kilogram(s)") return "kg";
  if (u === "ml" || u === "milliliter" || u === "milliliters" || u === "milliliter(s)") return "ml";
  if (u === "l" || u === "liter" || u === "liters" || u === "liter(s)") return "L";
  if (
    u === "pcs" ||
    u === "pc" ||
    u === "piece" ||
    u === "pieces" ||
    u === "piece(s)" ||
    u === "unit" ||
    u === "units"
  )
    return "pcs";
  return unit;
};

/** Short label shown under a product's price when it carries a discount. */
export const discountLabel = (discount: ProductDiscount) =>
  discount.type === "fixed"
    ? `Discount: ${formatEgp(discount.value)}`
    : `Discount ${discount.value}%`;
