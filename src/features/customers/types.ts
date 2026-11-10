export type CustomerTier = "Bronze" | "Silver" | "Gold";
export type CustomerRole = "user" | "admin" | "manager" | "subscriber";
export type CustomerSegment = "STAFF" | "VIP" | "WHOLESALE" | "RETAIL";
export type CustomerGender = "male" | "female";

export interface Customer {
  id: string | number;
  name: string;
  role: CustomerRole;
  email: string;
  phone: string;
  tier: CustomerTier;
  loyaltyPoints: number;
  lifetimeValue: number;
  orderCount: number;
  segment: CustomerSegment;
  createdBy?: string;
  gender: CustomerGender | null;
  age: number | null;
}

export interface CustomerFormData {
  tier: CustomerTier;
  loyaltyPoints: string;
}
