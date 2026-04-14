export type LocationStatus = "available" | "inactive";

export interface Location {
  id: string;
  name: string;
  deliveryFee: number;
  minOrderAmount: number;
  status: LocationStatus;
}
