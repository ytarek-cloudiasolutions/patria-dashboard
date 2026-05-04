export type PricingRuleType =
  | "Bulk Discount"
  | "Category Discount"
  | "Seasonal Surcharge"
  | "Urgency Fee";

export type AdjustmentType = "Percentage %" | "Fixed Amount";

export interface PricingRule {
  id: string;
  name: string;
  type: PricingRuleType;
  adjustmentType: AdjustmentType;
  value: number;
  minimumQuantity: number;
}

export interface WholesalePriceList {
  id: string;
  name: string;
  description?: string;
}

export interface CreatePricingRuleFormData {
  ruleName: string;
  type: PricingRuleType;
  adjustmentType: AdjustmentType;
  value: string;
  minimumQuantity: string;
}

export interface PricingStats {
  activePricingRules: number;
  wholesalePriceLists: number;
  averageDiscountRate: string;
  impactOnRevenue: string;
}

// Component prop types
export interface PricingRuleCardProps {
  rule: PricingRule;
  onEdit: (rule: PricingRule) => void;
  onDelete: (id: string) => void;
}

export interface CreatePricingRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePricingRuleFormData) => void;
}

export interface ActivePricingRulesSectionProps {
  rules: PricingRule[];
  onEdit: (rule: PricingRule) => void;
  onDelete: (id: string) => void;
}

export interface WholesalePriceListsSectionProps {
  priceLists: WholesalePriceList[];
}