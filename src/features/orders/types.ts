export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface OrderRow {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  location: string;
  total: string;
  status: OrderStatus;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

export interface OrderDetails extends OrderRow {
  customerLocation: string;
  paymentType: string;
  items: OrderItem[];
}
