export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type OrderStatusFilter = "All Categories" | OrderStatus;

export type OrderCategory =
  | "All Categories"
  | "Dine-in"
  | "Delivery"
  | "Pickup";

export interface OrderLineItem {
  id: number;
  name: string;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  date: string;
  location: string;
  total: number;
  status: OrderStatus;
  category: Exclude<OrderCategory, "All Categories">;
  deliveryZone: string;
  address: string;
  paymentMethod: string;
  items: OrderLineItem[];
}
