import type { WarehousesState } from "./warehousesTypes";

// Local augmented state type: warehouses slice is wired into rootReducer separately
type StateWithWarehouses = { warehouses: WarehousesState } & Record<
  string,
  unknown
>;

export const selectWarehouses = (state: StateWithWarehouses) =>
  state.warehouses.warehouses;

export const selectMainWarehouses = (state: StateWithWarehouses) =>
  state.warehouses.mainWarehouses;

export const selectSubWarehouses = (state: StateWithWarehouses) =>
  state.warehouses.subWarehouses;

export const selectTransfers = (state: StateWithWarehouses) =>
  state.warehouses.transfers;

export const selectWarehousesLoading = (state: StateWithWarehouses) =>
  state.warehouses.loading;

export const selectWarehousesErrors = (state: StateWithWarehouses) =>
  state.warehouses.errors;

export const selectWarehousesSuccessMessage = (state: StateWithWarehouses) =>
  state.warehouses.successMessage;
