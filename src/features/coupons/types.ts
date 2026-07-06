// Re-export the canonical backend Coupon type from the store
export type { Coupon } from "./store/couponTypes";

// Shape emitted by CreateCouponForm and consumed by CouponsPage save handler
export interface CouponFormData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses?: number;
  expiryDate?: string;
  isActive: boolean;
}
