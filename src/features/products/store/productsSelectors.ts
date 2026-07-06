import type { RootState } from "@/app/store";
import type { ProductsOperation } from "./productTypes";

export const selectProductsState = (state: RootState) => state.products;

export const selectProducts = (state: RootState) => state.products.products;

export const selectProductsPagination = (state: RootState) =>
  state.products.pagination;

export const selectProductsLoading = (state: RootState) =>
  state.products.loading;

export const selectProductsErrors = (state: RootState) => state.products.errors;

export const selectTogglingProductId = (state: RootState) =>
  state.products.togglingProductId;

export const selectProductsSuccessMessage = (state: RootState) =>
  state.products.successMessage;

export const selectIsProductsOperationLoading =
  (operation: ProductsOperation) => (state: RootState) =>
    state.products.loading[operation];

export const selectProductsOperationError =
  (operation: ProductsOperation) => (state: RootState) =>
    state.products.errors[operation];
