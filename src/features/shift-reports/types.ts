export type ShiftReportsTab = "daily" | "most-selling" | "shifts" | "staff-tabs";

export interface StaffTabOrder {
  id: string;
  orderNumber: string;
  items: string;
  date: string;
  price: number;
  status: "Paid" | "Unpaid";
}

export interface StaffTabUser {
  id: string;
  name: string;
  totalOrders: number;
  unpaidOrders: number;
  total: number;
  paid: number;
  balance: number;
  orders: StaffTabOrder[];
}

export type ShiftName = "Morning" | "Evening" | "Night";

export type ShiftStatus = "On Going" | "Completed";

// --- Daily report -----------------------------------------------------------

export interface ProductSoldRow {
  id: number;
  label: string;
  product: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface DailyReport {
  orders: number;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  ordersAtDiscount: number;
  products: ProductSoldRow[];
}

// --- Most selling -----------------------------------------------------------

export interface TopProduct {
  rank: number;
  name: string;
  count: number;
}

export interface DailySale {
  id: number;
  date: string;
  orders: number;
  revenue: number;
}

// --- Shift reports ----------------------------------------------------------

export interface ShiftRow {
  id: number;
  employee: string;
  role: string;
  shift: ShiftName | "-";
  start: string;
  end: string;
  duration: string;
  orders: number;
  revenue: number;
  discount?: number;
  status: ShiftStatus;
}

