import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { supplierApi } from "../api/supplierApi";
import { supplierActions } from "./supplierSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetSuppliersResponse,
  CreateSupplierRequest,
} from "./supplierTypes";

const getSupplierErrorMessage = (error: unknown): string => {
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

function* handleGetSuppliers(
  action: PayloadAction<{ page?: number; limit?: number } | undefined>,
) {
  try {
    const response: GetSuppliersResponse = yield call(
      supplierApi.getSuppliers,
      action.payload,
    );
    yield put(supplierActions.getSuppliersSuccess(response));
  } catch (error) {
    const errorMsg = getSupplierErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(supplierActions.getSuppliersFailure(errorMsg));
  }
}

function* handleCreateSupplier(
  action: PayloadAction<CreateSupplierRequest>,
) {
  try {
    const response: { supplier: any } = yield call(
      supplierApi.createSupplier,
      action.payload,
    );
    yield call(showSuccessToast, "Supplier created successfully");
    yield put(
      supplierActions.createSupplierSuccess({
        supplier: response.supplier,
      }),
    );
    yield put(supplierActions.getSuppliersRequest());
  } catch (error) {
    const errorMsg = getSupplierErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(supplierActions.createSupplierFailure(errorMsg));
  }
}

function* handleUpdateSupplier(
  action: PayloadAction<{ id: string; data: Partial<CreateSupplierRequest> }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { supplier: any } = yield call(
      supplierApi.updateSupplier,
      id,
      data,
    );
    yield call(showSuccessToast, "Supplier updated successfully");
    yield put(
      supplierActions.updateSupplierSuccess({
        supplier: response.supplier,
      }),
    );
    yield put(supplierActions.getSuppliersRequest());
  } catch (error) {
    const errorMsg = getSupplierErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(supplierActions.updateSupplierFailure(errorMsg));
  }
}

function* handleDeleteSupplier(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      supplierApi.deleteSupplier,
      id,
    );
    yield call(showSuccessToast, response.message || "Supplier deleted");
    yield put(
      supplierActions.deleteSupplierSuccess({
        id,
        message: response.message || "Supplier deleted",
      }),
    );
  } catch (error) {
    const errorMsg = getSupplierErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(supplierActions.deleteSupplierFailure(errorMsg));
  }
}

export function* suppliersSaga() {
  yield all([
    takeLatest(
      supplierActions.getSuppliersRequest.type,
      handleGetSuppliers,
    ),
    takeLatest(
      supplierActions.createSupplierRequest.type,
      handleCreateSupplier,
    ),
    takeLatest(
      supplierActions.updateSupplierRequest.type,
      handleUpdateSupplier,
    ),
    takeLatest(
      supplierActions.deleteSupplierRequest.type,
      handleDeleteSupplier,
    ),
  ]);
}
export default suppliersSaga;
