import { api } from "@/config/api";
import { PRODUCT_ENDPOINTS } from "../constants/productConstants";
import type {
  GetProductsRequest,
  GetProductsResponse,
  CreateProductResponse,
  GetProductByIdResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from "../store/productTypes";

export const getProducts = async (params?: GetProductsRequest) => {
  const response = await api.get<GetProductsResponse>(
    PRODUCT_ENDPOINTS.PRODUCTS,
    { params },
  );
  return response.data;
};

export const createProduct = async (formData: FormData) => {
  const response = await api.post<CreateProductResponse>(
    PRODUCT_ENDPOINTS.PRODUCTS,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getProductById = async (productId: string) => {
  const response = await api.get<GetProductByIdResponse>(
    PRODUCT_ENDPOINTS.PRODUCT_BY_ID(productId),
  );
  return response.data;
};

export const updateProduct = async (productId: string, formData: FormData) => {
  const response = await api.put<UpdateProductResponse>(
    PRODUCT_ENDPOINTS.PRODUCT_BY_ID(productId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await api.delete<DeleteProductResponse>(
    PRODUCT_ENDPOINTS.PRODUCT_BY_ID(productId),
  );
  return response.data;
};

export const productsApi = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
