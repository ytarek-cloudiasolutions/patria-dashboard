import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  LogisticsState,
  LogisticsLoadingState,
  LogisticsErrorState,
  LogisticsOperation,
  Driver,
  LogisticsStats,
  GetDriversResponse,
  CreateDriverRequest,
  UpdateDriverRequest,
} from "./logisticsTypes";

const initialLoading: LogisticsLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
};

const initialErrors: LogisticsErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
};

const initialStats: LogisticsStats = {
  activeDrivers: 0,
  offlineDrivers: 0,
  busyDrivers: 0,
  waitingOrders: 0,
};

const initialState: LogisticsState = {
  drivers: [],
  driversByZone: [],
  stats: initialStats,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: LogisticsState,
  operation: LogisticsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: LogisticsState,
  operation: LogisticsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const logisticsSlice = createSlice({
  name: "logistics",
  initialState,
  reducers: {
    getDriversRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getDriversSuccess: (state, action: PayloadAction<GetDriversResponse>) => {
      state.loading.fetch = false;
      state.drivers = action.payload.drivers ?? [];
      state.driversByZone = action.payload.driversByZone ?? [];
      state.stats = action.payload.stats ?? initialStats;
    },
    getDriversFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createDriverRequest: (
      state,
      _action: PayloadAction<CreateDriverRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createDriverSuccess: (
      state,
      action: PayloadAction<{ driver: Driver; message?: string }>,
    ) => {
      state.loading.create = false;
      state.drivers.push(action.payload.driver);
      state.successMessage =
        action.payload.message ?? "Driver created successfully";
    },
    createDriverFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateDriverRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateDriverRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateDriverSuccess: (
      state,
      action: PayloadAction<{ driver: Driver; message?: string }>,
    ) => {
      state.loading.update = false;
      const idx = state.drivers.findIndex(
        (d) => d._id === action.payload.driver._id,
      );
      if (idx !== -1) {
        state.drivers[idx] = action.payload.driver;
      }
      state.successMessage =
        action.payload.message ?? "Driver updated successfully";
    },
    updateDriverFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteDriverRequest: (state, _action: PayloadAction<{ id: string }>) => {
      setOperationLoading(state, "delete");
    },
    deleteDriverSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.drivers = state.drivers.filter(
        (d) => d._id !== action.payload.id,
      );
      state.driversByZone = state.driversByZone.filter(
        (d) => d._id !== action.payload.id,
      );
      state.successMessage =
        action.payload.message ?? "Driver removed successfully";
    },
    deleteDriverFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearLogisticsMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const logisticsActions = logisticsSlice.actions;
export const logisticsReducer = logisticsSlice.reducer;
export default logisticsReducer;
