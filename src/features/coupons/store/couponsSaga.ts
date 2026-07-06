import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { couponsApi } from "../api/couponsApi";
import { couponsActions } from "./couponsSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetCouponsRequest,
  GetCouponsResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
  Coupon,
} from "./couponTypes";

const getCouponErrorMessage = (error: unknown): string => {
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

function* handleGetCoupons(
  action: PayloadAction<GetCouponsRequest | undefined>,
) {
  try {
    const response: GetCouponsResponse = yield call(
      couponsApi.getCoupons,
      action.payload,
    );
    yield put(couponsActions.getCouponsSuccess(response));
  } catch (error) {
    const errorMsg = getCouponErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(couponsActions.getCouponsFailure(errorMsg));
  }
}

function* handleCreateCoupon(action: PayloadAction<CreateCouponRequest>) {
  try {
    const response: { coupon: Coupon } = yield call(
      couponsApi.createCoupon,
      action.payload,
    );
    yield call(showSuccessToast, "Coupon created successfully");
    yield put(
      couponsActions.createCouponSuccess({
        coupon: response.coupon as Coupon,
        message: "Coupon created successfully",
      }),
    );
  } catch (error) {
    const errorMsg = getCouponErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(couponsActions.createCouponFailure(errorMsg));
  }
}

function* handleUpdateCoupon(
  action: PayloadAction<{ id: string; data: UpdateCouponRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { coupon: Coupon } = yield call(
      couponsApi.updateCoupon,
      id,
      data,
    );
    yield call(showSuccessToast, "Coupon updated successfully");
    yield put(
      couponsActions.updateCouponSuccess({
        coupon: response.coupon as Coupon,
        message: "Coupon updated successfully",
      }),
    );
  } catch (error) {
    const errorMsg = getCouponErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(couponsActions.updateCouponFailure(errorMsg));
  }
}

function* handleDeleteCoupon(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      couponsApi.deleteCoupon,
      id,
    );
    yield call(showSuccessToast, response.message ?? "Coupon deleted");
    yield put(
      couponsActions.deleteCouponSuccess({
        id,
        message: response.message ?? "Coupon deleted",
      }),
    );
  } catch (error) {
    const errorMsg = getCouponErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(couponsActions.deleteCouponFailure(errorMsg));
  }
}

export function* couponsSaga() {
  yield all([
    takeLatest(couponsActions.getCouponsRequest.type, handleGetCoupons),
    takeLatest(couponsActions.createCouponRequest.type, handleCreateCoupon),
    takeLatest(couponsActions.updateCouponRequest.type, handleUpdateCoupon),
    takeLatest(couponsActions.deleteCouponRequest.type, handleDeleteCoupon),
  ]);
}

export default couponsSaga;
