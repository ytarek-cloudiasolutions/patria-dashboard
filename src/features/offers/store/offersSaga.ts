import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { offersApi } from "../api/offersApi";
import { offersActions } from "./offersSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetOffersRequest,
  GetOffersResponse,
  CreateOfferRequest,
} from "./offerTypes";

const getOfferErrorMessage = (error: unknown): string => {
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

function* handleGetOffers(action: PayloadAction<GetOffersRequest | undefined>) {
  try {
    const response: GetOffersResponse = yield call(offersApi.getOffers, action.payload);
    yield put(offersActions.getOffersSuccess(response));
  } catch (error) {
    const errorMsg = getOfferErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(offersActions.getOffersFailure(errorMsg));
  }
}

function* handleCreateOffer(action: PayloadAction<CreateOfferRequest>) {
  try {
    const response: { offer: any } = yield call(offersApi.createOffer, action.payload);
    yield call(showSuccessToast, "Offer created successfully");
    yield put(
      offersActions.createOfferSuccess({
        offer: response.offer,
      }),
    );
    yield put(offersActions.getOffersRequest());
  } catch (error) {
    const errorMsg = getOfferErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(offersActions.createOfferFailure(errorMsg));
  }
}

function* handleUpdateOffer(
  action: PayloadAction<{ id: string; data: CreateOfferRequest }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { offer: any } = yield call(offersApi.updateOffer, id, data);
    yield call(showSuccessToast, "Offer updated successfully");
    yield put(
      offersActions.updateOfferSuccess({
        offer: response.offer,
      }),
    );
    yield put(offersActions.getOffersRequest());
  } catch (error) {
    const errorMsg = getOfferErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(offersActions.updateOfferFailure(errorMsg));
  }
}

function* handleDeleteOffer(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(offersApi.deleteOffer, id);
    yield call(showSuccessToast, response.message || "Offer deleted");
    yield put(
      offersActions.deleteOfferSuccess({
        id,
        message: response.message || "Offer deleted",
      }),
    );
  } catch (error) {
    const errorMsg = getOfferErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(offersActions.deleteOfferFailure(errorMsg));
  }
}

function* handleToggleOffer(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { offer: any } = yield call(offersApi.toggleOfferStatus, id);
    yield call(showSuccessToast, "Offer status updated");
    yield put(
      offersActions.toggleOfferSuccess({
        id,
        offer: response.offer,
      }),
    );
  } catch (error) {
    const errorMsg = getOfferErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(offersActions.toggleOfferFailure(errorMsg));
  }
}

export function* offersSaga() {
  yield all([
    takeLatest(offersActions.getOffersRequest.type, handleGetOffers),
    takeLatest(offersActions.createOfferRequest.type, handleCreateOffer),
    takeLatest(offersActions.updateOfferRequest.type, handleUpdateOffer),
    takeLatest(offersActions.deleteOfferRequest.type, handleDeleteOffer),
    takeLatest(offersActions.toggleOfferRequest.type, handleToggleOffer),
  ]);
}
export default offersSaga;
