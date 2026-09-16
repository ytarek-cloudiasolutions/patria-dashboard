export type ZoneStatus = "Active" | "Inactive";

export interface ZonePoint {
  lat: number;
  lng: number;
}

export interface DeliveryZone {
  _id: string;
  id: string;
  name: string;
  nameAr?: string;
  deliveryFee: number;
  minOrder?: number;
  minOrderAmount: number;
  estimatedMinutes?: number;
  polygon?: ZonePoint[];
  isActive: boolean;
  status: ZoneStatus;
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ZoneFormData {
  name: string;
  deliveryFee: string;
  minOrderAmount: string;
  status: ZoneStatus;
  centerLat?: number;
  centerLng?: number;
  polygon: ZonePoint[];
  radiusKm?: string;
}

export interface LocationStats {
  total: number;
  active: number;
  inactive: number;
}
