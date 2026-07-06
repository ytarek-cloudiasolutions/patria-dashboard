export type RiderStatus = "On-Route" | "Active" | "Delivered";

export type OrderStatus =
  | "Order Placed"
  | "Preparing"
  | "On The Way"
  | "Assigned"
  | "Delivered";

export type VehicleType = "Motorcycle" | "Car" | "Van";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: number;
  customer: string;
  address: string;
  zone: string;
  amount: number;
  itemCount: number;
  status: OrderStatus;
  estimatedTime: string;
}

export interface Rider {
  id: number;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  plateNumber: string;
  status: RiderStatus;
  zone: string;
  activeOrders: DeliveryOrder[];
  totalDelivered: number;
  dutyTime: string;
}
