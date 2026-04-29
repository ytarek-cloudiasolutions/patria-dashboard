export type ReportTab = "overview" | "employee" | "branch";

export type EODStatus = "Open" | "Closed";
export type ShiftStatus = "Finished" | "Active";
export type EmployeeStatus = "Open" | "Closed";

// ---- Overview ----
export interface OverviewStats {
  totalRevenue: string;
  averageDemand: string;
  numberOfOrders: number;
  numberOfCustomers: number;
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export interface CouponPerformance {
  label: string;
  revenue: number;
  discount: number;
}

export interface DeliveryPerformance {
  driver: string;
  orders: number;
}

export interface RoastingDistribution {
  name: string;
  value: number;
  color: string;
}

export interface GrindingDistribution {
  name: string;
  value: number;
  color: string;
}

export interface EODSession {
  id: string;
  date: string;
  openedBy: string;
  closedBy: string;
  revenue: string;
  cash: string;
  card: string;
  status: EODStatus;
}

export interface DataExportItem {
  id: string;
  label: string;
  format: string;
  icon: string;
}

// ---- Employee ----
export interface EmployeeStats {
  totalEmployees: number;
  totalOrders: number;
  totalRevenue: string;
  totalWorkingHours: string;
}

export interface EmployeeRevenueShare {
  name: string;
  value: number;
  color: string;
}

export interface EmployeeRequestCount {
  name: string;
  orders: number;
  color: string;
}

export interface EmployeeReport {
  id: number;
  name: string;
  email: string;
  role: string;
  roleColor: string;
  orders: number;
  cashierOrders: number;
  appOrders: number;
  revenue: number;
  avgOrder: number;
  workingHrs: string;
  topProduct: string;
  topProductItems: number;
  revenuePercent: string;
  status: EmployeeStatus;
}

export interface ShiftDetail {
  id: string;
  customer: string;
  shiftStart: string;
  shiftEnd: string;
  duration: string;
  orders: number;
  revenue: number;
  status: ShiftStatus;
}

// ---- Branch ----
export interface BranchStats {
  numberOfRegions: number;
  totalOrders: number;
  totalRevenue: string;
  highestRevenueRegion: string;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
}

export interface RegionDistribution {
  name: string;
  value: number;
  color: string;
}

export interface BranchReport {
  id: number;
  region: string;
  orders: number;
  cashierOrders: number;
  appOrders: number;
  totalRevenue: string;
  avgOrder: string;
  percentOfTotal: string;
}