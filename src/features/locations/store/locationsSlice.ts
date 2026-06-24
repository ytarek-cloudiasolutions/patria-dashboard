import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  calculateLocationStats,
  mapLocation,
  mapLocations,
} from "../utils/locationMappers";
import type { LocationStats } from "../types";
import type {
  CreateLocationRequest,
  DeleteLocationRequest,
  Location,
  LocationsErrorState,
  LocationsLoadingState,
  LocationsOperation,
  LocationsState,
  ToggleLocationStatusRequest,
  UpdateLocationRequest,
} from "./locationTypes";

const initialLoading: LocationsLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
  toggle: false,
};

const initialErrors: LocationsErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
  toggle: null,
};

const initialStats: LocationStats = {
  total: 0,
  active: 0,
  inactive: 0,
};

const setOperationLoading = (
  state: LocationsState,
  operation: LocationsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: LocationsState,
  operation: LocationsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const syncStats = (state: LocationsState) => {
  state.stats = calculateLocationStats(state.locations);
};

const initialState: LocationsState = {
  locations: [],
  stats: initialStats,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    getLocationsRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getLocationsSuccess: (
      state,
      action: PayloadAction<{
        locations: Location[];
        stats: LocationStats;
        message: string;
      }>,
    ) => {
      state.loading.fetch = false;
      state.locations = mapLocations(action.payload.locations || []);
      state.stats = action.payload.stats || initialStats;
      state.successMessage = action.payload.message;
    },
    getLocationsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createLocationRequest: (
      state,
      _action: PayloadAction<CreateLocationRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createLocationSuccess: (
      state,
      action: PayloadAction<{ location: Location; message: string }>,
    ) => {
      state.loading.create = false;
      if (action.payload.location) {
        state.locations = [mapLocation(action.payload.location), ...state.locations];
      }
      syncStats(state);
      state.successMessage = action.payload.message;
    },
    createLocationFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateLocationRequest: (
      state,
      _action: PayloadAction<UpdateLocationRequest>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateLocationSuccess: (
      state,
      action: PayloadAction<{ location: Location; message: string }>,
    ) => {
      const updatedLocation = mapLocation(action.payload.location);

      state.loading.update = false;
      state.locations = state.locations.map((location) =>
        location.id === updatedLocation.id ? updatedLocation : location,
      );
      syncStats(state);
      state.successMessage = action.payload.message;
    },
    updateLocationFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteLocationRequest: (
      state,
      _action: PayloadAction<DeleteLocationRequest>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteLocationSuccess: (
      state,
      action: PayloadAction<{ locationId: string; message: string }>,
    ) => {
      state.loading.delete = false;
      state.locations = state.locations.filter(
        (location) => location.id !== action.payload.locationId,
      );
      syncStats(state);
      state.successMessage = action.payload.message;
    },
    deleteLocationFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    toggleLocationStatusRequest: (
      state,
      _action: PayloadAction<ToggleLocationStatusRequest>,
    ) => {
      setOperationLoading(state, "toggle");
    },
    toggleLocationStatusSuccess: (
      state,
      action: PayloadAction<{ location: Location; message: string }>,
    ) => {
      const updatedLocation = mapLocation(action.payload.location);

      state.loading.toggle = false;
      state.locations = state.locations.map((location) =>
        location.id === updatedLocation.id ? updatedLocation : location,
      );
      syncStats(state);
      state.successMessage = action.payload.message;
    },
    toggleLocationStatusFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "toggle", action.payload);
    },

    clearLocationsError: (
      state,
      action: PayloadAction<LocationsOperation | undefined>,
    ) => {
      if (action.payload) {
        state.errors[action.payload] = null;
        return;
      }

      state.errors = { ...initialErrors };
    },
    clearLocationsMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const locationsActions = locationsSlice.actions;
export default locationsSlice.reducer;
