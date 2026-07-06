import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { productionApi } from "../api/productionApi";
import { productionActions } from "./productionSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetBatchesResponse,
  CreateBatchRequest,
  CreateBatchResponse,
  UpdateBatchStatusRequest,
  UpdateBatchStatusResponse,
  GetEquipmentResponse,
  CreateEquipmentRequest,
  CreateEquipmentResponse,
  UpdateEquipmentRequest,
  UpdateEquipmentResponse,
} from "./productionTypes";

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

function* handleGetBatches() {
  try {
    const response: GetBatchesResponse = yield call(productionApi.getBatches);
    yield put(productionActions.getBatchesSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(productionActions.getBatchesFailure(msg));
  }
}

function* handleCreateBatch(action: PayloadAction<CreateBatchRequest>) {
  try {
    const response: CreateBatchResponse = yield call(
      productionApi.createBatch,
      action.payload,
    );
    yield call(showSuccessToast, "Batch created successfully");
    yield put(
      productionActions.createBatchSuccess({
        batch: response.batch,
        message: "Batch created successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(productionActions.createBatchFailure(msg));
  }
}

function* handleUpdateBatchStatus(
  action: PayloadAction<{ id: string; data: UpdateBatchStatusRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: UpdateBatchStatusResponse = yield call(
      productionApi.updateBatchStatus,
      id,
      data,
    );
    yield call(showSuccessToast, "Batch status updated");
    yield put(
      productionActions.updateBatchStatusSuccess({
        batch: response.batch,
        message: "Batch status updated",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(productionActions.updateBatchStatusFailure(msg));
  }
}

function* handleGetEquipment() {
  try {
    const response: GetEquipmentResponse = yield call(productionApi.getEquipment);
    yield put(productionActions.getEquipmentSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(productionActions.getEquipmentFailure(msg));
  }
}

function* handleCreateEquipment(action: PayloadAction<CreateEquipmentRequest>) {
  try {
    const response: CreateEquipmentResponse = yield call(
      productionApi.createEquipment,
      action.payload,
    );
    yield call(showSuccessToast, "Equipment added successfully");
    yield put(
      productionActions.createEquipmentSuccess({
        equipment: response.equipment,
        message: "Equipment added successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(productionActions.createEquipmentFailure(msg));
  }
}

function* handleUpdateEquipment(
  action: PayloadAction<{ id: string; data: UpdateEquipmentRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: UpdateEquipmentResponse = yield call(
      productionApi.updateEquipment,
      id,
      data,
    );
    yield call(showSuccessToast, "Equipment updated successfully");
    yield put(
      productionActions.updateEquipmentSuccess({
        equipment: response.equipment,
        message: "Equipment updated successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(productionActions.updateEquipmentFailure(msg));
  }
}

export function* productionSaga() {
  yield all([
    takeLatest(productionActions.getBatchesRequest.type, handleGetBatches),
    takeLatest(productionActions.createBatchRequest.type, handleCreateBatch),
    takeLatest(
      productionActions.updateBatchStatusRequest.type,
      handleUpdateBatchStatus,
    ),
    takeLatest(productionActions.getEquipmentRequest.type, handleGetEquipment),
    takeLatest(
      productionActions.createEquipmentRequest.type,
      handleCreateEquipment,
    ),
    takeLatest(
      productionActions.updateEquipmentRequest.type,
      handleUpdateEquipment,
    ),
  ]);
}
export default productionSaga;
