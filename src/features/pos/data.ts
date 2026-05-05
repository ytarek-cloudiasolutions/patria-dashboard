import { Box, Coffee, Tag, Ticket } from "lucide-react";

import type {
  CartAddon,
  CartItem,
  PosCategory,
  PosProduct,
  ShiftPaymentSummary,
  StaffMember,
  StaffPosition,
} from "./types";

export const POS_CATEGORIES: PosCategory[] = [
  { id: "all", label: "All Items", count: 24, icon: Tag },
  { id: "bakery", label: "Bakery", count: 8, icon: Ticket },
  { id: "drinks", label: "Drinks", count: 6, icon: Coffee },
  { id: "ingredients", label: "Raw Ingredients", count: 10, icon: Box },
];

export const POS_TABLE_OPTIONS = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Staff Table",
];

export const STAFF_MEMBERS: StaffMember[] = [
  { id: "omnia", name: "Omnia Maher Galal", role: "Admin" },
  { id: "ahmed", name: "Ahmed Said", role: "Manager" },
  { id: "kareem", name: "Kareem Nabil", role: "Barista" },
  { id: "youssef", name: "Youssef Abdallah", role: "Staff" },
  { id: "osama", name: "Osama Abdallah" },
  { id: "other", name: "Other" },
];

export const STAFF_POSITIONS: StaffPosition[] = [
  "Admin",
  "Manager",
  "Barista",
  "Staff",
];

export const POS_PRODUCTS: PosProduct[] = [
  {
    id: "classic-turkey",
    name: "The Classic Turkey",
    price: 460,
    category: "bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    accent: "bg-[#F4E6D6]",
  },
  {
    id: "chemex",
    name: "Chemex",
    price: 89.25,
    category: "drinks",
    imageUrl:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    accent: "bg-[#ECE7DD]",
  },
  {
    id: "blueberry-croissant",
    name: "Blueberry Croissant",
    price: 120.96,
    category: "bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1620146344904-097a0002d797?auto=format&fit=crop&w=600&q=80",
    accent: "bg-[#EFE5D8]",
  },
  {
    id: "amber-sobia",
    name: "Amber Sobia",
    price: 99.22,
    category: "drinks",
    imageUrl:
      "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80",
    stockBadge: "Low - 7",
    accent: "bg-[#F3EFE7]",
  },
  {
    id: "roast-beef",
    name: "Middle Eastern Roast Beef",
    price: 460,
    category: "bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=600&q=80",
    accent: "bg-[#EFE4D5]",
  },
  {
    id: "eish-el-saraya",
    name: "Eish el Saraya",
    price: 460,
    category: "bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80",
    accent: "bg-[#F2EDE6]",
  },
  {
    id: "kunafa-tiramisu",
    name: "Kunafa Tiramsu",
    price: 460,
    category: "bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=600&q=80",
    accent: "bg-[#F2ECE4]",
  },
];

export const CART_ADDON_OPTIONS: CartAddon[] = [
  {
    id: "chocolate-sauce",
    name: "Chocolate Sauce",
    price: 35.86,
    selected: false,
  },
  { id: "lotus-sauce", name: "Lotus Sauce", price: 35.86, selected: false },
  {
    id: "strawberry-pieces",
    name: "Strawberry Pieces",
    price: 35.86,
    selected: false,
  },
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  { id: "sourdough", name: "Sourdough", unitPrice: 85.2, qty: 2 },
  {
    id: "croissant",
    name: "Croissant",
    unitPrice: 85.2,
    qty: 2,
    addons: CART_ADDON_OPTIONS.map((addon) => ({ ...addon, selected: true })),
  },
];

export const ORDER_SUMMARY_BASE_SUBTOTAL = 768.4;

export const SHIFT_SUMMARY = {
  orderCount: 3,
  total: 670,
};

export const SHIFT_PAYMENT_SUMMARY: ShiftPaymentSummary[] = [
  { method: "cash", label: "Cash", amount: 420 },
  { method: "card", label: "Visa/Card", amount: 420 },
  { method: "mix", label: "Mix", amount: 420 },
];
