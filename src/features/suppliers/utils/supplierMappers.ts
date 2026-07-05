import type { Supplier, SupplierCategory, SupplierStatus } from "../types";

export const mapStatus = (isActive: boolean): SupplierStatus => {
  return isActive ? "Documented" : "Inactive";
};

export const mapSupplier = (s: any): Supplier => {
  return {
    id: s._id || s.id,
    name: s.name || "",
    status: mapStatus(s.isActive ?? true),
    contactPerson: s.contactPerson || "",
    phone: s.phone || "",
    email: s.email || "",
    address: s.address || "",
    categories: (s.categories || []) as SupplierCategory[],
  };
};

export const mapSuppliers = (suppliers: any[]): Supplier[] => {
  return (suppliers || []).map(mapSupplier);
};
