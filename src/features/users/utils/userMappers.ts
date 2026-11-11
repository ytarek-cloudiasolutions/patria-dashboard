import type { UserAccount, UserRole } from "../types";
import { ALL_PERMISSION_PAGES, ROLE_DEFAULT_PAGES } from "../data";
import type { PermissionPage } from "../types";

const LEGACY_PERMISSION_PAGES: Record<string, PermissionPage[]> = {
  Home: ["Dashboard"],
  "Order Management": ["Orders"],
  "Product Catalog": ["Products"],
  "Customer Base": ["Customers"],
  "Offers & Discounts": ["Offers", "Coupons"],
  Profile: ["My Account"],
  "General Settings": ["Settings"],
  "Branches & Locations": ["Locations"],
};

const normalizePermissionPages = (pages: unknown): PermissionPage[] => {
  if (!Array.isArray(pages)) return [];

  return pages.flatMap((page): PermissionPage[] => {
    if (typeof page !== "string") return [];
    const legacyPages = LEGACY_PERMISSION_PAGES[page];
    if (legacyPages) return legacyPages;
    return ALL_PERMISSION_PAGES.filter((knownPage) => knownPage === page);
  });
};

export const mapUserRole = (role: string): UserRole => {
  const norm = (role || "").toLowerCase();
  if (
    norm === "superadmin" ||
    norm === "admin" ||
    norm === "manager" ||
    norm === "marketing" ||
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
  const pages = normalizePermissionPages(u.pages);
  return {
    id: u._id || u.id,
    name: u.name || "",
    email: u.email || "",
    phone: u.phone || "",
    role,
    // Empty/unset on the backend means "never customized" — fall back to
    // the role's default set rather than showing nothing.
    pages: pages.length > 0 ? pages : ROLE_DEFAULT_PAGES[role],
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
