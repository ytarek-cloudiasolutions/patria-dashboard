import { api } from "@/config/api";
import { INVENTORY_ENDPOINTS } from "../constants/inventoryConstants";
import type {
  GetInventoryParams,
  GetInventoryResponse,
  GetShortagesResponse,
  UpdateStockRequest,
  BulkUpdateStockRequest,
  BulkStockActionRequest,
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

export const bulkStockAction = async (data: BulkStockActionRequest) => {
  const payload: Record<string, any> = {
    warehouseId: data.warehouseId,
    productIds: data.productIds,
    mode: data.mode,
  };
  if (data.mode !== "infinite" && data.quantity !== undefined) {
    payload.quantity = data.quantity;
  }
  if (data.items && data.items.length > 0) {
    payload.items = data.items;
  }
  if (data.postOpeningBalance !== undefined) {
    payload.postOpeningBalance = data.postOpeningBalance;
  }

  const response = await api.post<{ message: string }>(
    INVENTORY_ENDPOINTS.BULK_STOCK_ACTION,
    payload,
  );
  return response.data;
};

export const inventoryApi = {
  getInventory,
  getShortages,
  synchronizeInventory,
  updateStock,
  bulkUpdateStock,
  bulkStockAction,
};
