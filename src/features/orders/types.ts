export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "On The Way"
  | "Delivered"
  | "Cancelled";

export type OrderSource = "application" | "pos";

export type OrderStatusFilter = "All Categories" | OrderStatus;

export type OrderCategory =
  | "All Categories"
  | "Sandwiches"
  | "Coffee"
  | "Bakery"
  | "Meals";

export type PaymentState = "Paid" | "Waiting for payment" | "None";

export interface OrderLineItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  date: string;
  time: string;
  total: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  status: OrderStatus;
  category: Exclude<OrderCategory, "All Categories">;
  source: OrderSource;
  paymentMethod: string;
  paymentState: PaymentState;
  items: OrderLineItem[];
}

export interface OrdersSummary {
  revenue: number;
  totalOrders: number;
  pending: number;
  delivered: number;
}

export interface ProductOption {
  id: number;
  name: string;
  unitPrice: number;
  category: Exclude<OrderCategory, "All Categories">;
}
