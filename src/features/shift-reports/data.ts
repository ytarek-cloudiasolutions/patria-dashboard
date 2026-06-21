import type {
  DailyReport,
  DailySale,
  ShiftRow,
  TopProduct,
} from "./types";

export const SHIFT_OPTIONS = [
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
  { value: "Night", label: "Night" },
];

export const PERIOD_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const DAILY_REPORT: DailyReport = {
  orders: 1,
  quantity: 2,
  revenue: 250,
  cost: 120,
  profit: 5,
  profitMargin: 15,
  ordersAtDiscount: 2,
  products: [
    {
      id: 1,
      label: "Total",
      product: "Eish El Saraya",
      quantity: 2,
      revenue: 280,
      cost: 280,
      profit: 280,
      margin: 0,
    },
  ],
};

export const TOP_PRODUCTS: TopProduct[] = [
  { rank: 1, name: "Boldly Dark Glitch", count: 64 },
  { rank: 2, name: "Avocado Ranch", count: 13 },
  { rank: 3, name: "Middle Eastern Roast Beef", count: 13 },
  { rank: 4, name: "Almond Croissant", count: 11 },
  { rank: 5, name: "Amber Sobia", count: 10 },
];

export const DAILY_SALES: DailySale[] = [
  { id: 1, date: "3/31/2026", orders: 1, revenue: 10000 },
  { id: 2, date: "3/31/2026", orders: 2, revenue: 250000 },
];

const baseShift = {
  employee: "Super Admin",
  role: "Admin",
  start: "3/31/2026, 2:37:57 PM",
  end: "3/31/2026, 2:37:57 PM",
  duration: "10h 22m",
  revenue: 280,
};

export const SHIFT_ROWS: ShiftRow[] = [
  { id: 1, ...baseShift, shift: "Morning", orders: 22, status: "On Going" },
  { id: 2, ...baseShift, shift: "Evening", orders: 15, status: "Completed" },
  { id: 3, ...baseShift, shift: "-", orders: 23, status: "Completed" },
  { id: 4, ...baseShift, shift: "-", orders: 12, status: "Completed" },
  {
    id: 5,
    ...baseShift,
    shift: "-",
    orders: 22,
    discount: -80,
    status: "Completed",
  },
];
