export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  imageUrl: string;
  itemCount: number;
  active: boolean;
}

export interface GetCategoryResponseItem {
  _id: string;
  name: string;
  nameAr?: string;
  order: number;
  isActive: boolean;
  productsCount: number;
}

export type GetCategoriesResponse = GetCategoryResponseItem[];

export interface CreateCategoryRequest {
  name: string;
  nameAr?: string;
  image?: string;
}

export interface UpdateCategoryRequest {
  categoryId: string;
  name?: string;
  nameAr?: string;
  image?: string;
  removeImage?: boolean;
}

export interface CreateCategoryResponse {
  category: {
    _id: string;
    name: string;
    isActive: boolean;
    order: number;
    isIngredient: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface ToggleCategoryStatusRequest {
  categoryId: string;
  isActive: boolean;
}

export interface ToggleCategoryStatusResponse {
  category: {
    _id: string;
    name: string;
    isActive: boolean;
    order: number;
    updatedAt: string;
  };
}

export interface DeleteCategoryResponse {
  message: string;
}

export type CategoriesOperation = "fetch" | "create" | "update" | "toggle" | "delete";

export type CategoriesLoadingState = Record<CategoriesOperation, boolean>;
export type CategoriesErrorState = Record<CategoriesOperation, string | null>;

export interface CategoriesState {
  categories: Category[];
  togglingCategoryId: string | null;
  loading: CategoriesLoadingState;
  errors: CategoriesErrorState;
  successMessage: string | null;
}
