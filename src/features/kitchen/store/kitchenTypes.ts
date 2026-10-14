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
  /** Real human-readable order number (e.g. "ORD-214067") — the backend's actual field name, same as every other order list/screen. */
  orderId?: string;
  /** Not actually present on the backend Order document; kept only so any existing caller that still sets it keeps compiling. */
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
