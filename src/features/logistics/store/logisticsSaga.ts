import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { logisticsApi } from "../api/logisticsApi";
import { logisticsActions } from "./logisticsSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetDriversResponse,
  CreateDriverRequest,
  UpdateDriverRequest,
} from "./logisticsTypes";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

function* handleGetDrivers() {
  try {
    const response: GetDriversResponse = yield call(logisticsApi.getDrivers);
    yield put(logisticsActions.getDriversSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(logisticsActions.getDriversFailure(msg));
  }
}

function* handleCreateDriver(action: PayloadAction<CreateDriverRequest>) {
  try {
    const response: { driver: import("./logisticsTypes").Driver } = yield call(
      logisticsApi.createDriver,
      action.payload,
    );
    yield call(showSuccessToast, "Driver created successfully");
    yield put(
      logisticsActions.createDriverSuccess({
        driver: response.driver,
        message: "Driver created successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(logisticsActions.createDriverFailure(msg));
  }
}

function* handleUpdateDriver(
  action: PayloadAction<{ id: string; data: UpdateDriverRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { driver: import("./logisticsTypes").Driver } = yield call(
      logisticsApi.updateDriver,
      id,
      data,
    );
    yield call(showSuccessToast, "Driver updated successfully");
    yield put(
      logisticsActions.updateDriverSuccess({
        driver: response.driver,
        message: "Driver updated successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(logisticsActions.updateDriverFailure(msg));
  }
}

function* handleDeleteDriver(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      logisticsApi.deleteDriver,
      id,
    );
    const message = response.message ?? "Driver removed";
    yield call(showSuccessToast, message);
    yield put(logisticsActions.deleteDriverSuccess({ id, message }));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(logisticsActions.deleteDriverFailure(msg));
  }
}

export function* logisticsSaga() {
  yield all([
    takeLatest(logisticsActions.getDriversRequest.type, handleGetDrivers),
    takeLatest(logisticsActions.createDriverRequest.type, handleCreateDriver),
    takeLatest(logisticsActions.updateDriverRequest.type, handleUpdateDriver),
    takeLatest(logisticsActions.deleteDriverRequest.type, handleDeleteDriver),
  ]);
}

export default logisticsSaga;
