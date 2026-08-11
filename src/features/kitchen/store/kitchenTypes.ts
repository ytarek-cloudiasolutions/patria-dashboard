export type KitchenOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "served";

export interface KitchenOrderItem {
  name: string;
  quantity: number;
  notes?: string;
  status?: KitchenOrderStatus;
  /** Populated product ref — fallback display name for items saved before item.name was stored. */
  productId?: { name?: string } | string;
}

export interface KitchenOrder {
  _id: string;
  orderNumber?: string;
  status: KitchenOrderStatus;
  items: KitchenOrderItem[];
  table?: string;
  customer?: string | { name?: string; phone?: string; address?: string };
  type?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetKitchenOrdersResponse {
  orders: KitchenOrder[];
}

export interface UpdateKitchenOrderStatusRequest {
  status: KitchenOrderStatus;
  itemIndex?: number;
}

export interface UpdateKitchenOrderStatusResponse {
  order: KitchenOrder;
}

export type KitchenOperation = "fetch" | "update";

export interface KitchenLoadingState {
  fetch: boolean;
  update: boolean;
}

export interface KitchenErrorState {
  fetch: string | null;
  update: string | null;
}

export interface KitchenState {
  kitchenOrders: KitchenOrder[];
  loading: KitchenLoadingState;
  errors: KitchenErrorState;
  successMessage: string | null;
}
