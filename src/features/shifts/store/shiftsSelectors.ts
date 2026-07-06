import type { RootState } from "@/app/store";
import type { ShiftsState, ShiftsOperation } from "./shiftsTypes";

// Extended to include the shifts slice (added to rootReducer separately)
type AppState = RootState & { shifts: ShiftsState };

export const selectShiftsState = (state: AppState) => state.shifts;

export const selectCurrentShift = (state: AppState) =>
  state.shifts.currentShift;

export const selectShiftsLoading = (state: AppState) => state.shifts.loading;

export const selectShiftsErrors = (state: AppState) => state.shifts.errors;

export const selectShiftsSuccessMessage = (state: AppState) =>
  state.shifts.successMessage;

export const selectIsShiftsOperationLoading =
  (operation: ShiftsOperation) => (state: AppState) =>
    state.shifts.loading[operation];

export const selectShiftsOperationError =
  (operation: ShiftsOperation) => (state: AppState) =>
    state.shifts.errors[operation];
