import { api } from "@/config/api";
import type {
  AdjustmentType,
  PriceListFormData,
  PricingRule,
  PricingRuleFormData,
  PricingRuleType,
  WholesalePriceList,
} from "../types";

// ─── Backend ↔ Frontend type maps ─────────────────────────────────────────────

const RULE_TYPE_TO_BACKEND: Record<PricingRuleType, string> = {
  "Bulk Discount": "bulk_discount",
  "Wholesale Tier": "loyalty_discount",
  "Dynamic Surcharge": "surcharge",
};

const RULE_TYPE_FROM_BACKEND: Record<string, PricingRuleType> = {
  bulk_discount: "Bulk Discount",
  loyalty_discount: "Wholesale Tier",
  surcharge: "Dynamic Surcharge",
  seasonal: "Bulk Discount",
};

const ADJ_TYPE_TO_BACKEND: Record<AdjustmentType, string> = {
  "Percentage %": "percentage",
  "Fixed Amount": "fixed",
};

const ADJ_TYPE_FROM_BACKEND: Record<string, AdjustmentType> = {
  percentage: "Percentage %",
  fixed: "Fixed Amount",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRule(r: any): PricingRule {
  return {
    id: r._id as unknown as number,
    name: r.name ?? "",
    type: RULE_TYPE_FROM_BACKEND[r.type] ?? "Bulk Discount",
    adjustmentType: ADJ_TYPE_FROM_BACKEND[r.adjustmentType] ?? "Percentage %",
    value: r.value ?? 0,
    minimumQuantity: r.minQuantity ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPriceList(l: any): WholesalePriceList {
  const products = (l.items ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => {
      const p = item.productId;
      if (p && typeof p === "object") {
        return {
          id: String(p._id),
          name: p.name ?? "",
          price: item.price ?? 0,
        };
      }
      return {
        id: String(item.productId ?? ""),
        name: "",
        price: item.price ?? 0,
      };
    },
  );
  return {
    id: l._id as unknown as number,
    name: l.name ?? "",
    customerSegment: l.description ?? "",
    products,
    authorized: l.isActive !== false,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export interface PricingStats {
  activeRulesCount: number;
  priceListsCount: number;
  avgDiscountRate: number;
  monthlyRevenue: number;
}

export interface FetchPricingResult {
  rules: PricingRule[];
  priceLists: WholesalePriceList[];
  stats: PricingStats;
}

export async function fetchPricing(): Promise<FetchPricingResult> {
  const { data } = await api.get("/pricing");
  return {
    rules: ((data.rules ?? []) as unknown[])
      .filter((r: unknown) => (r as { isActive?: boolean }).isActive !== false)
      .map(mapRule),
    priceLists: ((data.priceLists ?? []) as unknown[]).map(mapPriceList),
    stats: (data.stats as PricingStats) ?? {
      activeRulesCount: 0,
      priceListsCount: 0,
      avgDiscountRate: 0,
      monthlyRevenue: 0,
    },
  };
}

export async function createPricingRule(
  data: PricingRuleFormData,
): Promise<PricingRule> {
  const body = {
    name: data.name.trim(),
    type:
      RULE_TYPE_TO_BACKEND[data.type as PricingRuleType] ?? "bulk_discount",
    adjustmentType:
      ADJ_TYPE_TO_BACKEND[data.adjustmentType as AdjustmentType] ??
      "percentage",
    value: Number(data.value) || 0,
    minQuantity: Number(data.minimumQuantity) || 0,
  };
  const { data: res } = await api.post("/pricing/rules", body);
  return mapRule((res as { rule: unknown }).rule);
}

export async function deletePricingRule(id: string): Promise<void> {
  await api.delete(`/pricing/rules/${id}`);
}

export async function createPriceList(
  data: PriceListFormData,
): Promise<WholesalePriceList> {
  const body = {
    name: data.name,
    description: data.customerSegment,
    // products from the dialog use mock string IDs, not valid MongoDB ObjectIds,
    // so items are sent empty; the list can be edited with real products later
    items: [],
  };
  const { data: res } = await api.post("/pricing/pricelists", body);
  // Merge customerSegment back since description is used as customerSegment
  const list = mapPriceList((res as { priceList: unknown }).priceList);
  return { ...list, products: data.products, authorized: true };
}

export async function deletePriceList(id: string): Promise<void> {
  await api.delete(`/pricing/pricelists/${id}`);
}
