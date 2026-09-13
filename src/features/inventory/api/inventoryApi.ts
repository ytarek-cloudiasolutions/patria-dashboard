import { api } from "@/config/api";
import { INVENTORY_ENDPOINTS } from "../constants/inventoryConstants";
import type {
  GetInventoryParams,
  GetInventoryResponse,
  GetShortagesResponse,
  UpdateStockRequest,
  BulkUpdateStockRequest,
} from "../store/inventoryTypes";

export const getInventory = async (
  paramsOrWarehouseId?: GetInventoryParams | string,
) => {
  const params =
    typeof paramsOrWarehouseId === "string"
      ? { warehouseId: paramsOrWarehouseId }
      : paramsOrWarehouseId;

  const queryParams: Record<string, string> = {};
  if (params?.warehouseId) queryParams.warehouseId = params.warehouseId;
  if (params?.categoryId) queryParams.categoryId = params.categoryId;
  if (params?.search) queryParams.search = params.search;

  const response = await api.get<GetInventoryResponse>(
    INVENTORY_ENDPOINTS.INVENTORY,
    { params: Object.keys(queryParams).length > 0 ? queryParams : undefined },
  );
  return response.data;
};

export const getShortages = async () => {
  const response = await api.get<GetShortagesResponse>(
    INVENTORY_ENDPOINTS.SHORTAGES,
  );
  return response.data;
};

export const synchronizeInventory = async () => {
  const response = await api.post<{ message: string; updated: number }>(
    INVENTORY_ENDPOINTS.SYNCHRONIZE,
  );
  return response.data;
};

export const updateStock = async (id: string, data: UpdateStockRequest) => {
  const response = await api.put<{ message: string }>(
    INVENTORY_ENDPOINTS.STOCK(id),
    data,
  );
  return response.data;
};

export const bulkUpdateStock = async (data: BulkUpdateStockRequest) => {
  const response = await api.put<{ message: string }>(
    INVENTORY_ENDPOINTS.BULK_UPDATE,
    data,
  );
  return response.data;
};

export const inventoryApi = {
  getInventory,
  getShortages,
  synchronizeInventory,
  updateStock,
  bulkUpdateStock,
};
