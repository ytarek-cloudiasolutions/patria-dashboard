import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DashboardState,
  DashboardLoadingState,
  DashboardErrorState,
  DashboardOperation,
  DashboardOverview,
  DashboardOverviewParams,
} from "./dashboardTypes";

const initialLoading: DashboardLoadingState = {
  fetch: false,
};

const initialErrors: DashboardErrorState = {
  fetch: null,
};

const initialState: DashboardState = {
  overview: null,
  loading: initialLoading,
  errors: initialErrors,
};

const setOperationLoading = (
  state: DashboardState,
  operation: DashboardOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
};

const setOperationFailure = (
  state: DashboardState,
  operation: DashboardOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    getDashboardOverviewRequest: (
      state,
      _action: PayloadAction<DashboardOverviewParams | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getDashboardOverviewSuccess: (
      state,
      action: PayloadAction<DashboardOverview>,
    ) => {
      state.loading.fetch = false;
      state.overview = action.payload;
    },
    getDashboardOverviewFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },
  },
});

export const dashboardActions = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;
