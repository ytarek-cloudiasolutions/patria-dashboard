import type { RootState } from "@/app/store";
import type { CategoriesOperation } from "./categoryTypes";

export const selectCategoriesState = (state: RootState) => state.categories;

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export const selectCategoriesLoading = (state: RootState) =>
  state.categories.loading;

export const selectCategoriesErrors = (state: RootState) =>
  state.categories.errors;

export const selectTogglingCategoryId = (state: RootState) =>
  state.categories.togglingCategoryId;

export const selectCategoriesSuccessMessage = (state: RootState) =>
  state.categories.successMessage;

export const selectIsCategoriesOperationLoading =
  (operation: CategoriesOperation) => (state: RootState) =>
    state.categories.loading[operation];

export const selectCategoriesOperationError =
  (operation: CategoriesOperation) => (state: RootState) =>
    state.categories.errors[operation];
