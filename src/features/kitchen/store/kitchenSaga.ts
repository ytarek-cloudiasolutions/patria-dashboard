import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { kitchenApi } from "../api/kitchenApi";
import { kitchenActions } from "./kitchenSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetKitchenOrdersResponse,
  UpdateKitchenOrderStatusRequest,
  UpdateKitchenOrderStatusResponse,
} from "./kitchenTypes";

const getKitchenErrorMessage = (error: unknown): string => {
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

function* handleGetKitchenOrders(action: PayloadAction<{ kitchenType?: string } | undefined>) {
  try {
    const kitchenType = action.payload?.kitchenType;
    const response: GetKitchenOrdersResponse = yield call(
      kitchenApi.getKitchenOrders,
      kitchenType,
    );
    yield put(kitchenActions.getKitchenOrdersSuccess(response));
  } catch (error) {
    const errorMsg = getKitchenErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(kitchenActions.getKitchenOrdersFailure(errorMsg));
  }
}

function* handleUpdateKitchenOrderStatus(
  action: PayloadAction<{ id: string; data: UpdateKitchenOrderStatusRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: UpdateKitchenOrderStatusResponse = yield call(
      kitchenApi.updateKitchenOrderStatus,
      id,
      data,
    );
    yield call(showSuccessToast, "Order status updated");
    yield put(
      kitchenActions.updateKitchenOrderStatusSuccess({
        order: response.order,
        message: "Order status updated",
      }),
    );
  } catch (error) {
    const errorMsg = getKitchenErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(kitchenActions.updateKitchenOrderStatusFailure(errorMsg));
  }
}

export function* kitchenSaga() {
  yield all([
    takeLatest(
      kitchenActions.getKitchenOrdersRequest.type,
      handleGetKitchenOrders,
    ),
    takeLatest(
      kitchenActions.updateKitchenOrderStatusRequest.type,
      handleUpdateKitchenOrderStatus,
    ),
  ]);
}

export default kitchenSaga;
