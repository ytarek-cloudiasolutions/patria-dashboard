import type { Product } from "../types";

export interface Pagination {
  page: number;
  pages: number;
  total: number;
}

export interface GetProductsRequest {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  products: any[];
  page: number;
  pages: number;
  total: number;
}

export interface CreateProductResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    product: any;
  };
}

export interface GetProductByIdResponse {
  statusCode?: number;
  success?: boolean;
  data?: {
    product: any;
  };
  product?: any;
}

export interface UpdateProductResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    product: any;
  };
}

export interface DeleteProductResponse {
  message: string;
}

export type ProductsOperation =
  | "fetch"
  | "create"
  | "update"
  | "delete"
  | "toggle";

export type ProductsLoadingState = Record<ProductsOperation, boolean>;
export type ProductsErrorState = Record<ProductsOperation, string | null>;

export interface ProductsState {
  products: Product[];
  ingredients: Product[];
  pagination: Pagination | null;
  togglingProductId: string | null;
  loading: ProductsLoadingState;
  errors: ProductsErrorState;
  successMessage: string | null;
}
