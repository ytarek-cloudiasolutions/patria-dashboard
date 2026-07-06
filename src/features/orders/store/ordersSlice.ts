import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mapOrder, mapOrders } from "../utils/orderMappers";
import type {
  OrdersState,
  OrdersLoadingState,
  OrdersErrorState,
  OrdersOperation,
  GetOrdersRequest,
  Pagination,
  CreateOrderRequest,
} from "./orderTypes";

const initialLoading: OrdersLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
};

const initialErrors: OrdersErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
};

const initialState: OrdersState = {
  orders: [],
  pagination: null,
  selectedOrder: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: OrdersState,
  operation: OrdersOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: OrdersState,
  operation: OrdersOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    getOrdersRequest: (state, _action: PayloadAction<GetOrdersRequest | undefined>) => {
      setOperationLoading(state, "fetch");
    },
    getOrdersSuccess: (
      state,
      action: PayloadAction<{
        orders: any[];
        pagination: Pagination;
      }>,
    ) => {
      state.loading.fetch = false;
      state.orders = mapOrders(action.payload.orders || []);
      state.pagination = action.payload.pagination;
    },
    getOrdersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createOrderRequest: (
      state,
      _action: PayloadAction<CreateOrderRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createOrderSuccess: (
      state,
      action: PayloadAction<{ order: any; message?: string }>,
    ) => {
      state.loading.create = false;
      if (action.payload.order) {
        state.orders = [mapOrder(action.payload.order), ...state.orders];
      }
      state.successMessage = action.payload.message || "Order created successfully";
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    getOrderByIdRequest: (state, _action: PayloadAction<string>) => {
      setOperationLoading(state, "fetch");
    },
    getOrderByIdSuccess: (state, action: PayloadAction<any>) => {
      state.loading.fetch = false;
      state.selectedOrder = mapOrder(action.payload);
    },
    getOrderByIdFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    updateOrderStatusRequest: (
      state,
      _action: PayloadAction<{ orderId: string; status: string }>,
    ) => {
      state.loading.update = true;
      state.errors.update = null;
      state.successMessage = null;
    },
    updateOrderStatusSuccess: (
      state,
      action: PayloadAction<{ order: any; message?: string }>,
    ) => {
      state.loading.update = false;
      const updated = mapOrder(action.payload.order);
      state.orders = state.orders.map((o) =>
        o.id === updated.id ? updated : o
      );
      if (state.selectedOrder?.id === updated.id) {
        state.selectedOrder = updated;
      }
      state.successMessage = action.payload.message || "Order status updated successfully";
    },
    updateOrderStatusFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteOrderRequest: (state, _action: PayloadAction<string>) => {
      setOperationLoading(state, "delete");
    },
    deleteOrderSuccess: (
      state,
      action: PayloadAction<{ orderId: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.orders = state.orders.filter((o) => o.id !== action.payload.orderId);
      if (state.selectedOrder?.id === action.payload.orderId) {
        state.selectedOrder = null;
      }
      state.successMessage = action.payload.message || "Order deleted successfully";
    },
    deleteOrderFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearOrdersError: (state, action: PayloadAction<OrdersOperation | undefined>) => {
      if (action.payload) {
        state.errors[action.payload] = null;
      } else {
        state.errors = { ...initialErrors };
      }
    },
    clearOrdersMessages: (state) => {
      state.successMessage = null;
    },
  },
});

export const ordersActions = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
