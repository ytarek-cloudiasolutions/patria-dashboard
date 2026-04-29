// types.ts
export type POStatus = "Paid" | "Unpaid" | "Pending" | "Cancelled";

export interface LineItem {
  id: string;
  productSku: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  type: string;
  supplier: string;
  contactEmail: string;
  destination: string;
  totalAmount: number;
  paid: number;
  status: POStatus;
}

export interface POFormData {
  supplierId: string;
  warehouse: string;
  expectedDeliveryDate: string;
  lineItems: LineItem[];
}

export interface ProcurementOverview {
  totalPurchases: string;
  pendingRequests: number;
  requestsReceived: number;
  cancelled: number;
}