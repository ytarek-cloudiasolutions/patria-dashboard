import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { customersApi } from "../api/customersApi";
import { customersActions } from "./customersSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetCustomersRequest,
  GetCustomersResponse,
  CustomerStats,
  UpdateCustomerRequest,
} from "./customerTypes";

const getCustomerErrorMessage = (error: unknown): string => {
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

function* handleGetCustomers(action: PayloadAction<GetCustomersRequest | undefined>) {
  try {
    const response: GetCustomersResponse = yield call(customersApi.getCustomers, action.payload);
    yield put(customersActions.getCustomersSuccess(response));
  } catch (error) {
    const errorMsg = getCustomerErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(customersActions.getCustomersFailure(errorMsg));
  }
}

function* handleGetCustomerStats() {
  try {
    const response: { stats: CustomerStats } = yield call(customersApi.getCustomerStats);
    yield put(customersActions.getCustomerStatsSuccess(response));
  } catch (error) {
    const errorMsg = getCustomerErrorMessage(error);
    yield put(customersActions.getCustomerStatsFailure(errorMsg));
  }
}

function* handleUpdateCustomer(
  action: PayloadAction<{ id: string; data: UpdateCustomerRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: unknown = yield call(customersApi.updateCustomer, id, data);
    yield call(showSuccessToast, "Customer updated successfully");
    yield put(
      customersActions.updateCustomerSuccess({
        customer: response,
        message: "Customer updated successfully",
      }),
    );
    // Reload customers list and stats
    yield put(customersActions.getCustomersRequest());
    yield put(customersActions.getCustomerStatsRequest());
  } catch (error) {
    const errorMsg = getCustomerErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(customersActions.updateCustomerFailure(errorMsg));
  }
}

function* handleDeleteCustomer(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(customersApi.deleteCustomer, id);
    yield call(showSuccessToast, response.message || "Customer removed");
    yield put(
      customersActions.deleteCustomerSuccess({
        id,
        message: response.message || "Customer removed",
      }),
    );
    // Reload stats
    yield put(customersActions.getCustomerStatsRequest());
  } catch (error) {
    const errorMsg = getCustomerErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(customersActions.deleteCustomerFailure(errorMsg));
  }
}

export function* customersSaga() {
  yield all([
    takeLatest(customersActions.getCustomersRequest.type, handleGetCustomers),
    takeLatest(customersActions.getCustomerStatsRequest.type, handleGetCustomerStats),
    takeLatest(customersActions.updateCustomerRequest.type, handleUpdateCustomer),
    takeLatest(customersActions.deleteCustomerRequest.type, handleDeleteCustomer),
  ]);
}
export default customersSaga;
