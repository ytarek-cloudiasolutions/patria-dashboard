export type WarehouseType = "Main Warehouse" | "Sub Warehouse";

export type TransferStatus = "Pending" | "Approved" | "Rejected";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  type: WarehouseType;
}

export interface TransferItem {
  id: string;
  productSku: string;
  quantity: number;
}

export interface Transfer {
  id: string;
  from: string;
  to: string;
  items: number;
  date: string;
  status: TransferStatus;
}

export interface AddWarehouseFormData {
  name: string;
  type: WarehouseType;
  address: string;
}

export interface InternalTransferFormData {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  items: TransferItem[];
}