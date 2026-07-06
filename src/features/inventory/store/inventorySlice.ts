import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  InventoryState,
  InventoryLoadingState,
  InventoryErrorState,
  InventoryOperation,
  BulkUpdateStockRequest,
  UpdateStockRequest,
  InventoryStats,
} from "./inventoryTypes";
import { mapInventoryItems, mapShortageItems } from "../utils/inventoryMappers";

const initialLoading: InventoryLoadingState = {
  fetch: false,
  fetchShortages: false,
  update: false,
  sync: false,
};

const initialErrors: InventoryErrorState = {
  fetch: null,
  fetchShortages: null,
  update: null,
  sync: null,
};

const initialState: InventoryState = {
  items: [],
  shortages: [],
  stats: {
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    inventoryValue: 0,
  },
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: InventoryState,
  operation: InventoryOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: InventoryState,
  operation: InventoryOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    getInventoryRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getInventorySuccess: (
      state,
      action: PayloadAction<{
        products: any[];
        stats: InventoryStats;
      }>,
    ) => {
      state.loading.fetch = false;
      state.items = mapInventoryItems(action.payload.products || []);
      state.stats = action.payload.stats || initialState.stats;
    },
    getInventoryFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    getShortagesRequest: (state) => {
      setOperationLoading(state, "fetchShortages");
    },
    getShortagesSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading.fetchShortages = false;
      state.shortages = mapShortageItems(action.payload || []);
    },
    getShortagesFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchShortages", action.payload);
    },

    syncInventoryRequest: (state) => {
      setOperationLoading(state, "sync");
    },
    syncInventorySuccess: (state, action: PayloadAction<{ message: string; updated: number }>) => {
      state.loading.sync = false;
      state.successMessage = action.payload.message || "Inventory synchronized successfully";
    },
    syncInventoryFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "sync", action.payload);
    },

    updateStockRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateStockRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateStockSuccess: (state, action: PayloadAction<string>) => {
      state.loading.update = false;
      state.successMessage = action.payload || "Stock updated successfully";
    },
    updateStockFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    bulkUpdateStockRequest: (
      state,
      _action: PayloadAction<BulkUpdateStockRequest>,
    ) => {
      setOperationLoading(state, "update");
    },
    bulkUpdateStockSuccess: (state, action: PayloadAction<string>) => {
      state.loading.update = false;
      state.successMessage = action.payload || "Stock updated successfully";
    },
    bulkUpdateStockFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    clearInventoryMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const inventoryActions = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;
