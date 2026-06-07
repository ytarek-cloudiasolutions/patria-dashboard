export type WarehouseKind = "Main Warehouse" | "Sub Warehouse";

export interface Warehouse {
  id: string;
  shortId: string;
  name: string;
  address: string;
  kind: WarehouseKind;
}

export type TransferStatus = "Pending" | "Approved" | "Rejected" | "Completed";

export interface TransferLineItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface InternalTransfer {
  id: number;
  reference: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  items: TransferLineItem[];
  createdAt: string;
  status: TransferStatus;
}

export interface WarehouseFormData {
  name: string;
  kind: WarehouseKind;
  address: string;
}

export interface TransferFormState {
  fromId: string;
  toId: string;
  items: TransferLineItem[];
}
