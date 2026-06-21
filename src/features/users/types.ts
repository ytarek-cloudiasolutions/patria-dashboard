export type UserRole = "Staff" | "Manager" | "Admin" | "User" | "POS/Cashier";

export type UsersTab = "users" | "app";

export type PermissionPage =
  | "Home"
  | "Order Management"
  | "Product Catalog"
  | "Customer Base"
  | "Offers & Discounts"
  | "Profile"
  | "General Settings"
  | "Users & Permissions"
  | "Branches & Locations";

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pages: PermissionPage[];
}

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole | "";
  virtualShift: string;
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
  | "Confirmed"
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
  id: number;
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
