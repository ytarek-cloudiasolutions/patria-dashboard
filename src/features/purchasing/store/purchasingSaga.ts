import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { purchasingApi } from "../api/purchasingApi";
import { purchasingActions } from "./purchasingSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetPurchaseOrdersRequest,
  GetPurchaseOrdersResponse,
  CreatePurchaseOrderRequest,
  PurchaseOrderActionResponse,
  CreatePurchaseOrderResponse,
} from "./purchasingTypes";

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

function* handleGetPurchaseOrders(
  action: PayloadAction<GetPurchaseOrdersRequest | undefined>,
) {
  try {
    const response: GetPurchaseOrdersResponse = yield call(
      purchasingApi.getPurchaseOrders,
      action.payload,
    );
    yield put(purchasingActions.getPurchaseOrdersSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(purchasingActions.getPurchaseOrdersFailure(msg));
  }
}

const extractPurchaseOrder = (response: any) =>
  response?.purchaseOrder ??
  response?.data?.purchaseOrder ??
  response?.data ??
  (response?._id ? response : undefined);

function* handleCreatePurchaseOrder(
  action: PayloadAction<CreatePurchaseOrderRequest>,
) {
  try {
    const response: CreatePurchaseOrderResponse = yield call(
      purchasingApi.createPurchaseOrder,
      action.payload,
    );
    const createdPo = extractPurchaseOrder(response);
    yield call(
      showSuccessToast,
      (response as any)?.message || "Purchase order created successfully",
    );
    yield put(
      purchasingActions.createPurchaseOrderSuccess({
        purchaseOrder: createdPo,
        message: "Purchase order created successfully",
      }),
    );
    yield put(purchasingActions.getPurchaseOrdersRequest());
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(purchasingActions.createPurchaseOrderFailure(msg));
  }
}

function* handleSubmitPurchaseOrder(action: PayloadAction<{ id: string }>) {
  try {
    const response: PurchaseOrderActionResponse = yield call(
      purchasingApi.submitPurchaseOrder,
      action.payload.id,
    );
    const updatedPo = extractPurchaseOrder(response);
    yield call(
      showSuccessToast,
      (response as any)?.message || "Purchase order submitted",
    );
    if (updatedPo) {
      yield put(
        purchasingActions.submitPurchaseOrderSuccess({
          purchaseOrder: updatedPo,
          message: "Purchase order submitted",
        }),
      );
    }
    yield put(purchasingActions.getPurchaseOrdersRequest());
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(purchasingActions.submitPurchaseOrderFailure(msg));
  }
}

function* handleCancelPurchaseOrder(action: PayloadAction<{ id: string }>) {
  try {
    const response: PurchaseOrderActionResponse = yield call(
      purchasingApi.cancelPurchaseOrder,
      action.payload.id,
    );
    const updatedPo = extractPurchaseOrder(response);
    yield call(
      showSuccessToast,
      (response as any)?.message || "Purchase order cancelled",
    );
    if (updatedPo) {
      yield put(
        purchasingActions.cancelPurchaseOrderSuccess({
          purchaseOrder: updatedPo,
          message: "Purchase order cancelled",
        }),
      );
    }
    yield put(purchasingActions.getPurchaseOrdersRequest());
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(purchasingActions.cancelPurchaseOrderFailure(msg));
  }
}

export function* purchasingSaga() {
  yield all([
    takeLatest(
      purchasingActions.getPurchaseOrdersRequest.type,
      handleGetPurchaseOrders,
    ),
    takeLatest(
      purchasingActions.createPurchaseOrderRequest.type,
      handleCreatePurchaseOrder,
    ),
    takeLatest(
      purchasingActions.submitPurchaseOrderRequest.type,
      handleSubmitPurchaseOrder,
    ),
    takeLatest(
      purchasingActions.cancelPurchaseOrderRequest.type,
      handleCancelPurchaseOrder,
    ),
  ]);
}
export default purchasingSaga;
