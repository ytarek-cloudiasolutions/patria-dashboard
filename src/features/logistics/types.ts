export type DriverStatus = "Active" | "On-Route" | "Off-Duty";
export type VehicleType = "Motorcycle" | "Car" | "Van";

export interface Driver {
  id: number;
  name: string;
  whatsappPhone: string;
  vehicleType: VehicleType;
  plateNumber?: string;
  zones: string[];
  status: DriverStatus;
  /** Live-duty stats shown on the driver duty card. */
  ordersToday: number;
  salaryNow: number;
  hourlyRate: number;
  dutyTime: string;
}

export type ZoneOrderStatus = "Waiting" | "Processing" | "Cancelled";

export interface ZoneOrder {
  id: string;
  reference: string;
  customer: string;
  address: string;
  amount: number;
  status: ZoneOrderStatus;
  /** Set once the order has been dispatched to a driver. */
  assignedDriverName?: string;
}

export interface Zone {
  id: string;
  name: string;
  orders: ZoneOrder[];
}

export interface DriverFormData {
  name: string;
  whatsappPhone: string;
  password: string;
  vehicleType: VehicleType;
  plateNumber: string;
  zones: string[];
  status: DriverStatus;
}

export interface DriverNotification {
  title: string;
  message: string;
}
