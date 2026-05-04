export interface AccountFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  shipmentAddress: string;
}

export interface AccountSettingsProps {
  data: AccountFormData;
  onSave: (data: AccountFormData) => void;
}

export interface OrderStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  badgeColor: string;
  iconColor: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Delivered"
  | "On the Way"
  | "Cancelled";

export interface Order {
  orderNo: string;
  customer: string;
  date: string;
  status: OrderStatus;
  total: string | null;
}

export interface OrderReportsData {
  dateFrom: string;
  dateTo: string;
  stats: OrderStat[];
  orders: Order[];
  totalInPeriod: number;
}