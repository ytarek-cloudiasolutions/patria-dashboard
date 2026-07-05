import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  SupplierState,
  SupplierLoadingState,
  SupplierErrorState,
  SupplierOperation,
  GetSuppliersResponse,
  CreateSupplierRequest,
} from "./supplierTypes";
import { mapSuppliers } from "../utils/supplierMappers";

const initialLoading: SupplierLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
};

const initialErrors: SupplierErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
};

const initialState: SupplierState = {
  suppliers: [],
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: SupplierState,
  operation: SupplierOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: SupplierState,
  operation: SupplierOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    getSuppliersRequest: (
      state,
      _action: PayloadAction<{ page?: number; limit?: number } | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getSuppliersSuccess: (
      state,
      action: PayloadAction<GetSuppliersResponse>,
    ) => {
      state.loading.fetch = false;
      state.suppliers = mapSuppliers(action.payload.data || []);
      state.pagination = action.payload.pagination || null;
    },
    getSuppliersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createSupplierRequest: (
      state,
      _action: PayloadAction<CreateSupplierRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createSupplierSuccess: (
      state,
      _action: PayloadAction<{ supplier: any; message?: string }>,
    ) => {
      state.loading.create = false;
      state.successMessage = "Supplier created successfully";
    },
    createSupplierFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateSupplierRequest: (
      state,
      _action: PayloadAction<{ id: string; data: Partial<CreateSupplierRequest> }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateSupplierSuccess: (
      state,
      _action: PayloadAction<{ supplier: any; message?: string }>,
    ) => {
      state.loading.update = false;
      state.successMessage = "Supplier updated successfully";
    },
    updateSupplierFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteSupplierRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteSupplierSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.suppliers = state.suppliers.filter(
        (sup) => String(sup.id) !== action.payload.id,
      );
      state.successMessage =
        action.payload.message || "Supplier deleted successfully";
    },
    deleteSupplierFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearSupplierMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const supplierActions = supplierSlice.actions;
export const supplierReducer = supplierSlice.reducer;
export default supplierReducer;
