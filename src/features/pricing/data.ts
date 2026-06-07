import type {
  AdjustmentType,
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

export const INITIAL_WHOLESALE_LISTS: WholesalePriceList[] = [];

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
