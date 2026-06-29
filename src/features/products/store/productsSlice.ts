import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mapProduct, mapProducts } from "../utils/productMappers";
import type {
  ProductsState,
  ProductsLoadingState,
  ProductsErrorState,
  ProductsOperation,
  GetProductsRequest,
  Pagination,
} from "./productTypes";
import type { Product } from "../types";

const initialLoading: ProductsLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
  toggle: false,
};

const initialErrors: ProductsErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
  toggle: null,
};

const initialState: ProductsState = {
  products: [],
  ingredients: [],
  pagination: null,
  togglingProductId: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: ProductsState,
  operation: ProductsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: ProductsState,
  operation: ProductsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProductsRequest: (state, _action: PayloadAction<GetProductsRequest | undefined>) => {
      setOperationLoading(state, "fetch");
    },
    getProductsSuccess: (
      state,
      action: PayloadAction<{
        products: any[];
        pagination: Pagination;
      }>,
    ) => {
      state.loading.fetch = false;
      state.products = mapProducts(action.payload.products || []);
      state.pagination = action.payload.pagination;
    },
    getProductsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    getIngredientsRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getIngredientsSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading.fetch = false;
      state.ingredients = mapProducts(action.payload || []);
    },
    getIngredientsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createProductRequest: (
      state,
      _action: PayloadAction<FormData>,
    ) => {
      setOperationLoading(state, "create");
    },
    createProductSuccess: (
      state,
      action: PayloadAction<{ product: any; message?: string }>,
    ) => {
      state.loading.create = false;
      if (action.payload.product) {
        state.products = [mapProduct(action.payload.product), ...state.products];
      }
      state.successMessage = action.payload.message || "Product created successfully";
    },
    createProductFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateProductRequest: (
      state,
      _action: PayloadAction<{ productId: string; formData: FormData }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateProductSuccess: (
      state,
      action: PayloadAction<{ product: any; message?: string }>,
    ) => {
      state.loading.update = false;
      if (action.payload.product) {
        const updatedProd = mapProduct(action.payload.product);
        state.products = state.products.map((p) =>
          p.id === updatedProd.id ? updatedProd : p,
        );
      }
      state.successMessage = action.payload.message || "Product updated successfully";
    },
    updateProductFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteProductRequest: (
      state,
      _action: PayloadAction<{ productId: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteProductSuccess: (
      state,
      action: PayloadAction<{ productId: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.products = state.products.filter(
        (p) => p.id !== action.payload.productId,
      );
      state.successMessage = action.payload.message || "Product deleted successfully";
    },
    deleteProductFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    toggleProductActiveRequest: (
      state,
      action: PayloadAction<{ productId: string; isActive: boolean }>,
    ) => {
      setOperationLoading(state, "toggle");
      state.togglingProductId = action.payload.productId;
    },
    toggleProductActiveSuccess: (
      state,
      action: PayloadAction<{ product: any; message?: string }>,
    ) => {
      state.loading.toggle = false;
      state.togglingProductId = null;
      if (action.payload.product) {
        const updatedProd = mapProduct(action.payload.product);
        state.products = state.products.map((p) =>
          p.id === updatedProd.id ? updatedProd : p,
        );
      }
      state.successMessage = action.payload.message || "Product availability updated";
    },
    toggleProductActiveFailure: (state, action: PayloadAction<string>) => {
      state.togglingProductId = null;
      setOperationFailure(state, "toggle", action.payload);
    },

    clearProductsError: (
      state,
      action: PayloadAction<ProductsOperation | undefined>,
    ) => {
      if (action.payload) {
        state.errors[action.payload] = null;
        return;
      }
      state.errors = { ...initialErrors };
    },
    clearProductsMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;
