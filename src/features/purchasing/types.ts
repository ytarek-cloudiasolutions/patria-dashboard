export type PoStatus = "Paid" | "Unpaid" | "Pending" | "Canceled";

export interface PoLineItem {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string | number;
  poNumber: string;
  kind: "purchase order";
  supplierId: string;
  supplierName: string;
  contactEmail: string;
  warehouseId: string;
  warehouseName: string;
  totalAmount: number;
  paid: number;
  status: PoStatus;
  rawStatus?: string;
  paymentStatus?: "unpaid" | "partial" | "paid" | string;
  expectedDeliveryDate: string;
  items: PoLineItem[];
}

export interface SupplierOption {
  id: string;
  label: string;
  email: string;
}

export interface WarehouseOption {
  id: string;
  label: string;
}

export interface ProductOption {
  id: string;
  label: string;
  defaultCost: number;
}

export interface PoFormState {
  supplierId: string;
  warehouseId: string;
  expectedDeliveryDate: string;
  items: PoLineItem[];
}
