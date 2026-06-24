import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesErrors,
  selectTogglingCategoryId,
  selectCategoriesSuccessMessage,
  selectCategoriesState,
} from "../store/categoriesSelectors";
import { categoriesActions } from "../store/categoriesSlice";
import type {
  CreateCategoryRequest,
  ToggleCategoryStatusRequest,
  CategoriesOperation,
} from "../store/categoryTypes";

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesState = useSelector(selectCategoriesState);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const errors = useSelector(selectCategoriesErrors);
  const togglingCategoryId = useSelector(selectTogglingCategoryId);
  const successMessage = useSelector(selectCategoriesSuccessMessage);

  const getCategories = useCallback(() => {
    dispatch(categoriesActions.getCategoriesRequest());
  }, [dispatch]);

  const createCategory = useCallback(
    (payload: CreateCategoryRequest) => {
      dispatch(categoriesActions.createCategoryRequest(payload));
    },
    [dispatch],
  );

  const toggleCategoryStatus = useCallback(
    (payload: ToggleCategoryStatusRequest) => {
      dispatch(categoriesActions.toggleCategoryStatusRequest(payload));
    },
    [dispatch],
  );

  const deleteCategory = useCallback(
    (payload: { categoryId: string }) => {
      dispatch(categoriesActions.deleteCategoryRequest(payload));
    },
    [dispatch],
  );

  const clearCategoriesError = useCallback(
    (operation?: CategoriesOperation) => {
      dispatch(categoriesActions.clearCategoriesError(operation));
    },
    [dispatch],
  );

  const clearCategoriesMessages = useCallback(() => {
    dispatch(categoriesActions.clearCategoriesMessages());
  }, [dispatch]);

  return {
    ...categoriesState,
    categories,
    loading,
    errors,
    togglingCategoryId,
    successMessage,
    getCategories,
    createCategory,
    toggleCategoryStatus,
    deleteCategory,
    clearCategoriesError,
    clearCategoriesMessages,
    isFetchingCategories: loading.fetch,
    isCreatingCategory: loading.create,
    isTogglingCategory: loading.toggle,
    isDeletingCategory: loading.delete,
  };
};
