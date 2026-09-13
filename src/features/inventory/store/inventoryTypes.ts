import type { InventoryItem } from "../types";

export interface InventoryStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  inventoryValue: number;
}

export interface GetInventoryParams {
  warehouseId?: string;
  categoryId?: string;
  search?: string;
}

export interface GetInventoryResponse {
  products: any[];
  stats: InventoryStats;
}

export interface GetShortagesResponse {
  shortages: any[];
}

export interface UpdateStockRequest {
  quantity: number;
}

export interface BulkUpdateStockRequest {
  updates: Array<{
    id: string | number;
    quantity: number;
  }>;
}

export interface BulkStockActionItem {
  productId: string;
  quantity: number;
}

export interface BulkStockActionRequest {
  warehouseId: string;
  productIds: string[];
  mode: "set" | "add" | "infinite";
  quantity?: number;
  postOpeningBalance?: boolean;
  items?: BulkStockActionItem[];
}

export type InventoryOperation = "fetch" | "fetchShortages" | "update" | "sync";

export interface InventoryLoadingState {
  fetch: boolean;
  fetchShortages: boolean;
  update: boolean;
  sync: boolean;
}

export interface InventoryErrorState {
  fetch: string | null;
  fetchShortages: string | null;
  update: string | null;
  sync: string | null;
}

export interface InventoryState {
  items: InventoryItem[];
  shortages: InventoryItem[];
  stats: InventoryStats;
  loading: InventoryLoadingState;
  errors: InventoryErrorState;
  successMessage: string | null;
}
