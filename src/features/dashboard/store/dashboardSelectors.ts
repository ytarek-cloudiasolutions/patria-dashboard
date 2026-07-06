import type { RootState } from "@/app/store";
import type { DashboardState, DashboardOperation } from "./dashboardTypes";

// Cast to any because `dashboard` is registered in rootReducer separately.
const selectDashboard = (state: RootState): DashboardState =>
  (state as unknown as { dashboard: DashboardState }).dashboard;

export const selectDashboardOverview = (state: RootState) =>
  selectDashboard(state).overview;

export const selectDashboardSummary = (state: RootState) =>
  selectDashboard(state).overview?.summary ?? null;

export const selectDashboardDailyRevenue = (state: RootState) =>
  selectDashboard(state).overview?.dailyRevenue ?? [];

export const selectDashboardTopProducts = (state: RootState) =>
  selectDashboard(state).overview?.topProducts ?? [];

export const selectDashboardPaymentBreakdown = (state: RootState) =>
  selectDashboard(state).overview?.paymentBreakdown ?? {};

export const selectDashboardTypeBreakdown = (state: RootState) =>
  selectDashboard(state).overview?.typeBreakdown ?? {};

export const selectDashboardLoading = (state: RootState) =>
  selectDashboard(state).loading;

export const selectDashboardErrors = (state: RootState) =>
  selectDashboard(state).errors;

export const selectIsDashboardOperationLoading =
  (operation: DashboardOperation) =>
  (state: RootState): boolean =>
    selectDashboard(state).loading[operation];

export const selectDashboardOperationError =
  (operation: DashboardOperation) =>
  (state: RootState): string | null =>
    selectDashboard(state).errors[operation];
