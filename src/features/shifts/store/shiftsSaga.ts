import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { shiftsApi } from "../api/shiftsApi";
import { shiftsActions } from "./shiftsSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  OpenShiftRequest,
  OpenShiftResponse,
  CloseShiftRequest,
  CloseShiftResponse,
  GetCurrentShiftResponse,
} from "./shiftsTypes";

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

function* handleOpenShift(action: PayloadAction<OpenShiftRequest>) {
  try {
    const response: OpenShiftResponse = yield call(
      shiftsApi.openShift,
      action.payload,
    );
    yield call(showSuccessToast, "Shift opened successfully");
    yield put(
      shiftsActions.openShiftSuccess({
        shift: response.shift,
        message: "Shift opened successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(shiftsActions.openShiftFailure(msg));
  }
}

function* handleCloseShift(action: PayloadAction<CloseShiftRequest>) {
  try {
    const response: CloseShiftResponse = yield call(
      shiftsApi.closeShift,
      action.payload,
    );
    yield call(showSuccessToast, "Shift closed successfully");
    yield put(
      shiftsActions.closeShiftSuccess({
        shift: response.shift,
        message: "Shift closed successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(shiftsActions.closeShiftFailure(msg));
  }
}

function* handleGetCurrentShift(
  action: PayloadAction<{ cashierId: string }>,
) {
  try {
    const response: GetCurrentShiftResponse = yield call(
      shiftsApi.getCurrentShift,
      action.payload.cashierId,
    );
    yield put(
      shiftsActions.getCurrentShiftSuccess({ shift: response.shift }),
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // No active shift — resolve gracefully
      yield put(shiftsActions.getCurrentShiftSuccess({ shift: null }));
      return;
    }
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(shiftsActions.getCurrentShiftFailure(msg));
  }
}

export function* shiftsSaga() {
  yield all([
    takeLatest(shiftsActions.openShiftRequest.type, handleOpenShift),
    takeLatest(shiftsActions.closeShiftRequest.type, handleCloseShift),
    takeLatest(
      shiftsActions.getCurrentShiftRequest.type,
      handleGetCurrentShift,
    ),
  ]);
}
export default shiftsSaga;
