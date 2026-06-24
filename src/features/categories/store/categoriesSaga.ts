import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getCategories,
  createCategory,
  toggleCategoryStatus,
  deleteCategory,
} from "../api/categoriesApi";
import { getCategoryErrorMessage } from "../utils/categoryHelpers";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { categoriesActions } from "./categoriesSlice";
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  ToggleCategoryStatusRequest,
  ToggleCategoryStatusResponse,
  DeleteCategoryResponse,
} from "./categoryTypes";

function* handleGetCategories() {
  try {
    const response: any[] = yield call(getCategories);
    yield put(categoriesActions.getCategoriesSuccess(response));
  } catch (error) {
    const errorMessage = getCategoryErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(categoriesActions.getCategoriesFailure(errorMessage));
  }
}

function* handleCreateCategory(action: PayloadAction<CreateCategoryRequest>) {
  try {
    const response: CreateCategoryResponse = yield call(
      createCategory,
      action.payload,
    );
    yield call(showSuccessToast, "Category created successfully");
    yield put(
      categoriesActions.createCategorySuccess({
        category: response.category,
        message: "Category created successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getCategoryErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(categoriesActions.createCategoryFailure(errorMessage));
  }
}

function* handleToggleCategoryStatus(
  action: PayloadAction<ToggleCategoryStatusRequest>,
) {
  try {
    const response: ToggleCategoryStatusResponse = yield call(
      toggleCategoryStatus,
      action.payload,
    );
    yield call(showSuccessToast, "Category status updated successfully");
    yield put(
      categoriesActions.toggleCategoryStatusSuccess({
        category: response.category,
        message: "Category status updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getCategoryErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(categoriesActions.toggleCategoryStatusFailure(errorMessage));
  }
}

function* handleDeleteCategory(action: PayloadAction<{ categoryId: string }>) {
  try {
    const response: DeleteCategoryResponse = yield call(
      deleteCategory,
      action.payload.categoryId,
    );
    yield call(showSuccessToast, response.message || "Category deleted successfully");
    yield put(
      categoriesActions.deleteCategorySuccess({
        categoryId: action.payload.categoryId,
        message: response.message || "Category deleted successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getCategoryErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(categoriesActions.deleteCategoryFailure(errorMessage));
  }
}

export default function* categoriesSaga() {
  yield all([
    takeLatest(categoriesActions.getCategoriesRequest.type, handleGetCategories),
    takeLatest(categoriesActions.createCategoryRequest.type, handleCreateCategory),
    takeLatest(
      categoriesActions.toggleCategoryStatusRequest.type,
      handleToggleCategoryStatus,
    ),
    takeLatest(categoriesActions.deleteCategoryRequest.type, handleDeleteCategory),
  ]);
}
