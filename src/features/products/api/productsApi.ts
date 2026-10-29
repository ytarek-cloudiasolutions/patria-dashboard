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
  // This used to default `includeInactive: true` for EVERY call to this
  // wrapper — meaning every product list anywhere in the app (the main
  // Products tab, the Ingredients/Recipes tab, search, pagination, all of
  // it) always asked the backend to include soft-deleted products
  // regardless, completely bypassing the backend's own exclusion of them.
  // A deleted product never actually stopped showing up — it looked
  // exactly like "delete doesn't work". The two call sites that genuinely
  // need to see deactivated products (the Availability modal, and the
  // Ingredients dialog's picker) already pass `includeInactive: true`
  // explicitly themselves, so nothing here needs a default at all.
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

export const toggleProductStatus = async (productId: string) => {
  const response = await api.patch<UpdateProductResponse>(
    PRODUCT_ENDPOINTS.TOGGLE(productId),
  );
  return response.data;
};

export const scanProductByBarcode = async (code: string) => {
  const response = await api.get<any>(
    PRODUCT_ENDPOINTS.SCAN_BY_BARCODE(code),
  );
  return response.data;
};

export const productsApi = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  scanProductByBarcode,
};

