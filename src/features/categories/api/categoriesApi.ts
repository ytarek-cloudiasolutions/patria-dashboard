import { api } from "@/config/api";
import { CATEGORY_ENDPOINTS } from "../constants/categoryConstants";
import type {
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  ToggleCategoryStatusRequest,
  ToggleCategoryStatusResponse,
  DeleteCategoryResponse,
} from "../store/categoryTypes";

export const getCategories = async () => {
  const response = await api.get<GetCategoriesResponse>(
    CATEGORY_ENDPOINTS.CATEGORIES,
  );
  return response.data;
};

export const createCategory = async (payload: CreateCategoryRequest) => {
  const response = await api.post<CreateCategoryResponse>(
    CATEGORY_ENDPOINTS.CATEGORIES,
    payload,
  );
  return response.data;
};

export const toggleCategoryStatus = async ({
  categoryId,
  isActive,
}: ToggleCategoryStatusRequest) => {
  const response = await api.put<ToggleCategoryStatusResponse>(
    CATEGORY_ENDPOINTS.CATEGORY_BY_ID(categoryId),
    { isActive },
  );
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await api.delete<DeleteCategoryResponse>(
    CATEGORY_ENDPOINTS.CATEGORY_BY_ID(categoryId),
  );
  return response.data;
};

export const categoriesApi = {
  getCategories,
  createCategory,
  toggleCategoryStatus,
  deleteCategory,
};
