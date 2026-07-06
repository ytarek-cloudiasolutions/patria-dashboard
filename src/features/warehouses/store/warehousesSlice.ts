import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  WarehousesState,
  WarehousesLoadingState,
  WarehousesErrorState,
  WarehousesOperation,
  Warehouse,
  Transfer,
  GetWarehousesResponse,
  GetTransfersResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateTransferRequest,
  UpdateTransferStatusRequest,
} from "./warehousesTypes";

const initialLoading: WarehousesLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
  fetchTransfers: false,
  createTransfer: false,
  updateTransferStatus: false,
};

const initialErrors: WarehousesErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
  fetchTransfers: null,
  createTransfer: null,
  updateTransferStatus: null,
};

const initialState: WarehousesState = {
  warehouses: [],
  mainWarehouses: [],
  subWarehouses: [],
  transfers: [],
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: WarehousesState,
  operation: WarehousesOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: WarehousesState,
  operation: WarehousesOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const warehousesSlice = createSlice({
  name: "warehouses",
  initialState,
  reducers: {
    // --- Warehouses CRUD ---
    getWarehousesRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getWarehousesSuccess: (
      state,
      action: PayloadAction<GetWarehousesResponse>,
    ) => {
      state.loading.fetch = false;
      state.warehouses = action.payload.warehouses ?? [];
      state.mainWarehouses = action.payload.mainWarehouses ?? [];
      state.subWarehouses = action.payload.subWarehouses ?? [];
    },
    getWarehousesFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createWarehouseRequest: (
      state,
      _action: PayloadAction<CreateWarehouseRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createWarehouseSuccess: (
      state,
      action: PayloadAction<{ warehouse: Warehouse; message?: string }>,
    ) => {
      state.loading.create = false;
      const w = action.payload.warehouse;
      state.warehouses.push(w);
      if (w.type === "main") state.mainWarehouses.push(w);
      else state.subWarehouses.push(w);
      state.successMessage =
        action.payload.message ?? "Warehouse created successfully";
    },
    createWarehouseFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateWarehouseRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateWarehouseRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateWarehouseSuccess: (
      state,
      action: PayloadAction<{ warehouse: Warehouse; message?: string }>,
    ) => {
      state.loading.update = false;
      const updated = action.payload.warehouse;
      const replace = (arr: Warehouse[]) => {
        const idx = arr.findIndex((w) => w._id === updated._id);
        if (idx !== -1) arr[idx] = updated;
      };
      replace(state.warehouses);
      replace(state.mainWarehouses);
      replace(state.subWarehouses);
      state.successMessage =
        action.payload.message ?? "Warehouse updated successfully";
    },
    updateWarehouseFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteWarehouseRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteWarehouseSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      const { id } = action.payload;
      const removeById = (arr: Warehouse[]) =>
        arr.filter((w) => w._id !== id);
      state.warehouses = removeById(state.warehouses);
      state.mainWarehouses = removeById(state.mainWarehouses);
      state.subWarehouses = removeById(state.subWarehouses);
      state.successMessage =
        action.payload.message ?? "Warehouse removed successfully";
    },
    deleteWarehouseFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    // --- Transfers ---
    getTransfersRequest: (state) => {
      setOperationLoading(state, "fetchTransfers");
    },
    getTransfersSuccess: (
      state,
      action: PayloadAction<GetTransfersResponse>,
    ) => {
      state.loading.fetchTransfers = false;
      state.transfers = action.payload.transfers ?? [];
    },
    getTransfersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchTransfers", action.payload);
    },

    createTransferRequest: (
      state,
      _action: PayloadAction<CreateTransferRequest>,
    ) => {
      setOperationLoading(state, "createTransfer");
    },
    createTransferSuccess: (
      state,
      action: PayloadAction<{ transfer: Transfer; message?: string }>,
    ) => {
      state.loading.createTransfer = false;
      state.transfers.push(action.payload.transfer);
      state.successMessage =
        action.payload.message ?? "Transfer created successfully";
    },
    createTransferFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "createTransfer", action.payload);
    },

    updateTransferStatusRequest: (
      state,
      _action: PayloadAction<{
        id: string;
        data: UpdateTransferStatusRequest;
      }>,
    ) => {
      setOperationLoading(state, "updateTransferStatus");
    },
    updateTransferStatusSuccess: (
      state,
      action: PayloadAction<{ transfer: Transfer; message?: string }>,
    ) => {
      state.loading.updateTransferStatus = false;
      const updated = action.payload.transfer;
      const idx = state.transfers.findIndex((t) => t._id === updated._id);
      if (idx !== -1) state.transfers[idx] = updated;
      state.successMessage =
        action.payload.message ?? "Transfer status updated";
    },
    updateTransferStatusFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "updateTransferStatus", action.payload);
    },

    clearWarehousesMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const warehousesActions = warehousesSlice.actions;
export const warehousesReducer = warehousesSlice.reducer;
export default warehousesReducer;
