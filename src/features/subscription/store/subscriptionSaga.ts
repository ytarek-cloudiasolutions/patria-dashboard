import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { subscriptionApi } from "../api/subscriptionApi";
import { subscriptionActions } from "./subscriptionSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetSubscriptionsRequest,
  GetSubscriptionsResponse,
  CreateSubscriptionRequest,
  SubscriptionStats,
} from "./subscriptionTypes";

const getSubscriptionErrorMessage = (error: unknown): string => {
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

function* handleGetSubscriptions(
  action: PayloadAction<GetSubscriptionsRequest | undefined>,
) {
  try {
    const response: GetSubscriptionsResponse = yield call(
      subscriptionApi.getSubscriptions,
      action.payload,
    );
    yield put(subscriptionActions.getSubscriptionsSuccess(response));
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(subscriptionActions.getSubscriptionsFailure(errorMsg));
  }
}

function* handleGetSubscriptionStats() {
  try {
    const response: { stats: SubscriptionStats } = yield call(
      subscriptionApi.getSubscriptionStats,
    );
    yield put(subscriptionActions.getSubscriptionStatsSuccess(response));
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield put(subscriptionActions.getSubscriptionStatsFailure(errorMsg));
  }
}

function* handleCreateSubscription(
  action: PayloadAction<CreateSubscriptionRequest>,
) {
  try {
    const response: { subscription: any } = yield call(
      subscriptionApi.createSubscription,
      action.payload,
    );
    yield call(showSuccessToast, "Subscription created successfully");
    yield put(
      subscriptionActions.createSubscriptionSuccess({
        subscription: response.subscription,
      }),
    );
    yield put(subscriptionActions.getSubscriptionsRequest());
    yield put(subscriptionActions.getSubscriptionStatsRequest());
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(subscriptionActions.createSubscriptionFailure(errorMsg));
  }
}

function* handleUpdateSubscription(
  action: PayloadAction<{ id: string; data: any }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { subscription: any } = yield call(
      subscriptionApi.updateSubscription,
      id,
      data,
    );
    yield call(showSuccessToast, "Subscription updated successfully");
    yield put(
      subscriptionActions.updateSubscriptionSuccess({
        subscription: response.subscription,
      }),
    );
    yield put(subscriptionActions.getSubscriptionsRequest());
    yield put(subscriptionActions.getSubscriptionStatsRequest());
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(subscriptionActions.updateSubscriptionFailure(errorMsg));
  }
}

function* handleDeleteSubscription(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      subscriptionApi.deleteSubscription,
      id,
    );
    yield call(showSuccessToast, response.message || "Subscription deleted");
    yield put(
      subscriptionActions.deleteSubscriptionSuccess({
        id,
        message: response.message || "Subscription deleted",
      }),
    );
    yield put(subscriptionActions.getSubscriptionStatsRequest());
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(subscriptionActions.deleteSubscriptionFailure(errorMsg));
  }
}

function* handleGetUsers() {
  try {
    const response: unknown = yield call(subscriptionApi.getUsers);
    yield put(subscriptionActions.getUsersSuccess(response));
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield put(subscriptionActions.getUsersFailure(errorMsg));
  }
}

function* handleGetProducts() {
  try {
    const response: unknown = yield call(subscriptionApi.getProducts);
    yield put(subscriptionActions.getProductsSuccess(response));
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield put(subscriptionActions.getProductsFailure(errorMsg));
  }
}

function* handleRunRenewals() {
  try {
    const response: unknown = yield call(subscriptionApi.runRenewals);
    yield call(showSuccessToast, "Renewals executed successfully");
    yield put(subscriptionActions.runRenewalsSuccess(response));
    yield put(subscriptionActions.getSubscriptionsRequest());
    yield put(subscriptionActions.getSubscriptionStatsRequest());
  } catch (error) {
    const errorMsg = getSubscriptionErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(subscriptionActions.runRenewalsFailure(errorMsg));
  }
}

export function* subscriptionSaga() {
  yield all([
    takeLatest(
      subscriptionActions.getSubscriptionsRequest.type,
      handleGetSubscriptions,
    ),
    takeLatest(
      subscriptionActions.getSubscriptionStatsRequest.type,
      handleGetSubscriptionStats,
    ),
    takeLatest(
      subscriptionActions.createSubscriptionRequest.type,
      handleCreateSubscription,
    ),
    takeLatest(
      subscriptionActions.updateSubscriptionRequest.type,
      handleUpdateSubscription,
    ),
    takeLatest(
      subscriptionActions.deleteSubscriptionRequest.type,
      handleDeleteSubscription,
    ),
    takeLatest(subscriptionActions.getUsersRequest.type, handleGetUsers),
    takeLatest(subscriptionActions.getProductsRequest.type, handleGetProducts),
    takeLatest(subscriptionActions.runRenewalsRequest.type, handleRunRenewals),
  ]);
}
export default subscriptionSaga;
