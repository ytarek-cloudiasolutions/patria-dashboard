import { api } from "@/config/api";

export interface DashboardOverviewParams {
  from?: string;
  to?: string;
  branchId?: string;
}

export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  totalDiscounts: number;
  totalItemsOrdered: number;
  totalTax: number;
  totalDelivery: number;
}

export interface DailyRevenueEntry {
  _id: string;
  revenue: number;
  orders: number;
}

export interface TopProductEntry {
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardOverviewData {
  summary: DashboardSummary;
  dailyRevenue: DailyRevenueEntry[];
  topProducts: TopProductEntry[];
  paymentBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

export type GetDashboardOverviewResponse = DashboardOverviewData;

export const getDashboardOverview = async (
  params?: DashboardOverviewParams,
): Promise<GetDashboardOverviewResponse> => {
  const response = await api.get<GetDashboardOverviewResponse>(
    "/reports/overview",
    { params },
  );
  return response.data;
};

export const dashboardApi = {
  getDashboardOverview,
};

export default dashboardApi;
