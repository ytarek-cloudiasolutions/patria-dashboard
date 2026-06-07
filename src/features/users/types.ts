export type UserRole = "Staff" | "Manager" | "Admin" | "User";

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
}

export interface UserOverviewCounts {
  totalUsers: number;
  administrators: number;
  managers: number;
}
