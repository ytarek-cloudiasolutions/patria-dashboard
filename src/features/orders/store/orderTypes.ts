import type { Order } from "../types";

export interface GetOrdersRequest {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  source?: string;
  search?: string;
  tableNumber?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  totalPages?: number;
}

export interface GetOrdersResponse {
  orders?: any[];
  data?: any[];
  pagination: Pagination;
}

export interface CreateOrderRequest {
  type: "dine_in" | "takeaway";
  source?: "application" | "pos" | "call";
  tableId?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  zone?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    notes?: string;
    selectedVariants?: {
      group: string;
      option: string;
      priceAdjustment: number;
    }[];
    selectedExtras?: {
      name: string;
      price: number;
    }[];
  }[];
  couponCode?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  order: any;
  message?: string;
}

export interface GetOrderByIdResponse {
  order: any;
}

export interface UpdateOrderResponse {
  order: any;
  message?: string;
}

export interface DeleteOrderResponse {
  message: string;
}

export type OrdersOperation = "fetch" | "create" | "update" | "delete";

export type OrdersLoadingState = Record<OrdersOperation, boolean>;
export type OrdersErrorState = Record<OrdersOperation, string | null>;

export interface OrdersState {
  orders: Order[];
  pagination: Pagination | null;
  selectedOrder: Order | null;
  loading: OrdersLoadingState;
  errors: OrdersErrorState;
  successMessage: string | null;
}
