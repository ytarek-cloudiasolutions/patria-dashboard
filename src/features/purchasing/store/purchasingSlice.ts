import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  PurchasingState,
  PurchasingLoadingState,
  PurchasingErrorState,
  PurchasingOperation,
  GetPurchaseOrdersRequest,
  GetPurchaseOrdersResponse,
  CreatePurchaseOrderRequest,
  ApiPurchaseOrder,
} from "./purchasingTypes";

const initialLoading: PurchasingLoadingState = {
  fetch: false,
  create: false,
  submit: false,
  cancel: false,
};

const initialErrors: PurchasingErrorState = {
  fetch: null,
  create: null,
  submit: null,
  cancel: null,
};

const initialState: PurchasingState = {
  purchaseOrders: [],
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: PurchasingState,
  operation: PurchasingOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: PurchasingState,
  operation: PurchasingOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const purchasingSlice = createSlice({
  name: "purchasing",
  initialState,
  reducers: {
    getPurchaseOrdersRequest: (
      state,
      _action: PayloadAction<GetPurchaseOrdersRequest | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getPurchaseOrdersSuccess: (
      state,
      action: PayloadAction<GetPurchaseOrdersResponse>,
    ) => {
      state.loading.fetch = false;
      state.purchaseOrders = action.payload.data || [];
      state.pagination = action.payload.pagination ?? null;
    },
    getPurchaseOrdersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createPurchaseOrderRequest: (
      state,
      _action: PayloadAction<CreatePurchaseOrderRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createPurchaseOrderSuccess: (
      state,
      action: PayloadAction<{ purchaseOrder: ApiPurchaseOrder; message?: string }>,
    ) => {
      state.loading.create = false;
      state.purchaseOrders.unshift(action.payload.purchaseOrder);
      state.successMessage = action.payload.message ?? "Purchase order created";
    },
    createPurchaseOrderFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    submitPurchaseOrderRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "submit");
    },
    submitPurchaseOrderSuccess: (
      state,
      action: PayloadAction<{ purchaseOrder: ApiPurchaseOrder; message?: string }>,
    ) => {
      state.loading.submit = false;
      const updated = action.payload.purchaseOrder;
      const idx = state.purchaseOrders.findIndex((po) => po._id === updated._id);
      if (idx !== -1) state.purchaseOrders[idx] = updated;
      state.successMessage = action.payload.message ?? "Purchase order submitted";
    },
    submitPurchaseOrderFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "submit", action.payload);
    },

    cancelPurchaseOrderRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "cancel");
    },
    cancelPurchaseOrderSuccess: (
      state,
      action: PayloadAction<{ purchaseOrder: ApiPurchaseOrder; message?: string }>,
    ) => {
      state.loading.cancel = false;
      const updated = action.payload.purchaseOrder;
      const idx = state.purchaseOrders.findIndex((po) => po._id === updated._id);
      if (idx !== -1) state.purchaseOrders[idx] = updated;
      state.successMessage = action.payload.message ?? "Purchase order cancelled";
    },
    cancelPurchaseOrderFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "cancel", action.payload);
    },

    clearPurchasingMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const purchasingActions = purchasingSlice.actions;
export const purchasingReducer = purchasingSlice.reducer;
export default purchasingReducer;
