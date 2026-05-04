import type {
  PricingStats,
  PricingRule,
  WholesalePriceList,
  PricingRuleType,
  AdjustmentType,
} from "./types";

export const pricingStats: PricingStats = {
  activePricingRules: 2,
  wholesalePriceLists: 0,
  averageDiscountRate: "12.4%",
  impactOnRevenue: "Monthly +18%",
};

export const initialPricingRules: PricingRule[] = [
  {
    id: "1",
    name: "Test Discount",
    type: "Bulk Discount",
    adjustmentType: "Percentage %",
    value: 0,
    minimumQuantity: 3,
  },
  {
    id: "2",
    name: "Test Discount",
    type: "Bulk Discount",
    adjustmentType: "Percentage %",
    value: 0,
    minimumQuantity: 3,
  },
];

export const initialWholesalePriceLists: WholesalePriceList[] = [];

export const PRICING_RULE_TYPES: PricingRuleType[] = [
  "Bulk Discount",
  "Category Discount",
  "Seasonal Surcharge",
  "Urgency Fee",
];

export const ADJUSTMENT_TYPES: AdjustmentType[] = [
  "Percentage %",
  "Fixed Amount",
];

export const defaultCreateFormData = {
  ruleName: "",
  type: "Bulk Discount" as PricingRuleType,
  adjustmentType: "Percentage %" as AdjustmentType,
  value: "",
  minimumQuantity: "0",
};
