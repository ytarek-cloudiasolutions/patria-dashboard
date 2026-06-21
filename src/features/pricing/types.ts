export type PricingRuleType =
  | "Bulk Discount"
  | "Wholesale Tier"
  | "Dynamic Surcharge";

export type AdjustmentType = "Percentage %" | "Fixed Amount";

export interface PricingRule {
  id: number;
  name: string;
  type: PricingRuleType;
  adjustmentType: AdjustmentType;
  value: number;
  minimumQuantity: number;
}

export interface PriceListProduct {
  id: string;
  name: string;
  price: number;
}

export interface WholesalePriceList {
  id: number;
  name: string;
  customerSegment: string;
  products: PriceListProduct[];
  authorized: boolean;
}

export interface PriceListFormData {
  name: string;
  customerSegment: string;
  products: PriceListProduct[];
}

export interface PricingRuleFormData {
  name: string;
  type: PricingRuleType | "";
  adjustmentType: AdjustmentType | "";
  value: string;
  minimumQuantity: string;
}

export interface PricingDateRange {
  from: string;
  to: string;
}
