import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { notificationsApi } from "../api/notificationsApi";
import { notificationsActions } from "./notificationsSlice";
import { showErrorToast } from "@/shared/utils/toast";
import type {
  GetNotificationsResponse,
  MarkAsReadResponse,
} from "./notificationsTypes";

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

function* handleGetNotifications() {
  try {
    const response: GetNotificationsResponse = yield call(
      notificationsApi.getNotifications,
    );
    yield put(notificationsActions.getNotificationsSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(notificationsActions.getNotificationsFailure(msg));
  }
}

function* handleMarkAsRead(action: PayloadAction<{ id: string }>) {
  try {
    const response: MarkAsReadResponse = yield call(
      notificationsApi.markNotificationAsRead,
      action.payload.id,
    );
    yield put(
      notificationsActions.markAsReadSuccess({
        notification: response.notification,
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(notificationsActions.markAsReadFailure(msg));
  }
}

export function* notificationsSaga() {
  yield all([
    takeLatest(
      notificationsActions.getNotificationsRequest.type,
      handleGetNotifications,
    ),
    // takeEvery so each mark-as-read fires independently
    takeEvery(notificationsActions.markAsReadRequest.type, handleMarkAsRead),
  ]);
}
export default notificationsSaga;
