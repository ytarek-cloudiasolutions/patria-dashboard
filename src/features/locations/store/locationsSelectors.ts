import type { RootState } from "@/app/store";
import type { LocationsOperation } from "./locationTypes";

export const selectLocationsState = (state: RootState) => state.locations;

export const selectLocations = (state: RootState) =>
  state.locations.locations;

export const selectLocationStats = (state: RootState) => state.locations.stats;

export const selectLocationsLoading = (state: RootState) =>
  state.locations.loading;

export const selectLocationsErrors = (state: RootState) =>
  state.locations.errors;

export const selectLocationsSuccessMessage = (state: RootState) =>
  state.locations.successMessage;

export const selectIsLocationsOperationLoading =
  (operation: LocationsOperation) => (state: RootState) =>
    state.locations.loading[operation];

export const selectLocationsOperationError =
  (operation: LocationsOperation) => (state: RootState) =>
    state.locations.errors[operation];
