import type { Customer, CustomerTier, CustomerSegment, CustomerRole, CustomerGender } from "../types";

interface CustomerApiRecord {
  _id?: string | number;
  id?: string | number;
  name?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  tier?: string | null;
  loyaltyPoints?: number | null;
  lifetimeValue?: number | null;
  totalLTV?: number | null;
  orderCount?: number | null;
  segment?: string | null;
  createdBy?: string | null;
  gender?: string | null;
  age?: number | string | null;
  dateOfBirth?: string | null;
}

export const mapCustomerGender = (gender?: string | null): CustomerGender | null =>
  gender === "male" || gender === "female" ? gender : null;

export const mapCustomerAge = (
  age?: number | string | null,
  dateOfBirth?: string | null,
): number | null => {
  if (typeof age === "number") {
    if (Number.isInteger(age) && age >= 0) return age;
  }
  if (typeof age === "string" && age.trim() !== "") {
    const parsedAge = Number(age);
    if (Number.isInteger(parsedAge) && parsedAge >= 0) return parsedAge;
  }
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let calculatedAge = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const hasHadBirthday =
    today.getUTCMonth() > birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() &&
      today.getUTCDate() >= birthDate.getUTCDate());

  if (!hasHadBirthday) calculatedAge -= 1;
  return calculatedAge >= 0 ? calculatedAge : null;
};

export const mapTier = (tier: string): CustomerTier => {
  const norm = (tier || "").toLowerCase();
  if (norm === "gold") return "Gold";
  if (norm === "silver") return "Silver";
  return "Bronze";
};

export const mapCustomerSegment = (segment?: string | null): CustomerSegment => {
  const norm = (segment || "").toUpperCase();
  if (norm === "STAFF" || norm === "VIP" || norm === "WHOLESALE") {
    return norm;
  }
  return "RETAIL";
};

export const mapCustomerRole = (role?: string | null): CustomerRole => {
  const norm = (role || "").toLowerCase();
  if (norm === "admin" || norm === "manager" || norm === "subscriber") {
    return norm;
  }
  return "user";
};

export const mapCustomer = (c: CustomerApiRecord): Customer => {
  return {
    id: c._id || c.id || "",
    name: c.name || "",
    role: mapCustomerRole(c.role),
    email: c.email || "",
    phone: c.phone || "",
    tier: mapTier(c.tier || ""),
    loyaltyPoints: c.loyaltyPoints ?? 0,
    lifetimeValue: c.lifetimeValue ?? c.totalLTV ?? 0,
    orderCount: c.orderCount ?? 0,
    segment: mapCustomerSegment(c.segment),
    createdBy: c.createdBy ?? undefined,
    gender: mapCustomerGender(c.gender),
    age: mapCustomerAge(c.age, c.dateOfBirth),
  };
};

export const mapCustomers = (customers: CustomerApiRecord[]): Customer[] => {
  return (customers || []).map(mapCustomer);
};
