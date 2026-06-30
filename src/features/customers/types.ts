export type CustomerTier = "Bronze" | "Silver" | "Gold";
export type CustomerRole = "user" | "admin" | "manager" | "subscriber";
export type CustomerSegment = "STAFF" | "VIP" | "WHOLESALE" | "RETAIL";

export interface Customer {
  id: string | number;
  name: string;
  role: CustomerRole;
  email: string;
  phone: string;
  tier: CustomerTier;
  loyaltyPoints: number;
  lifetimeValue: number;
  segment: CustomerSegment;
  createdBy?: string;
}

export interface CustomerFormData {
  tier: CustomerTier;
  loyaltyPoints: string;
}
