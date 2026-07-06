import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { warehousesApi } from "../api/warehousesApi";
import { warehousesActions } from "./warehousesSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetWarehousesResponse,
  GetTransfersResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateTransferRequest,
  UpdateTransferStatusRequest,
  Warehouse,
  Transfer,
} from "./warehousesTypes";

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

// --- Warehouses ---

function* handleGetWarehouses() {
  try {
    const response: GetWarehousesResponse = yield call(
      warehousesApi.getWarehouses,
    );
    yield put(warehousesActions.getWarehousesSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.getWarehousesFailure(msg));
  }
}

function* handleCreateWarehouse(
  action: PayloadAction<CreateWarehouseRequest>,
) {
  try {
    const response: { warehouse: Warehouse } = yield call(
      warehousesApi.createWarehouse,
      action.payload,
    );
    yield call(showSuccessToast, "Warehouse created successfully");
    yield put(
      warehousesActions.createWarehouseSuccess({
        warehouse: response.warehouse,
        message: "Warehouse created successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.createWarehouseFailure(msg));
  }
}

function* handleUpdateWarehouse(
  action: PayloadAction<{ id: string; data: UpdateWarehouseRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { warehouse: Warehouse } = yield call(
      warehousesApi.updateWarehouse,
      id,
      data,
    );
    yield call(showSuccessToast, "Warehouse updated successfully");
    yield put(
      warehousesActions.updateWarehouseSuccess({
        warehouse: response.warehouse,
        message: "Warehouse updated successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.updateWarehouseFailure(msg));
  }
}

function* handleDeleteWarehouse(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      warehousesApi.deleteWarehouse,
      id,
    );
    const message = response.message ?? "Warehouse removed";
    yield call(showSuccessToast, message);
    yield put(warehousesActions.deleteWarehouseSuccess({ id, message }));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.deleteWarehouseFailure(msg));
  }
}

// --- Transfers ---

function* handleGetTransfers() {
  try {
    const response: GetTransfersResponse = yield call(
      warehousesApi.getTransfers,
    );
    yield put(warehousesActions.getTransfersSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.getTransfersFailure(msg));
  }
}

function* handleCreateTransfer(action: PayloadAction<CreateTransferRequest>) {
  try {
    const response: { transfer: Transfer } = yield call(
      warehousesApi.createTransfer,
      action.payload,
    );
    yield call(showSuccessToast, "Transfer created successfully");
    yield put(
      warehousesActions.createTransferSuccess({
        transfer: response.transfer,
        message: "Transfer created successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.createTransferFailure(msg));
  }
}

function* handleUpdateTransferStatus(
  action: PayloadAction<{ id: string; data: UpdateTransferStatusRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { transfer: Transfer } = yield call(
      warehousesApi.updateTransferStatus,
      id,
      data,
    );
    const message = `Transfer ${data.status}`;
    yield call(showSuccessToast, message);
    yield put(
      warehousesActions.updateTransferStatusSuccess({
        transfer: response.transfer,
        message,
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(warehousesActions.updateTransferStatusFailure(msg));
  }
}

export function* warehousesSaga() {
  yield all([
    takeLatest(
      warehousesActions.getWarehousesRequest.type,
      handleGetWarehouses,
    ),
    takeLatest(
      warehousesActions.createWarehouseRequest.type,
      handleCreateWarehouse,
    ),
    takeLatest(
      warehousesActions.updateWarehouseRequest.type,
      handleUpdateWarehouse,
    ),
    takeLatest(
      warehousesActions.deleteWarehouseRequest.type,
      handleDeleteWarehouse,
    ),
    takeLatest(
      warehousesActions.getTransfersRequest.type,
      handleGetTransfers,
    ),
    takeLatest(
      warehousesActions.createTransferRequest.type,
      handleCreateTransfer,
    ),
    takeLatest(
      warehousesActions.updateTransferStatusRequest.type,
      handleUpdateTransferStatus,
    ),
  ]);
}

export default warehousesSaga;
