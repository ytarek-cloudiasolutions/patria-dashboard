import type {
  DashboardSummary,
  DailyRevenueEntry,
  TopProductEntry,
  DashboardOverviewParams,
} from "../api/dashboardApi";

export type { DashboardSummary, DailyRevenueEntry, TopProductEntry };

export interface DashboardOverview {
  summary: DashboardSummary;
  dailyRevenue: DailyRevenueEntry[];
  topProducts: TopProductEntry[];
  paymentBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

export type { DashboardOverviewParams };

export type DashboardOperation = "fetch";

export interface DashboardLoadingState {
  fetch: boolean;
}

export interface DashboardErrorState {
  fetch: string | null;
}

export interface DashboardState {
  overview: DashboardOverview | null;
  loading: DashboardLoadingState;
  errors: DashboardErrorState;
}
