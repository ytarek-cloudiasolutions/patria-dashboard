import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { dashboardApi } from "../api/dashboardApi";
import { dashboardActions } from "./dashboardSlice";
import { showErrorToast } from "@/shared/utils/toast";
import type {
  DashboardOverviewParams,
  DashboardOverview,
} from "./dashboardTypes";


const getDashboardErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

function* handleGetDashboardOverview(
  action: PayloadAction<DashboardOverviewParams | undefined>,
) {
  try {
    const overview: DashboardOverview = yield call(
      dashboardApi.getDashboardOverview,
      action.payload,
    );
    yield put(dashboardActions.getDashboardOverviewSuccess(overview));
  } catch (error) {
    const errorMsg = getDashboardErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(dashboardActions.getDashboardOverviewFailure(errorMsg));
  }
}

export function* dashboardSaga() {
  yield all([
    takeLatest(
      dashboardActions.getDashboardOverviewRequest.type,
      handleGetDashboardOverview,
    ),
  ]);
}

export default dashboardSaga;
