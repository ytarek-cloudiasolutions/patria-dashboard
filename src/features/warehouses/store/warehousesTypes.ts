export type WarehouseType = "main" | "sub";
export type TransferStatus = "pending" | "approved" | "completed" | "rejected";

export interface WarehouseManager {
  name: string;
  email: string;
}

export interface Warehouse {
  _id: string;
  warehouseId: string;
  name: string;
  type: WarehouseType;
  address?: string;
  manager?: WarehouseManager | string;
  isActive: boolean;
}

export interface TransferProduct {
  productId: string;
  quantity: number;
}

export interface PopulatedWarehouseRef {
  _id: string;
  name: string;
}

export interface Transfer {
  _id: string;
  fromWarehouseId: PopulatedWarehouseRef;
  toWarehouseId: PopulatedWarehouseRef;
  products: TransferProduct[];
  status: TransferStatus;
  notes?: string;
  transferredBy?: string;
}

export interface GetWarehousesResponse {
  warehouses: Warehouse[];
  mainWarehouses: Warehouse[];
  subWarehouses: Warehouse[];
}

export interface GetTransfersResponse {
  transfers: Transfer[];
}

export interface CreateWarehouseRequest {
  name: string;
  type?: WarehouseType;
  address?: string;
  manager?: string;
}

export interface UpdateWarehouseRequest {
  name?: string;
  type?: WarehouseType;
  address?: string;
  manager?: string;
  isActive?: boolean;
}

export interface CreateTransferRequest {
  fromWarehouseId: string;
  toWarehouseId: string;
  products: TransferProduct[];
  notes?: string;
}

export interface UpdateTransferStatusRequest {
  status: "approved" | "completed" | "rejected";
}

export type WarehousesOperation =
  | "fetch"
  | "create"
  | "update"
  | "delete"
  | "fetchTransfers"
  | "createTransfer"
  | "updateTransferStatus";

export interface WarehousesLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  fetchTransfers: boolean;
  createTransfer: boolean;
  updateTransferStatus: boolean;
}

export interface WarehousesErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  fetchTransfers: string | null;
  createTransfer: string | null;
  updateTransferStatus: string | null;
}

export interface WarehousesState {
  warehouses: Warehouse[];
  mainWarehouses: Warehouse[];
  subWarehouses: Warehouse[];
  transfers: Transfer[];
  loading: WarehousesLoadingState;
  errors: WarehousesErrorState;
  successMessage: string | null;
}
