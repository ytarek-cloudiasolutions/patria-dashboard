import type { LogisticsState } from "./logisticsTypes";

// Local augmented state type: logistics slice is wired into rootReducer separately
type StateWithLogistics = { logistics: LogisticsState } & Record<
  string,
  unknown
>;

export const selectDrivers = (state: StateWithLogistics) =>
  state.logistics.drivers;

export const selectDriversByZone = (state: StateWithLogistics) =>
  state.logistics.driversByZone;

export const selectLogisticsStats = (state: StateWithLogistics) =>
  state.logistics.stats;

export const selectLogisticsLoading = (state: StateWithLogistics) =>
  state.logistics.loading;

export const selectLogisticsErrors = (state: StateWithLogistics) =>
  state.logistics.errors;

export const selectLogisticsSuccessMessage = (state: StateWithLogistics) =>
  state.logistics.successMessage;
