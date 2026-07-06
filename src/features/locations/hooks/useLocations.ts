import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectLocationStats,
  selectLocations,
  selectLocationsErrors,
  selectLocationsLoading,
  selectLocationsState,
  selectLocationsSuccessMessage,
} from "../store/locationsSelectors";
import { locationsActions } from "../store/locationsSlice";
import type {
  CreateLocationRequest,
  DeleteLocationRequest,
  LocationsOperation,
  ToggleLocationStatusRequest,
  UpdateLocationRequest,
} from "../store/locationTypes";

export const useLocations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locationsState = useSelector(selectLocationsState);
  const locations = useSelector(selectLocations);
  const stats = useSelector(selectLocationStats);
  const loading = useSelector(selectLocationsLoading);
  const errors = useSelector(selectLocationsErrors);
  const successMessage = useSelector(selectLocationsSuccessMessage);

  const getLocations = useCallback(() => {
    dispatch(locationsActions.getLocationsRequest());
  }, [dispatch]);

  const createLocation = useCallback(
    (payload: CreateLocationRequest) => {
      dispatch(locationsActions.createLocationRequest(payload));
    },
    [dispatch],
  );

  const updateLocation = useCallback(
    (payload: UpdateLocationRequest) => {
      dispatch(locationsActions.updateLocationRequest(payload));
    },
    [dispatch],
  );

  const deleteLocation = useCallback(
    (payload: DeleteLocationRequest) => {
      dispatch(locationsActions.deleteLocationRequest(payload));
    },
    [dispatch],
  );

  const toggleLocationStatus = useCallback(
    (payload: ToggleLocationStatusRequest) => {
      dispatch(locationsActions.toggleLocationStatusRequest(payload));
    },
    [dispatch],
  );

  const clearLocationsError = useCallback(
    (operation?: LocationsOperation) => {
      dispatch(locationsActions.clearLocationsError(operation));
    },
    [dispatch],
  );

  const clearLocationsMessages = useCallback(() => {
    dispatch(locationsActions.clearLocationsMessages());
  }, [dispatch]);

  return {
    ...locationsState,
    locations,
    stats,
    loading,
    errors,
    successMessage,
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    toggleLocationStatus,
    clearLocationsError,
    clearLocationsMessages,
    isFetchingLocations: loading.fetch,
    isCreatingLocation: loading.create,
    isUpdatingLocation: loading.update,
    isDeletingLocation: loading.delete,
    isTogglingLocation: loading.toggle,
  };
};
