import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  KitchenState,
  KitchenOperation,
  KitchenLoadingState,
  KitchenErrorState,
  KitchenOrder,
  GetKitchenOrdersResponse,
  UpdateKitchenOrderStatusRequest,
} from "./kitchenTypes";

const initialLoading: KitchenLoadingState = {
  fetch: false,
  update: false,
};

const initialErrors: KitchenErrorState = {
  fetch: null,
  update: null,
};

const initialState: KitchenState = {
  kitchenOrders: [],
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: KitchenState,
  operation: KitchenOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: KitchenState,
  operation: KitchenOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState,
  reducers: {
    getKitchenOrdersRequest: (state, _action: PayloadAction<{ kitchenType?: string } | undefined>) => {
      setOperationLoading(state, "fetch");
    },
    getKitchenOrdersSuccess: (
      state,
      action: PayloadAction<GetKitchenOrdersResponse>,
    ) => {
      state.loading.fetch = false;
      state.kitchenOrders = action.payload.orders ?? [];
    },
    getKitchenOrdersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    updateKitchenOrderStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateKitchenOrderStatusRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateKitchenOrderStatusSuccess: (
      state,
      action: PayloadAction<{ order: KitchenOrder; message?: string }>,
    ) => {
      state.loading.update = false;
      const idx = state.kitchenOrders.findIndex(
        (o) => o._id === action.payload.order._id,
      );
      if (idx !== -1) {
        state.kitchenOrders[idx] = action.payload.order;
      }
      state.successMessage = action.payload.message ?? "Order status updated";
    },
    updateKitchenOrderStatusFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    clearKitchenMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const kitchenActions = kitchenSlice.actions;
export const kitchenReducer = kitchenSlice.reducer;
export default kitchenReducer;
