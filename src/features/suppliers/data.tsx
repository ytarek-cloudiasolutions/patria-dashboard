import type { SupplierOverview, Supplier } from "./types";

export const SUPPLIER_OVERVIEW: SupplierOverview = {
  totalSuppliers: 7,
  supplySpeed: "Very Good",
  averageSupplyCycle: "48.2 Hrs",
  qualityAssurance: "98.5%",
};

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Bean's supplier",
    status: "Documented",
    contactPerson: "Sarah Mohamed",
    email: "staff@erb.com",
    phone: "012456789",
    address: "123 Street, Cairo",
    categories: ["Arabica", "COFFEE", "BEANS", "TURKISH"],
  },
  {
    id: 2,
    name: "Coffee supplier",
    status: "Documented",
    contactPerson: "Mohamed Nabil",
    email: "staff@erb.com",
    phone: "012456789",
    address: "456 Avenue, Alexandria",
    categories: ["BEANS", "TURKISH"],
  },
];

// Category badge colors cycle through these
export const CATEGORY_COLORS = [
  "bg-[#5C4A0E] text-white",
  "bg-[#1A7A45] text-white",
  "bg-[#7A1A1A] text-white",
  "bg-[#1A3D7A] text-white",
  "bg-[#5C4A0E] text-white",
];
