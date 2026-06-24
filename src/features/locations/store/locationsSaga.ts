import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createLocation,
  deleteLocation,
  getLocations,
  toggleLocationStatus,
  updateLocation,
} from "../api/locationsApi";
import { getLocationErrorMessage } from "../utils/locationHelpers";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { locationsActions } from "./locationsSlice";
import type {
  CreateLocationRequest,
  CreateLocationResponse,
  DeleteLocationRequest,
  DeleteLocationResponse,
  GetLocationsResponse,
  ToggleLocationStatusRequest,
  ToggleLocationStatusResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
} from "./locationTypes";

function* handleGetLocations() {
  try {
    const response: GetLocationsResponse = yield call(getLocations);
    const data = (response as any).data || response;

    yield put(
      locationsActions.getLocationsSuccess({
        locations: data.locations || [],
        stats: data.stats || { total: 0, active: 0, inactive: 0 },
        message: response.message || "Locations fetched successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getLocationErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(locationsActions.getLocationsFailure(errorMessage));
  }
}

function* handleCreateLocation(action: PayloadAction<CreateLocationRequest>) {
  try {
    const response: CreateLocationResponse = yield call(
      createLocation,
      action.payload,
    );
    const data = (response as any).data || response;

    yield call(showSuccessToast, response.message || "Location created successfully");
    yield put(
      locationsActions.createLocationSuccess({
        location: data.location || data,
        message: response.message || "Location created successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getLocationErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(locationsActions.createLocationFailure(errorMessage));
  }
}

function* handleUpdateLocation(action: PayloadAction<UpdateLocationRequest>) {
  try {
    const response: UpdateLocationResponse = yield call(
      updateLocation,
      action.payload,
    );
    const data = (response as any).data || response;

    yield call(showSuccessToast, response.message || "Location updated successfully");
    yield put(
      locationsActions.updateLocationSuccess({
        location: data.location || data,
        message: response.message || "Location updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getLocationErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(locationsActions.updateLocationFailure(errorMessage));
  }
}

function* handleDeleteLocation(action: PayloadAction<DeleteLocationRequest>) {
  try {
    const response: DeleteLocationResponse = yield call(
      deleteLocation,
      action.payload,
    );

    yield call(showSuccessToast, response.message || "Location deleted successfully");
    yield put(
      locationsActions.deleteLocationSuccess({
        locationId: action.payload.locationId,
        message: response.message || "Location deleted successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getLocationErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(locationsActions.deleteLocationFailure(errorMessage));
  }
}

function* handleToggleLocationStatus(
  action: PayloadAction<ToggleLocationStatusRequest>,
) {
  try {
    const response: ToggleLocationStatusResponse = yield call(
      toggleLocationStatus,
      action.payload,
    );
    const data = (response as any).data || response;

    yield call(showSuccessToast, response.message || "Status updated successfully");
    yield put(
      locationsActions.toggleLocationStatusSuccess({
        location: data.location || data,
        message: response.message || "Status updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getLocationErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(locationsActions.toggleLocationStatusFailure(errorMessage));
  }
}

export default function* locationsSaga() {
  yield all([
    takeLatest(locationsActions.getLocationsRequest.type, handleGetLocations),
    takeLatest(
      locationsActions.createLocationRequest.type,
      handleCreateLocation,
    ),
    takeLatest(
      locationsActions.updateLocationRequest.type,
      handleUpdateLocation,
    ),
    takeLatest(
      locationsActions.deleteLocationRequest.type,
      handleDeleteLocation,
    ),
    takeLatest(
      locationsActions.toggleLocationStatusRequest.type,
      handleToggleLocationStatus,
    ),
  ]);
}
