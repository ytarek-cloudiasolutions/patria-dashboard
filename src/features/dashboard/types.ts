import type { LucideIcon } from "lucide-react";

export type DashboardTrendTone = "positive" | "negative" | "neutral";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  badgeColor: string;
  trend?: {
    value: string;
    tone: DashboardTrendTone;
  };
}

export interface RevenuePoint {
  day: string;
  value: number;
}

export interface PerformanceIndicator {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: "gold" | "red" | "blue" | "amber";
}

export interface SoldProduct {
  id: string;
  rank: string;
  name: string;
  units: number;
}

export type OrderStatus = "Confirmed" | "Pending" | "Delivered" | "On The Way";

export interface LiveOrder {
  id: string;
  customer: string;
  initials: string;
  amount: number;
  time: string;
  status: OrderStatus;
}
