import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { inventoryApi } from "../api/inventoryApi";
import { inventoryActions } from "./inventorySlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetInventoryResponse,
  GetShortagesResponse,
  UpdateStockRequest,
  BulkUpdateStockRequest,
} from "./inventoryTypes";

const getInventoryErrorMessage = (error: unknown): string => {
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

function* handleGetInventory() {
  try {
    const response: GetInventoryResponse = yield call(inventoryApi.getInventory);
    yield put(
      inventoryActions.getInventorySuccess({
        products: response.products || [],
        stats: response.stats,
      }),
    );
  } catch (error) {
    const errorMsg = getInventoryErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(inventoryActions.getInventoryFailure(errorMsg));
  }
}

function* handleGetShortages() {
  try {
    const response: GetShortagesResponse = yield call(inventoryApi.getShortages);
    yield put(inventoryActions.getShortagesSuccess(response.shortages || []));
  } catch (error) {
    const errorMsg = getInventoryErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(inventoryActions.getShortagesFailure(errorMsg));
  }
}

function* handleSyncInventory() {
  try {
    const response: { message: string; updated: number } = yield call(
      inventoryApi.synchronizeInventory,
    );
    yield call(showSuccessToast, response.message || "Inventory synchronized successfully");
    yield put(inventoryActions.syncInventorySuccess(response));
    // Reload lists to show updated stocks
    yield put(inventoryActions.getInventoryRequest());
    yield put(inventoryActions.getShortagesRequest());
  } catch (error) {
    const errorMsg = getInventoryErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(inventoryActions.syncInventoryFailure(errorMsg));
  }
}

function* handleUpdateStock(
  action: PayloadAction<{ id: string; data: UpdateStockRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { message: string } = yield call(inventoryApi.updateStock, id, data);
    yield call(showSuccessToast, response.message || "Stock level updated");
    yield put(inventoryActions.updateStockSuccess(response.message));
    // Reload lists to show updated stocks
    yield put(inventoryActions.getInventoryRequest());
    yield put(inventoryActions.getShortagesRequest());
  } catch (error) {
    const errorMsg = getInventoryErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(inventoryActions.updateStockFailure(errorMsg));
  }
}

function* handleBulkUpdateStock(action: PayloadAction<BulkUpdateStockRequest>) {
  try {
    const response: { message: string } = yield call(
      inventoryApi.bulkUpdateStock,
      action.payload,
    );
    yield call(showSuccessToast, response.message || "Bulk stock update successful");
    yield put(inventoryActions.bulkUpdateStockSuccess(response.message));
    // Reload lists to show updated stocks
    yield put(inventoryActions.getInventoryRequest());
    yield put(inventoryActions.getShortagesRequest());
  } catch (error) {
    const errorMsg = getInventoryErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(inventoryActions.bulkUpdateStockFailure(errorMsg));
  }
}

export function* inventorySaga() {
  yield all([
    takeLatest(inventoryActions.getInventoryRequest.type, handleGetInventory),
    takeLatest(inventoryActions.getShortagesRequest.type, handleGetShortages),
    takeLatest(inventoryActions.syncInventoryRequest.type, handleSyncInventory),
    takeLatest(inventoryActions.updateStockRequest.type, handleUpdateStock),
    takeLatest(inventoryActions.bulkUpdateStockRequest.type, handleBulkUpdateStock),
  ]);
}
