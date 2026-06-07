import type { Supplier } from "./types";

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Bean's supplier",
    status: "Documented",
    contactPerson: "Sarah Mohamed",
    phone: "012456789",
    email: "",
    address: "Cairo, Nasr City",
    categories: ["Arabica", "Coffee", "Beans", "Turkish"],
  },
  {
    id: 2,
    name: "Coffee supplier",
    status: "Documented",
    contactPerson: "Mohamed Nabil",
    phone: "012456789",
    email: "staff@erb.com",
    address: "Alexandria, Smouha",
    categories: ["Beans", "Turkish"],
  },
];

export const SUPPLIER_OVERVIEW = {
  totalSuppliers: 7,
  supplySpeed: "Very Good",
  averageSupplyCycle: "48.2 Hrs",
  qualityAssurance: "98.5%",
};
