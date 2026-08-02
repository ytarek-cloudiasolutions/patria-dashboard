import type { UserRole } from "@/features/users/types";

const ALL_ROLES: UserRole[] = [
  "superadmin",
  "admin",
  "manager",
  "cashier",
  "kitchen",
  "staff",
];

/**
 * Maps each dashboard route path to the roles allowed to see/use it.
 * Mirrors the authorize() role sets enforced on the backend routes so the
 * dashboard UI (nav + routing) matches what the API will actually allow.
 * A path with no entry here is treated as open to any authenticated role.
 */
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  "/": ALL_ROLES,
  "/account": ALL_ROLES,
  "/pos": ["cashier", "staff", "admin", "manager", "superadmin"],
  "/orders": ["cashier", "staff", "kitchen", "admin", "manager", "superadmin"],
  "/tables": ["cashier", "admin", "manager", "superadmin"],
  "/kitchen": ["kitchen", "admin", "manager", "superadmin"],
  "/products": ALL_ROLES,
  "/offers": ["admin", "manager", "superadmin"],
  "/coupons": ["admin", "manager", "superadmin"],
  "/customers": ["cashier", "admin", "manager", "superadmin"],
  "/suppliers": ["admin", "manager", "superadmin"],
  "/purchasing": ["admin", "manager", "superadmin"],
  "/warehouses": ["admin", "manager", "superadmin"],
  "/inventory": ["admin", "manager", "superadmin"],
  "/subscriptions": ["admin", "manager", "superadmin"],
  "/locations": ["admin", "manager", "superadmin"],
  "/reviews": ["admin", "manager", "superadmin"],
  "/logistics": ["cashier", "admin", "manager", "superadmin"],
  "/delivery-tracking": ["cashier", "admin", "manager", "superadmin"],
  "/production": ["admin", "manager", "superadmin"],
  "/requests": ["admin", "manager", "superadmin"],
  "/users-permissions": ["admin", "superadmin"],
  "/shift-management": ["cashier", "admin", "manager", "superadmin"],
  "/reports": ["admin", "manager", "superadmin"],
  "/shift-reports": ["admin", "manager", "superadmin"],
  "/pricing": ["admin", "manager", "superadmin"],
  "/financial-hub": ["admin", "manager", "superadmin"],
  "/settings": ["admin", "superadmin"],
  "/whatsapp-gateway": ["admin", "superadmin"],
};

export const isRouteAllowed = (path: string, role?: string | null): boolean => {
  const allowed = ROUTE_ACCESS[path];
  if (!allowed) return true;
  if (!role) return false;
  return allowed.includes(role as UserRole);
};
