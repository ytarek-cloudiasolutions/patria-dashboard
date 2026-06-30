import type { Customer, CustomerTier, CustomerSegment, CustomerRole } from "../types";

export const mapTier = (tier: string): CustomerTier => {
  const norm = (tier || "").toLowerCase();
  if (norm === "gold") return "Gold";
  if (norm === "silver") return "Silver";
  return "Bronze";
};

export const mapCustomerSegment = (segment?: string): CustomerSegment => {
  const norm = (segment || "").toUpperCase();
  if (norm === "STAFF" || norm === "VIP" || norm === "WHOLESALE") {
    return norm;
  }
  return "RETAIL";
};

export const mapCustomerRole = (role?: string): CustomerRole => {
  const norm = (role || "").toLowerCase();
  if (norm === "admin" || norm === "manager" || norm === "subscriber") {
    return norm;
  }
  return "user";
};

export const mapCustomer = (c: any): Customer => {
  return {
    id: c._id || c.id,
    name: c.name || "",
    role: mapCustomerRole(c.role),
    email: c.email || "",
    phone: c.phone || "",
    tier: mapTier(c.tier || ""),
    loyaltyPoints: c.loyaltyPoints ?? 0,
    lifetimeValue: c.lifetimeValue ?? c.totalLTV ?? 0,
    segment: mapCustomerSegment(c.segment),
    createdBy: c.createdBy,
  };
};

export const mapCustomers = (customers: any[]): Customer[] => {
  return (customers || []).map(mapCustomer);
};
