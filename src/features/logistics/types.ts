export type OrderStatus = "pending" | "omnia";

export type VehicleType = "Motorcycle" | "Car" | "Van";

export type DriverStatus = "Active" | "Inactive";

export interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
}

export interface Zone {
  id: number;
  name: string;
  totalOrders: number;
  orders: Order[];
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: VehicleType;
  zones: string[];
  status: DriverStatus;
}

export interface AddDriverFormData {
  name: string;
  phone: string;
  vehicle: VehicleType;
  status: DriverStatus;
}

export interface OverviewCardData {
  label: string;
  value: number;
  iconBg: string;
}

export interface DispatchPayload {
  zone: Zone;
  driverId: number;
}