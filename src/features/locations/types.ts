export type ZoneStatus = "Active" | "Inactive";

export interface DeliveryZone {
  id: number;
  name: string;
  deliveryFee: number;
  minOrderAmount: number;
  status: ZoneStatus;
}

export interface ZoneFormData {
  name: string;
  deliveryFee: string;
  minOrderAmount: string;
  status: ZoneStatus;
}
