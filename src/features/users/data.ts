import type {
  AppUser,
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

const sampleOrders = [
  {
    id: "#ORD-214067",
    date: "3/31/2026",
    time: "2:37:57 PM",
    products: 1,
    total: 227.4,
    status: "Pending" as const,
  },
  {
    id: "#ORD-387939",
    date: "3/31/2026",
    time: "2:37:57 PM",
    products: 3,
    total: 1250.0,
    status: "Confirmed" as const,
  },
  {
    id: "#ORD-021928",
    date: "3/31/2026",
    time: "2:37:57 PM",
    products: 2,
    total: 80.0,
    status: "Delivered" as const,
  },
];

export const APP_USERS: AppUser[] = [
  {
    id: 1,
    name: "Omnia Maher Galal",
    email: "omniagalal98@gmail.com",
    phone: "01288716491",
    status: "Active",
    totalOrders: 1,
    purchasesValue: 2500,
    orders: sampleOrders,
  },
  {
    id: 2,
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    phone: "01288716492",
    status: "Active",
    totalOrders: 4,
    purchasesValue: 1820,
    orders: sampleOrders,
  },
  {
    id: 3,
    name: "Sofia Chen",
    email: "sofia.chen@mail.com",
    phone: "01288716493",
    status: "Active",
    totalOrders: 2,
    purchasesValue: 640,
    orders: sampleOrders,
  },
  {
    id: 4,
    name: "Ethan Patel",
    email: "ethan.patel@email.com",
    phone: "01288716494",
    status: "Active",
    totalOrders: 6,
    purchasesValue: 3120,
    orders: sampleOrders,
  },
  {
    id: 5,
    name: "Ava Thompson",
    email: "ava.thompson@domain.com",
    phone: "01288716495",
    status: "Blocked",
    totalOrders: 0,
    purchasesValue: 0,
    orders: [],
  },
  {
    id: 6,
    name: "Noah Garcia",
    email: "noah.garcia@webmail.com",
    phone: "01288716496",
    status: "Active",
    totalOrders: 3,
    purchasesValue: 910,
    orders: sampleOrders,
  },
  {
    id: 7,
    name: "Mia Rodriguez",
    email: "mia.rodriguez@service.com",
    phone: "01288716497",
    status: "Blocked",
    totalOrders: 1,
    purchasesValue: 150,
    orders: sampleOrders,
  },
];
