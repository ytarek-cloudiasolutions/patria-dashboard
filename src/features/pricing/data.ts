import type {
  AdjustmentType,
  PriceListProduct,
  PricingRule,
  PricingRuleType,
  WholesalePriceList,
} from "./types";

export const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 1,
    name: "Test Discount",
    type: "Bulk Discount",
    adjustmentType: "Percentage %",
    value: 0,
    minimumQuantity: 3,
  },
  {
    id: 2,
    name: "Test Discount",
    type: "Bulk Discount",
    adjustmentType: "Percentage %",
    value: 0,
    minimumQuantity: 3,
  },
];

export const INITIAL_WHOLESALE_LISTS: WholesalePriceList[] = [
  {
    id: 1,
    name: "Cafe",
    customerSegment: "Wholesale",
    authorized: true,
    products: [
      { id: "apple-danish", name: "Apple Danish", price: 420 },
      { id: "pistachio-biscotti", name: "Pistachio Biscotti", price: 120 },
    ],
  },
];

/** Catalog shown in the "New price list" product picker. */
export const PRICE_LIST_PRODUCTS: PriceListProduct[] = [
  { id: "cinnamon-roll", name: "Cinnamon Roll", price: 0 },
  { id: "apple-danish", name: "Apple Danish", price: 0 },
  { id: "pistachio-biscotti", name: "Pistachio Biscotti", price: 0 },
  { id: "banana-bread", name: "Banana Bread", price: 0 },
  { id: "blueberry-muffin", name: "Blueberry Muffin", price: 0 },
  { id: "almond-croissant", name: "Almond Croissant", price: 0 },
  { id: "chocolate-eclair", name: "Chocolate Eclair", price: 0 },
];

export const CUSTOMER_CATEGORY_OPTIONS = [
  { value: "Wholesale", label: "Wholesale" },
  { value: "Retail", label: "Retail" },
  { value: "VIP", label: "VIP" },
  { value: "Distributor", label: "Distributor" },
];

export const RULE_TYPE_OPTIONS: { value: PricingRuleType; label: string }[] = [
  { value: "Bulk Discount", label: "Bulk Discount" },
  { value: "Wholesale Tier", label: "Wholesale Tier" },
  { value: "Dynamic Surcharge", label: "Dynamic Surcharge" },
];

export const ADJUSTMENT_TYPE_OPTIONS: {
  value: AdjustmentType;
  label: string;
}[] = [
  { value: "Percentage %", label: "Percentage %" },
  { value: "Fixed Amount", label: "Fixed Amount" },
];
