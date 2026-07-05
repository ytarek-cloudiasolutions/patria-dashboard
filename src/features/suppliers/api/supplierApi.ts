import { api } from "@/config/api";
import { SUPPLIER_ENDPOINTS } from "../constants/supplierConstants";
import type {
  GetSuppliersResponse,
  CreateSupplierRequest,
} from "../store/supplierTypes";

export const getSuppliers = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get<GetSuppliersResponse>(
    SUPPLIER_ENDPOINTS.SUPPLIERS,
    { params },
  );
  return response.data;
};

export const createSupplier = async (data: CreateSupplierRequest) => {
  const response = await api.post<{ supplier: any }>(
    SUPPLIER_ENDPOINTS.SUPPLIERS,
    data,
  );
  return response.data;
};

export const updateSupplier = async (id: string, data: Partial<CreateSupplierRequest>) => {
  const response = await api.put<{ supplier: any }>(
    SUPPLIER_ENDPOINTS.SUPPLIER_BY_ID(id),
    data,
  );
  return response.data;
};

export const deleteSupplier = async (id: string) => {
  const response = await api.delete<{ message: string }>(
    SUPPLIER_ENDPOINTS.SUPPLIER_BY_ID(id),
  );
  return response.data;
};

export const supplierApi = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
export default supplierApi;
