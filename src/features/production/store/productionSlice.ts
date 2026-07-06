import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ProductionState,
  ProductionLoadingState,
  ProductionErrorState,
  ProductionOperation,
  ApiBatch,
  ApiEquipment,
  GetBatchesResponse,
  CreateBatchRequest,
  CreateBatchResponse,
  UpdateBatchStatusRequest,
  UpdateBatchStatusResponse,
  GetEquipmentResponse,
  CreateEquipmentRequest,
  CreateEquipmentResponse,
  UpdateEquipmentRequest,
  UpdateEquipmentResponse,
} from "./productionTypes";

const initialLoading: ProductionLoadingState = {
  fetchBatches: false,
  createBatch: false,
  updateBatchStatus: false,
  fetchEquipment: false,
  createEquipment: false,
  updateEquipment: false,
};

const initialErrors: ProductionErrorState = {
  fetchBatches: null,
  createBatch: null,
  updateBatchStatus: null,
  fetchEquipment: null,
  createEquipment: null,
  updateEquipment: null,
};

const initialState: ProductionState = {
  batches: [],
  equipment: [],
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: ProductionState,
  operation: ProductionOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: ProductionState,
  operation: ProductionOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    // Batches
    getBatchesRequest: (state) => {
      setOperationLoading(state, "fetchBatches");
    },
    getBatchesSuccess: (state, action: PayloadAction<GetBatchesResponse>) => {
      state.loading.fetchBatches = false;
      state.batches = action.payload.batches || [];
    },
    getBatchesFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchBatches", action.payload);
    },

    createBatchRequest: (
      state,
      _action: PayloadAction<CreateBatchRequest>,
    ) => {
      setOperationLoading(state, "createBatch");
    },
    createBatchSuccess: (
      state,
      action: PayloadAction<{ batch: ApiBatch; message?: string }>,
    ) => {
      state.loading.createBatch = false;
      state.batches.unshift(action.payload.batch);
      state.successMessage = action.payload.message ?? "Batch created successfully";
    },
    createBatchFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "createBatch", action.payload);
    },

    updateBatchStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateBatchStatusRequest }>,
    ) => {
      setOperationLoading(state, "updateBatchStatus");
    },
    updateBatchStatusSuccess: (
      state,
      action: PayloadAction<{ batch: ApiBatch; message?: string }>,
    ) => {
      state.loading.updateBatchStatus = false;
      const updated = action.payload.batch;
      const idx = state.batches.findIndex((b) => b._id === updated._id);
      if (idx !== -1) state.batches[idx] = updated;
      state.successMessage = action.payload.message ?? "Batch status updated";
    },
    updateBatchStatusFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "updateBatchStatus", action.payload);
    },

    // Equipment
    getEquipmentRequest: (state) => {
      setOperationLoading(state, "fetchEquipment");
    },
    getEquipmentSuccess: (
      state,
      action: PayloadAction<GetEquipmentResponse>,
    ) => {
      state.loading.fetchEquipment = false;
      state.equipment = action.payload.equipment || [];
    },
    getEquipmentFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchEquipment", action.payload);
    },

    createEquipmentRequest: (
      state,
      _action: PayloadAction<CreateEquipmentRequest>,
    ) => {
      setOperationLoading(state, "createEquipment");
    },
    createEquipmentSuccess: (
      state,
      action: PayloadAction<{ equipment: ApiEquipment; message?: string }>,
    ) => {
      state.loading.createEquipment = false;
      state.equipment.unshift(action.payload.equipment);
      state.successMessage = action.payload.message ?? "Equipment added successfully";
    },
    createEquipmentFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "createEquipment", action.payload);
    },

    updateEquipmentRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateEquipmentRequest }>,
    ) => {
      setOperationLoading(state, "updateEquipment");
    },
    updateEquipmentSuccess: (
      state,
      action: PayloadAction<{ equipment: ApiEquipment; message?: string }>,
    ) => {
      state.loading.updateEquipment = false;
      const updated = action.payload.equipment;
      const idx = state.equipment.findIndex((e) => e._id === updated._id);
      if (idx !== -1) state.equipment[idx] = updated;
      state.successMessage = action.payload.message ?? "Equipment updated successfully";
    },
    updateEquipmentFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "updateEquipment", action.payload);
    },

    clearProductionMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const productionActions = productionSlice.actions;
export const productionReducer = productionSlice.reducer;
export default productionReducer;
