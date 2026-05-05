import type { LucideIcon } from "lucide-react";

export type OrderType = "dine-in" | "takeaway";

export type PaymentMethod = "cash" | "card" | "mix";

export type PosCategory = {
  id: string;
  label: string;
  count: number;
  icon: LucideIcon;
};

export type PosProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  stockBadge?: string;
  accent?: string;
};

export type CartAddon = {
  id: string;
  name: string;
  price: number;
  selected: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  addons?: CartAddon[];
};

export type StaffMember = {
  id: string;
  name: string;
  role?: string;
};

export type StaffPosition = "Admin" | "Manager" | "Barista" | "Staff";

export type ShiftPaymentSummary = {
  method: PaymentMethod;
  label: string;
  amount: number;
};
