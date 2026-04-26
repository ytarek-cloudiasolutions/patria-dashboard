export type UserRole = "Staff" | "Admin" | "User" | "Manager";

export type PagePermission =
  | "Home"
  | "Order Management"
  | "Product Catalog"
  | "Customer Base"
  | "Offers & Discounts"
  | "Profile"
  | "General Settings"
  | "Users & Permissions"
  | "Branches & Locations";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  availablePages: PagePermission[];
}

export interface NewUserForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  pages: PagePermission[];
}

export interface EditPermissionsForm {
  role: UserRole;
  pages: PagePermission[];
}