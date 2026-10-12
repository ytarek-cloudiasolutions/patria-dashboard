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
  "POS",
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
  cashier: ["Home", "Order Management", "POS"],
  kitchen: ["Home", "Order Management"],
  staff: ["Home", "Order Management"],
};

export const POS_PERMISSIONS: { id: string; title: string; description: string }[] = [
  {
    id: "standard_discount",
    title: "Standard Discount",
    description: "Percentage or fixed amount off selected categories or products",
  },
  {
    id: "seasonal_discount",
    title: "Seasonal Discount",
    description: "Discounts applied during specific seasons or holidays",
  },
  {
    id: "bulk_purchase_discount",
    title: "Bulk Purchase Discount",
    description: "Reduced price per unit when purchasing in large quantities",
  },
  {
    id: "referral_discount",
    title: "Referral Discount",
    description: "Discounts offered to customers who refer new clients",
  },
  {
    id: "loyalty_reward_discount",
    title: "Loyalty Reward Discount",
    description: "Discounts for returning customers based on their purchase history",
  },
  {
    id: "first_time_buyer_discount",
    title: "First-Time Buyer Discount",
    description: "Special pricing for customers making their initial purchase",
  },
  {
    id: "membership_discount",
    title: "Membership Discount",
    description: "Exclusive discounts for members of a particular club or organization",
  },
  {
    id: "clearance_discount",
    title: "Clearance Discount",
    description: "Significant price reductions on items being discontinued or cleared out",
  },
];

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

