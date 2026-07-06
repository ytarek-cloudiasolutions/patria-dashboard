import type { RootState } from "@/app/store";
import type { ProductionState, ProductionOperation } from "./productionTypes";

// Extended to include the production slice (added to rootReducer separately)
type AppState = RootState & { production: ProductionState };

export const selectProductionState = (state: AppState) => state.production;

export const selectBatches = (state: AppState) => state.production.batches;

export const selectEquipment = (state: AppState) => state.production.equipment;

export const selectProductionLoading = (state: AppState) =>
  state.production.loading;

export const selectProductionErrors = (state: AppState) =>
  state.production.errors;

export const selectProductionSuccessMessage = (state: AppState) =>
  state.production.successMessage;

export const selectIsProductionOperationLoading =
  (operation: ProductionOperation) => (state: AppState) =>
    state.production.loading[operation];

export const selectProductionOperationError =
  (operation: ProductionOperation) => (state: AppState) =>
    state.production.errors[operation];
