export type ZoneStatus = "Active" | "Inactive";

export interface DeliveryZone {
  _id: string;
  id: string;
  name: string;
  deliveryFee: number;
  minOrderAmount: number;
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
  radiusKm: string;
}

export interface LocationStats {
  total: number;
  active: number;
  inactive: number;
}
