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
    // Empty/unset on the backend means "never customized" — fall back to
    // the role's default set rather than showing nothing.
    pages: u.pages && u.pages.length > 0 ? u.pages : ROLE_DEFAULT_PAGES[role] || [],
    backupWarehouseId: u.backupWarehouseId?._id || u.backupWarehouseId || "",
    virtualShift: u.virtualShift || "none",
    _type: u._type || "staff",
    lifetimeValue: u.lifetimeValue || 0,
    isActive: u.isActive !== undefined ? u.isActive : true,
    totalOrders: u.totalOrders || 0,
    totalPurchases: u.totalPurchases || 0,
  };
};

export const mapUserAccounts = (users: any[]): UserAccount[] => {
  return (users || []).map(mapUserAccount);
};
