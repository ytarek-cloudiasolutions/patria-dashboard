import type { PagePermission, User, UserRole } from "./types";

export const ALL_PAGES: PagePermission[] = [
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

export const ROLE_DEFAULT_PAGES: Record<UserRole, PagePermission[]> = {
  Staff: ["Home", "Order Management"],
  Manager: [
    "Home",
    "Order Management",
    "Offers & Discounts",
    "Product Catalog",
    "Customer Base",
    "Branches & Locations",
  ],
  Admin: [
    "Home",
    "Order Management",
    "Product Catalog",
    "Customer Base",
    "Offers & Discounts",
    "Profile",
    "General Settings",
    "Users & Permissions",
    "Branches & Locations",
  ],
  User: [],
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  Staff: "Order management only",
  Manager: "Orders + Products + Customers",
  Admin: "Full access to the store",
  User: "Limited access",
};

export const usersData: User[] = [
  {
    id: "u1",
    name: "Staff Member",
    email: "staff@erb.com",
    role: "Staff",
    availablePages: ["Home", "Order Management"],
  },
  {
    id: "u2",
    name: "Super Admin",
    email: "admin@erb.com",
    role: "Admin",
    availablePages: [
      "Home",
      "Order Management",
      "Product Catalog",
      "Customer Base",
      "Offers & Discounts",
      "Profile",
      "General Settings",
      "Users & Permissions",
      "Branches & Locations",
    ],
  },
  {
    id: "u3",
    name: "Omnia Maher",
    email: "omniagalal98@gmail.com",
    role: "User",
    availablePages: [],
  },
  {
    id: "u4",
    name: "Esraa Abdallah",
    email: "eabdallah@cloudiasolutions.com",
    role: "User",
    availablePages: [],
  },
  {
    id: "u5",
    name: "Manager",
    email: "manager@erb.com",
    role: "Manager",
    availablePages: [
      "Home",
      "Order Management",
      "Offers & Discounts",
      "Product Catalog",
      "Customer Base",
      "Branches & Locations",
    ],
  },
];

export const roleOptions: { value: UserRole; label: string }[] = [
  { value: "Staff", label: "Staff" },
  { value: "Manager", label: "Manager" },
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];

export const PAGE_ICONS: Record<string, string> = {
  Home: "🏠",
  "Order Management": "📦",
  "Product Catalog": "🛍️",
  "Customer Base": "👤",
  "Offers & Discounts": "🏷️",
  Profile: "👤",
  "General Settings": "⚙️",
  "Users & Permissions": "🔐",
  "Branches & Locations": "📍",
};
