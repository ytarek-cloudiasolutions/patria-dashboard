export type VehicleType = "motorcycle" | "car" | "van" | "bicycle";
export type DriverStatus = "active" | "offline" | "busy";

export interface Driver {
  _id: string;
  name: string;
  whatsappPhone?: string;
  phone?: string;
  vehicleType?: VehicleType | string;
  plateNumber?: string;
  zones: string[];
  status: DriverStatus | string;
  isActive: boolean;
  isOnShift?: boolean;
  shiftDeliveriesCount?: number;
  totalDelivered?: number;
  dutyTime?: string;
  activeOrders?: any[];
  currentOrderId?: any;
}

export interface LogisticsStats {
  activeDrivers: number;
  offlineDrivers: number;
  busyDrivers: number;
  waitingOrders: number;
}

export interface DriversByZoneItem {
  zone: string;
  drivers: Driver[];
}

export interface GetDriversResponse {
  drivers: Driver[];
  driversByZone: DriversByZoneItem[];
  stats: LogisticsStats;
}

export interface CreateDriverRequest {
  name: string;
  whatsappPhone?: string;
  phone?: string;
  password?: string;
  vehicleType?: VehicleType;
  plateNumber?: string;
  zones?: string[];
  status?: DriverStatus;
}

export interface UpdateDriverRequest {
  name?: string;
  whatsappPhone?: string;
  phone?: string;
  password?: string;
  vehicleType?: VehicleType;
  plateNumber?: string;
  zones?: string[];
  status?: DriverStatus;
  isActive?: boolean;
}

export type LogisticsOperation = "fetch" | "create" | "update" | "delete";

export interface LogisticsLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface LogisticsErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export interface LogisticsState {
  drivers: Driver[];
  driversByZone: DriversByZoneItem[];
  stats: LogisticsStats;
  loading: LogisticsLoadingState;
  errors: LogisticsErrorState;
  successMessage: string | null;
}
