import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ShiftsState,
  ShiftsLoadingState,
  ShiftsErrorState,
  ShiftsOperation,
  ApiShift,
  OpenShiftRequest,
  CloseShiftRequest,
} from "./shiftsTypes";

const initialLoading: ShiftsLoadingState = {
  open: false,
  close: false,
  fetch: false,
};

const initialErrors: ShiftsErrorState = {
  open: null,
  close: null,
  fetch: null,
};

const initialState: ShiftsState = {
  currentShift: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: ShiftsState,
  operation: ShiftsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: ShiftsState,
  operation: ShiftsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    openShiftRequest: (state, _action: PayloadAction<OpenShiftRequest>) => {
      setOperationLoading(state, "open");
    },
    openShiftSuccess: (
      state,
      action: PayloadAction<{ shift: ApiShift; message?: string }>,
    ) => {
      state.loading.open = false;
      state.currentShift = action.payload.shift;
      state.successMessage = action.payload.message ?? "Shift opened";
    },
    openShiftFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "open", action.payload);
    },

    closeShiftRequest: (state, _action: PayloadAction<CloseShiftRequest>) => {
      setOperationLoading(state, "close");
    },
    closeShiftSuccess: (
      state,
      action: PayloadAction<{ shift: ApiShift; message?: string }>,
    ) => {
      state.loading.close = false;
      state.currentShift = null;
      state.successMessage = action.payload.message ?? "Shift closed";
    },
    closeShiftFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "close", action.payload);
    },

    getCurrentShiftRequest: (
      state,
      _action: PayloadAction<{ cashierId?: string } | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getCurrentShiftSuccess: (
      state,
      action: PayloadAction<{ shift: ApiShift | null }>,
    ) => {
      state.loading.fetch = false;
      state.currentShift = action.payload.shift;
    },
    getCurrentShiftFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
      // 404 means no active shift — clear it silently
      state.currentShift = null;
    },

    clearShiftsMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const shiftsActions = shiftsSlice.actions;
export const shiftsReducer = shiftsSlice.reducer;
export default shiftsReducer;
