import { api } from "@/config/api";
import type {
  GetWarehousesResponse,
  GetTransfersResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateTransferRequest,
  UpdateTransferStatusRequest,
  Warehouse,
  Transfer,
} from "../store/warehousesTypes";

const BASE = "/warehouses";

export const getWarehouses = async (): Promise<GetWarehousesResponse> => {
  const response = await api.get<GetWarehousesResponse>(BASE);
  return response.data;
};

export const createWarehouse = async (
  data: CreateWarehouseRequest,
): Promise<{ warehouse: Warehouse }> => {
  const response = await api.post<{ warehouse: Warehouse }>(BASE, data);
  return response.data;
};

export const updateWarehouse = async (
  id: string,
  data: UpdateWarehouseRequest,
): Promise<{ warehouse: Warehouse }> => {
  const response = await api.put<{ warehouse: Warehouse }>(
    `${BASE}/${id}`,
    data,
  );
  return response.data;
};

export const deleteWarehouse = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`${BASE}/${id}`);
  return response.data;
};

export const getTransfers = async (): Promise<GetTransfersResponse> => {
  const response = await api.get<GetTransfersResponse>(`${BASE}/transfers`);
  return response.data;
};

export const createTransfer = async (
  data: CreateTransferRequest,
): Promise<{ transfer: Transfer }> => {
  const response = await api.post<{ transfer: Transfer }>(
    `${BASE}/transfers`,
    data,
  );
  return response.data;
};

export const updateTransferStatus = async (
  id: string,
  data: UpdateTransferStatusRequest,
): Promise<{ transfer: Transfer }> => {
  const response = await api.patch<{ transfer: Transfer }>(
    `${BASE}/transfers/${id}/status`,
    data,
  );
  return response.data;
};

export const warehousesApi = {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getTransfers,
  createTransfer,
  updateTransferStatus,
};

export default warehousesApi;
