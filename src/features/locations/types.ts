export type ZoneStatus = "Active" | "Inactive";

export interface DeliveryZone {
  _id: string;
  id: string;
  name: string;
  deliveryFee: number;
  minOrderAmount: number;
  isActive: boolean;
  status: ZoneStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ZoneFormData {
  name: string;
  deliveryFee: string;
  minOrderAmount: string;
  status: ZoneStatus;
}

export interface LocationStats {
  total: number;
  active: number;
  inactive: number;
}
