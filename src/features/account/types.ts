export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Delivered"
  | "On the Way"
  | "Cancelled";

export interface OrderReport {
  id: number;
  orderNo: string;
  customer: string;
  date: string;
  status: OrderStatus;
  total: number | null;
}

export interface AccountFormData {
  fullName: string;
  email: string;
  phone: string;
  shipmentAddress: string;
}

export interface AccountDateRange {
  from: string;
  to: string;
}
