import type {
  PermissionPage,
  UserAccount,
  UserRole,
} from "./types";

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
  superadmin: [...ALL_PERMISSION_PAGES],
  admin: [...ALL_PERMISSION_PAGES],
  manager: [
    "Home",
    "Order Management",
    "Product Catalog",
    "Customer Base",
    "Offers & Discounts",
    "Branches & Locations",
  ],
  cashier: ["Home", "Order Management"],
  kitchen: ["Home", "Order Management"],
  staff: ["Home", "Order Management"],
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 1,
    name: "Staff Member",
    email: "staff@erb.com",
    phone: "+20 100 000 0001",
    role: "staff",
    pages: ["Home", "Order Management"],
  },
  {
    id: 2,
    name: "Super Admin",
    email: "admin@erb.com",
    phone: "+20 100 000 0002",
    role: "admin",
    pages: [...ALL_PERMISSION_PAGES],
  },
  {
    id: 3,
    name: "Omnia Maher",
    email: "omniagalal8@gmail.com",
    phone: "+20 100 000 0003",
    role: "staff",
    pages: [],
  },
  {
    id: 4,
    name: "Esraa Abdallah",
    email: "eabdallah@cloudiasolutions.com",
    phone: "+20 100 000 0004",
    role: "staff",
    pages: [],
  },
  {
    id: 5,
    name: "Manager",
    email: "manager@erb.com",
    phone: "+20 100 000 0005",
    role: "manager",
    pages: [
      "Home",
      "Order Management",
      "Offers & Discounts",
      "Product Catalog",
      "Customer Base",
      "Branches & Locations",
    ],
  },
  {
    id: 6,
    name: "Cashier One",
    email: "cashier@erb.com",
    phone: "+20 100 000 0006",
    role: "cashier",
    pages: ["Home", "Order Management"],
  },
  {
    id: 7,
    name: "Karim Adel",
    email: "karim.adel@erb.com",
    phone: "+20 100 000 0007",
    role: "staff",
    pages: ["Home", "Order Management"],
  },
];

export const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "kitchen", label: "Kitchen" },
  { value: "staff", label: "Staff" },
];

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "kitchen", label: "Kitchen" },
  { value: "staff", label: "Staff" },
];

export const ROLE_CARD_OPTIONS: {
  value: UserRole;
  label: string;
  description: string;
}[] = [
  {
    value: "superadmin",
    label: "Super Admin",
    description: "Full access to everything",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Users, content, settings",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Staff, reports, operations",
  },
  {
    value: "cashier",
    label: "Cashier",
    description: "Orders and POS shifts",
  },
  {
    value: "kitchen",
    label: "Kitchen",
    description: "View and update order status",
  },
  {
    value: "staff",
    label: "Staff",
    description: "Limited read-only access",
  },
];

export const VIRTUAL_SHIFT_OPTIONS = [
  { value: "none", label: "Without shift selected" },
  { value: "morning", label: "Morning Shift" },
  { value: "evening", label: "Evening Shift" },
  { value: "night", label: "Night Shift" },
];

export const BACKUP_WAREHOUSE_OPTIONS = [
  { value: "none", label: "Without backup storage" },
  { value: "main", label: "Main Warehouse" },
  { value: "downtown", label: "Downtown Branch" },
  { value: "alexandria", label: "Alexandria Branch" },
];

// --- App users (customer accounts) -----------------------------------------

export const APP_USER_STATUS_FILTER = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Blocked", label: "Blocked" },
];

