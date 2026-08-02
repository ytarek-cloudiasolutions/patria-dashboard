import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { financialApi } from "../api/financialApi";
import { financialActions } from "./financialSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  FinancialOverviewResponse,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
} from "./financialTypes";

const getFinancialErrorMessage = (error: unknown): string => {
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

function* handleGetFinancialOverview() {
  try {
    const response: FinancialOverviewResponse = yield call(
      financialApi.getFinancialOverview,
    );
    yield put(financialActions.getFinancialOverviewSuccess(response));
  } catch (error) {
    const errorMsg = getFinancialErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(financialActions.getFinancialOverviewFailure(errorMsg));
  }
}

function* handleGetTransactions() {
  try {
    const response: GetTransactionsResponse = yield call(
      financialApi.getTransactions,
    );
    yield put(financialActions.getTransactionsSuccess(response));
  } catch (error) {
    const errorMsg = getFinancialErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(financialActions.getTransactionsFailure(errorMsg));
  }
}

function* handleCreateTransaction(
  action: PayloadAction<CreateTransactionRequest>,
) {
  try {
    const response: CreateTransactionResponse = yield call(
      financialApi.createTransaction,
      action.payload,
    );
    yield call(showSuccessToast, "Transaction added successfully");
    yield put(
      financialActions.createTransactionSuccess({
        transaction: response.transaction,
        message: "Transaction added successfully",
      }),
    );
    // Refresh overview after creating a transaction
    yield put(financialActions.getFinancialOverviewRequest());
  } catch (error) {
    const errorMsg = getFinancialErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(financialActions.createTransactionFailure(errorMsg));
  }
}

export function* financialSaga() {
  yield all([
    takeLatest(
      financialActions.getFinancialOverviewRequest.type,
      handleGetFinancialOverview,
    ),
    takeLatest(
      financialActions.getTransactionsRequest.type,
      handleGetTransactions,
    ),
    takeLatest(
      financialActions.createTransactionRequest.type,
      handleCreateTransaction,
    ),
  ]);
}

export default financialSaga;
