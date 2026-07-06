export type PurchaseOrderStatus = "draft" | "submitted" | "received" | "cancelled";

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface ApiPurchaseOrder {
  _id: string;
  poNumber: string;
  supplierId: string | Record<string, unknown>;
  warehouseId: string | Record<string, unknown>;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface GetPurchaseOrdersRequest {
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetPurchaseOrdersResponse {
  data: ApiPurchaseOrder[];
  pagination?: Pagination;
}

export interface CreatePurchaseOrderRequest {
  supplierId: string;
  warehouseId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

export interface CreatePurchaseOrderResponse {
  purchaseOrder: ApiPurchaseOrder;
}

export interface PurchaseOrderActionResponse {
  purchaseOrder: ApiPurchaseOrder;
}

export type PurchasingOperation = "fetch" | "create" | "submit" | "cancel";

export interface PurchasingLoadingState {
  fetch: boolean;
  create: boolean;
  submit: boolean;
  cancel: boolean;
}

export interface PurchasingErrorState {
  fetch: string | null;
  create: string | null;
  submit: string | null;
  cancel: string | null;
}

export interface PurchasingState {
  purchaseOrders: ApiPurchaseOrder[];
  pagination: Pagination | null;
  loading: PurchasingLoadingState;
  errors: PurchasingErrorState;
  successMessage: string | null;
}
