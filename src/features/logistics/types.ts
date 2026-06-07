export type DriverStatus = "Active" | "Inactive";
export type VehicleType = "Motorcycle" | "Car" | "Van";

export interface Driver {
  id: number;
  name: string;
  whatsappPhone: string;
  vehicleType: VehicleType;
  zones: string[];
  status: DriverStatus;
}

export type OrderStatus = "Pending" | "Assigned";

export interface ZoneOrder {
  id: string;
  reference: string;
  customer: string;
  status: OrderStatus;
  assignedDriverId?: number;
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
  vehicleType: VehicleType;
  status: DriverStatus;
}
