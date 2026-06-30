import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CustomersState,
  CustomersLoadingState,
  CustomersErrorState,
  CustomersOperation,
  GetCustomersRequest,
  GetCustomersResponse,
  CustomerStats,
  UpdateCustomerRequest,
} from "./customerTypes";
import { mapCustomers } from "../utils/customerMappers";

const initialLoading: CustomersLoadingState = {
  fetch: false,
  update: false,
  delete: false,
};

const initialErrors: CustomersErrorState = {
  fetch: null,
  update: null,
  delete: null,
};

const initialState: CustomersState = {
  customers: [],
  stats: {
    total: 0,
    active: 0,
  },
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: CustomersState,
  operation: CustomersOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: CustomersState,
  operation: CustomersOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    getCustomersRequest: (
      state,
      _action: PayloadAction<GetCustomersRequest | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getCustomersSuccess: (
      state,
      action: PayloadAction<GetCustomersResponse>,
    ) => {
      state.loading.fetch = false;
      state.customers = mapCustomers(action.payload.data || []);
      state.pagination = action.payload.pagination || null;
    },
    getCustomersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    getCustomerStatsRequest: (_state) => {
      // Internal loading if needed
    },
    getCustomerStatsSuccess: (
      state,
      action: PayloadAction<{ stats: CustomerStats }>,
    ) => {
      state.stats = action.payload.stats || initialState.stats;
    },
    getCustomerStatsFailure: (_state, _action: PayloadAction<string>) => {
      // Handle silently or logs
    },

    updateCustomerRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateCustomerRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateCustomerSuccess: (
      state,
      action: PayloadAction<{ customer: any; message?: string }>,
    ) => {
      state.loading.update = false;
      state.successMessage = action.payload.message || "Customer updated successfully";
    },
    updateCustomerFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteCustomerRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteCustomerSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.customers = state.customers.filter((c) => c.id !== action.payload.id);
      state.successMessage = action.payload.message || "Customer deleted successfully";
    },
    deleteCustomerFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearCustomersMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const customersActions = customersSlice.actions;
export const customersReducer = customersSlice.reducer;
export default customersReducer;
