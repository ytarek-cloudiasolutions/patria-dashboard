import type { ReactNode } from "react";

export interface CouponCardProps {
  id: number;
  title: string;
  value: number;
  badgeColor: string;
  icon: ReactNode;
  iconColor: string;
}

export interface CouponProps {
  id: number;
  code: string;
  discountType: "Fixed" | "Percentage";
  discountValue: number;
  minOrderFee?: number; // optional (because sometimes it's "-")
  usageCount: number;
  usageLimit?: number; // undefined = ∞
  startDate: string;
  endDate: string;
  isActive: boolean;
}
