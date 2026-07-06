import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dashboardActions } from "../store/dashboardSlice";
import {
  selectDashboardOverview,
  selectDashboardLoading,
  selectDashboardErrors,
} from "../store/dashboardSelectors";
import type { DashboardOverviewParams } from "../store/dashboardTypes";

export const useDashboard = () => {
  const dispatch = useDispatch();

  const overview = useSelector(selectDashboardOverview);
  const loading = useSelector(selectDashboardLoading);
  const errors = useSelector(selectDashboardErrors);

  const getDashboardData = useCallback(
    (params?: DashboardOverviewParams) => {
      dispatch(dashboardActions.getDashboardOverviewRequest(params));
    },
    [dispatch],
  );

  return {
    // overview contains summary, dailyRevenue, topProducts, paymentBreakdown, typeBreakdown
    overview,
    getDashboardData,
    loading: loading.fetch,
    error: errors.fetch,
  };
};

export default useDashboard;
