export type UserRole = "superadmin" | "admin" | "manager" | "marketing" | "cashier" | "kitchen" | "staff";

export type UsersTab = "users" | "app";

export type PermissionPage =
  | "Dashboard"
  | "Orders"
  | "Tables"
  | "Kitchen"
  | "Catalog Order"
  | "Approval Request"
  | "Products"
  | "Offers"
  | "Coupons"
  | "Inventory"
  | "Customers"
  | "Suppliers"
  | "Locations"
  | "Reviews"
  | "Purchasing"
  | "Warehouses"
  | "Logistics"
  | "Delivery Tracking"
  | "Production"
  | "Subscription"
  | "Financial Hub"
  | "Shift Reports"
  | "Reports"
  | "Pricing"
  | "Users & Permissions"
  | "Shift Management"
  | "Marketing Center"
  | "WhatsApp Gateway"
  | "Settings"
  | "My Account"
  | "Help Center"
  | "POS";

export interface UserAccount {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pages: PermissionPage[];
  backupWarehouseId?: string;
  virtualShift?: string;
  _type?: "staff" | "customer";
  lifetimeValue?: number;
  isActive?: boolean;
  totalOrders?: number;
  totalPurchases?: number;
}

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole | "";
  virtualShift: string;
  posPermissions?: string[];
}

export interface UserOverviewCounts {
  totalUsers: number;
  administrators: number;
  managers: number;
}

// --- App users (customer accounts) -----------------------------------------

export type AppUserStatus = "Active" | "Blocked";

export type AppUserOrderStatus =
  | "Pending"
  | "Preparing"
  | "Confirmed"
  | "On The Way"
  | "Delivered"
  | "Cancelled";

export interface AppUserOrder {
  id: string;
  date: string;
  time: string;
  products: number;
  total: number;
  status: AppUserOrderStatus;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AppUserStatus;
  totalOrders: number;
  purchasesValue: number;
  orders: AppUserOrder[];
}

export interface AppUserOverviewCounts {
  totalUsers: number;
  blockedUsers: number;
  activeUsers: number;
}
