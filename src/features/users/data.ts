import type { PermissionPage, UserAccount, UserRole } from "./types";

export const ALL_PERMISSION_PAGES: PermissionPage[] = [
  "Home",
  "Order Management",
  "Product Catalog",
  "Customer Base",
  "Offers & Discounts",
  "Profile",
  "General Settings",
  "Users & Permissions",
  "Branches & Locations",
];

export const ROLE_DEFAULT_PAGES: Record<UserRole, PermissionPage[]> = {
  Staff: ["Home", "Order Management"],
  Manager: [
    "Home",
    "Order Management",
    "Product Catalog",
    "Customer Base",
    "Offers & Discounts",
    "Branches & Locations",
  ],
  Admin: [...ALL_PERMISSION_PAGES],
  User: [],
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 1,
    name: "Staff Member",
    email: "staff@erb.com",
    phone: "+20 100 000 0001",
    role: "Staff",
    pages: ["Home", "Order Management"],
  },
  {
    id: 2,
    name: "Super Admin",
    email: "admin@erb.com",
    phone: "+20 100 000 0002",
    role: "Admin",
    pages: [...ALL_PERMISSION_PAGES],
  },
  {
    id: 3,
    name: "Omnia Maher",
    email: "omniagalal8@gmail.com",
    phone: "+20 100 000 0003",
    role: "User",
    pages: [],
  },
  {
    id: 4,
    name: "Esraa Abdallah",
    email: "eabdallah@cloudiasolutions.com",
    phone: "+20 100 000 0004",
    role: "User",
    pages: [],
  },
  {
    id: 5,
    name: "Manager",
    email: "manager@erb.com",
    phone: "+20 100 000 0005",
    role: "Manager",
    pages: [
      "Home",
      "Order Management",
      "Offers & Discounts",
      "Product Catalog",
      "Customer Base",
      "Branches & Locations",
    ],
  },
];

export const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "Staff", label: "Staff" },
  { value: "Manager", label: "Manager" },
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "Staff", label: "Staff" },
  { value: "Manager", label: "Manager" },
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];

export const ROLE_CARD_OPTIONS: {
  value: UserRole;
  label: string;
  description: string;
}[] = [
  {
    value: "Staff",
    label: "Staff",
    description: "Order management only",
  },
  {
    value: "Manager",
    label: "Manager",
    description: "Orders + Products + Customers",
  },
  {
    value: "Admin",
    label: "Admin",
    description: "Full access to the store",
  },
];
