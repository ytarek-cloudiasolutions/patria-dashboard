import {
  TrendingUp,
  Box,
  Wallet,
  Coffee,
  Users,
  ShoppingBag,
  DollarSign,
  Tag,
  UserRoundCheck,
} from "lucide-react";
import type {
  DashboardMetric,
  LiveOrder,
  PerformanceIndicator,
  RevenuePoint,
  SoldProduct,
} from "./types";

export const DASHBOARD_DATE = "Wednesday, April 22, 2026";

export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "120,000.00",
    icon: TrendingUp,
    iconColor: "text-primary",
    badgeColor: "bg-[#F5F0EA]",
    trend: { value: "189%", tone: "positive" },
  },
  {
    id: "orders",
    title: "Total Orders",
    value: 7,
    icon: ShoppingBag,
    iconColor: "text-[#155DFC]",
    badgeColor: "bg-[#DBEAFE]",
    trend: { value: "26%", tone: "negative" },
  },
  {
    id: "products",
    title: "Total Products",
    value: 11,
    icon: Coffee,
    iconColor: "text-[#C7861E]",
    badgeColor: "bg-[#FFF0D7]",
  },
  {
    id: "offers",
    title: "Active Offers",
    value: 3,
    icon: Tag,
    iconColor: "text-[#059B5A]",
    badgeColor: "bg-[#E2F4ED]",
  },
];

export const REVENUE_TREND: RevenuePoint[] = [
  { day: "Wed", value: 1500 },
  { day: "Thu", value: 1750 },
  { day: "Fri", value: 1600 },
  { day: "Sat", value: 1450 },
  { day: "Sun", value: 1500 },
  { day: "Mon", value: 2550 },
  { day: "Tue", value: 2100 },
  { day: "Tue", value: 4900 },
  { day: "Tue", value: 7200 },
  { day: "Tue", value: 7600 },
  { day: "Wed", value: 500 },
];

export const PERFORMANCE_INDICATORS: PerformanceIndicator[] = [
  {
    id: "staff",
    label: "Active Staff",
    value: 0,
    icon: ShoppingBag,
    tone: "gold",
  },
  {
    id: "register",
    label: "Open Register",
    value: 1,
    icon: Wallet,
    tone: "red",
  },
  {
    id: "pos",
    label: "Pending POs",
    value: 3,
    icon: Users,
    tone: "blue",
  },
  {
    id: "restock",
    label: "Restock Warnings",
    value: 7,
    icon: DollarSign,
    tone: "amber",
  },
];

export const TOP_SOLD_PRODUCTS: SoldProduct[] = [
  { id: "dark-glitch", rank: "01", name: "Boldly Dark Glitch", units: 15 },
  { id: "avocado-ranch", rank: "02", name: "Avocado Ranch", units: 13 },
  {
    id: "middle-eastern",
    rank: "03",
    name: "Middle Eastern Roast Beef",
    units: 13,
  },
  { id: "almond-croissant", rank: "04", name: "Almond Croissant", units: 11 },
  { id: "amber-sobia", rank: "05", name: "Amber Sobia", units: 10 },
];

export const LIVE_ORDERS: LiveOrder[] = [
  {
    id: "ORD-688377-1",
    customer: "Walk-in Customer",
    initials: "W",
    amount: 1940,
    time: "11:18 AM",
    status: "Confirmed",
  },
  {
    id: "ORD-688377-2",
    customer: "Youssef",
    initials: "Y",
    amount: 2510,
    time: "11:18 AM",
    status: "Pending",
  },
  {
    id: "ORD-688377-3",
    customer: "Omnia Galal",
    initials: "O",
    amount: 800,
    time: "11:18 AM",
    status: "Delivered",
  },
  {
    id: "ORD-688377-4",
    customer: "Mohamed Maher",
    initials: "M",
    amount: 1940,
    time: "11:18 AM",
    status: "On The Way",
  },
  {
    id: "ORD-688377-5",
    customer: "Walk-in Customer",
    initials: "W",
    amount: 120.63,
    time: "11:18 AM",
    status: "Confirmed",
  },
];

export const ORDER_STREAM_ICON = UserRoundCheck;
export const PRODUCT_PANEL_ICON = Box;
