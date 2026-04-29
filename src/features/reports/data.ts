import type {
  OverviewStats,
  DailyRevenuePoint,
  TopProduct,
  CouponPerformance,
  DeliveryPerformance,
  RoastingDistribution,
  GrindingDistribution,
  EODSession,
  EmployeeStats,
  EmployeeRevenueShare,
  EmployeeRequestCount,
  EmployeeReport,
  ShiftDetail,
  BranchStats,
  RegionRevenue,
  RegionDistribution,
  BranchReport,
} from "./types";

export const OVERVIEW_STATS: OverviewStats = {
  totalRevenue: "EGP 3,337",
  averageDemand: "EGP 169.70",
  numberOfOrders: 21,
  numberOfCustomers: 4,
};

export const DAILY_REVENUE: DailyRevenuePoint[] = [
  { date: "2026-04-06", revenue: 280 },
  { date: "2026-04-08", revenue: 320 },
  { date: "2026-04-09", revenue: 300 },
  { date: "2026-04-11", revenue: 340 },
  { date: "2026-04-13", revenue: 360 },
  { date: "2026-04-14", revenue: 420 },
  { date: "2026-04-15", revenue: 680 },
  { date: "2026-04-17", revenue: 750 },
  { date: "2026-04-18", revenue: 900 },
  { date: "2026-04-19", revenue: 1300 },
  { date: "2026-04-20", revenue: 80 },
];

export const TOP_PRODUCTS: TopProduct[] = [
  { name: "ArtisanalSourdough", quantity: 21 },
  { name: "Tomatoes", quantity: 13 },
  { name: "Coffee Test", quantity: 15 },
  { name: "Eish elSaraya", quantity: 7 },
  { name: "MiddleEasternRoast Beef", quantity: 16 },
];

export const COUPON_PERFORMANCE: CouponPerformance[] = [
  { label: "Revenue", revenue: 1300, discount: 0 },
  { label: "Discount", revenue: 0, discount: 600 },
];

export const DELIVERY_PERFORMANCE: DeliveryPerformance[] = [
  { driver: "Kareem Nabil", orders: 21 },
  { driver: "Mohamed Fouad", orders: 12 },
  { driver: "Abdelrahman Ali", orders: 14 },
  { driver: "Mostafa Mamoud", orders: 8 },
  { driver: "Ashraf Osama", orders: 18 },
];

export const ROASTING_DISTRIBUTION: RoastingDistribution[] = [
  { name: "Dark", value: 45, color: "#5C4A0E" },
  { name: "Medium", value: 35, color: "#7A6518" },
  { name: "Light", value: 20, color: "#F5E6C0" },
];

export const GRINDING_DISTRIBUTION: GrindingDistribution[] = [
  { name: "Whole Bean", value: 60, color: "#5C4A0E" },
  { name: "Espresso", value: 40, color: "#3D5C1A" },
];

export const EOD_SESSIONS: EODSession[] = [
  {
    id: "1",
    date: "4/14/2026",
    openedBy: "Super Admin",
    closedBy: "-",
    revenue: "EGP 3250",
    cash: "EGP 3250",
    card: "EGP 3250",
    status: "Open",
  },
  {
    id: "2",
    date: "4/14/2026",
    openedBy: "Super Admin",
    closedBy: "Super Admin",
    revenue: "EGP 3250",
    cash: "EGP 3250",
    card: "EGP 3250",
    status: "Closed",
  },
];

// ---- Employee ----
export const EMPLOYEE_STATS: EmployeeStats = {
  totalEmployees: 3,
  totalOrders: 4,
  totalRevenue: "EGP 169.70",
  totalWorkingHours: "Kafr Abdo",
};

export const EMPLOYEE_REVENUE_SHARES: EmployeeRevenueShare[] = [
  { name: "Super Admin", value: 60, color: "#5C4A0E" },
  { name: "Manager 01", value: 25, color: "#7A6518" },
  { name: "Manager 02", value: 15, color: "#F5E6C0" },
];

export const EMPLOYEE_REQUEST_COUNTS: EmployeeRequestCount[] = [
  { name: "Super Admin", orders: 4, color: "#5C4A0E" },
  { name: "Manager 01", orders: 2, color: "#7A6518" },
  { name: "Manager 02", orders: 0, color: "#F5E6C0" },
];

export const EMPLOYEE_REPORTS: EmployeeReport[] = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@erb.com",
    role: "Admin",
    roleColor: "bg-[#E8F5EE] text-[#1A7A45]",
    orders: 4,
    cashierOrders: 0,
    appOrders: 4,
    revenue: 10000,
    avgOrder: 169,
    workingHrs: "4.5 HRS",
    topProduct: "Artisanal Sourdough",
    topProductItems: 5,
    revenuePercent: "100%",
    status: "Open",
  },
  {
    id: 2,
    name: "Manager",
    email: "manager@erb.com",
    role: "Manager",
    roleColor: "bg-[#FFF5DC] text-[#B56C00]",
    orders: 12,
    cashierOrders: 8,
    appOrders: 4,
    revenue: 25000,
    avgOrder: 186,
    workingHrs: "12 HRS",
    topProduct: "Brazilian Coffee",
    topProductItems: 5,
    revenuePercent: "100%",
    status: "Closed",
  },
];

export const SHIFT_DETAILS: ShiftDetail[] = [
  {
    id: "1",
    customer: "Super Admin",
    shiftStart: "31/3/2026, 2:37:57 PM",
    shiftEnd: "31/3/2026, 2:37:57 PM",
    duration: "12 HRS",
    orders: 12,
    revenue: 25000,
    status: "Finished",
  },
];

// ---- Branch ----
export const BRANCH_STATS: BranchStats = {
  numberOfRegions: 7,
  totalOrders: 23,
  totalRevenue: "EGP 3,906.8",
  highestRevenueRegion: "12 Hours",
};

export const REGION_REVENUES: RegionRevenue[] = [
  { region: "Kafr Abdo", revenue: 2200 },
  { region: "Cashier/POS", revenue: 1100 },
  { region: "Gleem", revenue: 150 },
  { region: "Moharam Bek", revenue: 200 },
  { region: "Roushdy", revenue: 200 },
  { region: "Semouha", revenue: 900 },
  { region: "Sidi Gaber", revenue: 120 },
];

export const REGION_DISTRIBUTION: RegionDistribution[] = [
  { name: "Kafr Abdo", value: 10, color: "#5C4A0E" },
  { name: "Cashier/POS", value: 8, color: "#8B8000" },
  { name: "Moharam Bek", value: 3, color: "#6A5ACD" },
  { name: "Semouha", value: 3, color: "#DC143C" },
  { name: "Roushdy", value: 3, color: "#DA70D6" },
  { name: "Sidi Gaber", value: 3, color: "#1E90FF" },
  { name: "Gleem", value: 2, color: "#2E8B57" },
];

export const BRANCH_REPORTS: BranchReport[] = [
  {
    id: 1,
    region: "Kafr Abdo",
    orders: 10,
    cashierOrders: 8,
    appOrders: 2,
    totalRevenue: "EGP 2,1552.2",
    avgOrder: "EGP 216",
    percentOfTotal: "55.2%",
  },
  {
    id: 2,
    region: "Cashier/POS",
    orders: 8,
    cashierOrders: 0,
    appOrders: 8,
    totalRevenue: "EGP 1,15.2",
    avgOrder: "EGP 144",
    percentOfTotal: "29.5%",
  },
  {
    id: 3,
    region: "Gleem",
    orders: 1,
    cashierOrders: 0,
    appOrders: 1,
    totalRevenue: "EGP 177",
    avgOrder: "EGP 177",
    percentOfTotal: "4.5%",
  },
  {
    id: 4,
    region: "Moharam Bek",
    orders: 1,
    cashierOrders: 0,
    appOrders: 1,
    totalRevenue: "EGP 142.2",
    avgOrder: "EGP 142",
    percentOfTotal: "3.6%",
  },
  {
    id: 5,
    region: "Roushdy",
    orders: 1,
    cashierOrders: 0,
    appOrders: 1,
    totalRevenue: "EGP 142.2",
    avgOrder: "EGP 142",
    percentOfTotal: "3.6%",
  },
  {
    id: 6,
    region: "Semouha",
    orders: 1,
    cashierOrders: 0,
    appOrders: 1,
    totalRevenue: "EGP 69",
    avgOrder: "EGP 69",
    percentOfTotal: "1.8%",
  },
  {
    id: 7,
    region: "Sidi Gaber",
    orders: 1,
    cashierOrders: 0,
    appOrders: 1,
    totalRevenue: "EGP 67",
    avgOrder: "EGP 67",
    percentOfTotal: "1.8%",
  },
];
