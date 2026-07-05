import type { UserAccount, UserRole } from "../types";
import { ROLE_DEFAULT_PAGES } from "../data";

export const mapUserRole = (role: string): UserRole => {
  const norm = (role || "").toLowerCase();
  if (
    norm === "superadmin" ||
    norm === "admin" ||
    norm === "manager" ||
    norm === "cashier" ||
    norm === "kitchen" ||
    norm === "staff"
  ) {
    return norm as UserRole;
  }
  return "staff";
};

export const mapUserAccount = (u: any): UserAccount => {
  const role = mapUserRole(u.role);
  return {
    id: u._id || u.id,
    name: u.name || "",
    email: u.email || "",
    phone: u.phone || "",
    role,
    pages: ROLE_DEFAULT_PAGES[role] || [],
  };
};

export const mapUserAccounts = (users: any[]): UserAccount[] => {
  return (users || []).map(mapUserAccount);
};
