import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { reviewsApi } from "../api/reviewsApi";
import { reviewsActions } from "./reviewsSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetReviewsRequest,
  GetReviewsResponse,
  CreateReviewRequest,
  ToggleVisibilityRequest,
  Review,
} from "./reviewsTypes";

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

function* handleGetReviews(
  action: PayloadAction<GetReviewsRequest | undefined>,
) {
  try {
    const response: GetReviewsResponse = yield call(
      reviewsApi.getReviews,
      action.payload,
    );
    yield put(reviewsActions.getReviewsSuccess(response));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(reviewsActions.getReviewsFailure(msg));
  }
}

function* handleCreateReview(action: PayloadAction<CreateReviewRequest>) {
  try {
    const response: { review: Review } = yield call(
      reviewsApi.createReview,
      action.payload,
    );
    yield call(showSuccessToast, "Review created successfully");
    yield put(
      reviewsActions.createReviewSuccess({
        review: response.review,
        message: "Review created successfully",
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(reviewsActions.createReviewFailure(msg));
  }
}

function* handleToggleVisibility(
  action: PayloadAction<{ id: string; data: ToggleVisibilityRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { review: Review } = yield call(
      reviewsApi.toggleReviewVisibility,
      id,
      data,
    );
    const message = data.isVisible
      ? "Review is now visible"
      : "Review is now hidden";
    yield call(showSuccessToast, message);
    yield put(
      reviewsActions.toggleVisibilitySuccess({
        review: response.review,
        message,
      }),
    );
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(reviewsActions.toggleVisibilityFailure(msg));
  }
}

function* handleDeleteReview(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      reviewsApi.deleteReview,
      id,
    );
    const message = response.message ?? "Review deleted";
    yield call(showSuccessToast, message);
    yield put(reviewsActions.deleteReviewSuccess({ id, message }));
  } catch (error) {
    const msg = getErrorMessage(error);
    yield call(showErrorToast, msg);
    yield put(reviewsActions.deleteReviewFailure(msg));
  }
}

export function* reviewsSaga() {
  yield all([
    takeLatest(reviewsActions.getReviewsRequest.type, handleGetReviews),
    takeLatest(reviewsActions.createReviewRequest.type, handleCreateReview),
    takeLatest(
      reviewsActions.toggleVisibilityRequest.type,
      handleToggleVisibility,
    ),
    takeLatest(reviewsActions.deleteReviewRequest.type, handleDeleteReview),
  ]);
}

export default reviewsSaga;
