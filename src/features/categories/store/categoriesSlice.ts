import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mapCategory, mapCategories } from "../utils/categoryMappers";
import type {
  CategoriesState,
  CategoriesLoadingState,
  CategoriesErrorState,
  CategoriesOperation,
  Category,
  CreateCategoryRequest,
  ToggleCategoryStatusRequest,
} from "./categoryTypes";

const initialLoading: CategoriesLoadingState = {
  fetch: false,
  create: false,
  update: false,
  toggle: false,
  delete: false,
};

const initialErrors: CategoriesErrorState = {
  fetch: null,
  create: null,
  update: null,
  toggle: null,
  delete: null,
};

const initialState: CategoriesState = {
  categories: [],
  togglingCategoryId: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: CategoriesState,
  operation: CategoriesOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: CategoriesState,
  operation: CategoriesOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCategoriesRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getCategoriesSuccess: (
      state,
      action: PayloadAction<any[]>,
    ) => {
      state.loading.fetch = false;
      state.categories = mapCategories(action.payload || []);
    },
    getCategoriesFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createCategoryRequest: (
      state,
      _action: PayloadAction<CreateCategoryRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createCategorySuccess: (
      state,
      action: PayloadAction<{ category: any; message?: string }>,
    ) => {
      state.loading.create = false;
      if (action.payload.category) {
        state.categories = [...state.categories, mapCategory(action.payload.category)];
      }
      state.successMessage = action.payload.message || "Category created successfully";
    },
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateCategoryRequest: (
      state,
      _action: PayloadAction<{ categoryId: string; data: any }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateCategorySuccess: (
      state,
      action: PayloadAction<{ category: any; message?: string }>,
    ) => {
      state.loading.update = false;
      if (action.payload.category) {
        const updatedCat = mapCategory(action.payload.category);
        state.categories = state.categories.map((c) =>
          c.id === updatedCat.id ? { ...c, ...updatedCat } : c,
        );
      }
      state.successMessage = action.payload.message || "Category updated successfully";
    },
    updateCategoryFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    toggleCategoryStatusRequest: (
      state,
      action: PayloadAction<ToggleCategoryStatusRequest>,
    ) => {
      setOperationLoading(state, "toggle");
      state.togglingCategoryId = action.payload.categoryId;
    },
    toggleCategoryStatusSuccess: (
      state,
      action: PayloadAction<{ category: any; message?: string }>,
    ) => {
      state.loading.toggle = false;
      state.togglingCategoryId = null;
      if (action.payload.category) {
        const updatedCat = mapCategory(action.payload.category);
        state.categories = state.categories.map((c) =>
          c.id === updatedCat.id ? { ...c, active: updatedCat.active } : c,
        );
      }
      state.successMessage = action.payload.message || "Category status updated successfully";
    },
    toggleCategoryStatusFailure: (state, action: PayloadAction<string>) => {
      state.togglingCategoryId = null;
      setOperationFailure(state, "toggle", action.payload);
    },

    deleteCategoryRequest: (
      state,
      _action: PayloadAction<{ categoryId: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteCategorySuccess: (
      state,
      action: PayloadAction<{ categoryId: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload.categoryId,
      );
      state.successMessage = action.payload.message || "Category deleted successfully";
    },
    deleteCategoryFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearCategoriesError: (
      state,
      action: PayloadAction<CategoriesOperation | undefined>,
    ) => {
      if (action.payload) {
        state.errors[action.payload] = null;
        return;
      }
      state.errors = { ...initialErrors };
    },
    clearCategoriesMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;
