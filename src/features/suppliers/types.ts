export type SupplierStatus = "Documented" | "Pending" | "Inactive";

export type SupplierCategory =
  | "Arabica"
  | "Coffee"
  | "Beans"
  | "Turkish"
  | "Tea"
  | "Dairy"
  | "Spices";

export interface Supplier {
  id: number;
  name: string;
  status: SupplierStatus;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: SupplierCategory[];
}

export interface SupplierFormData {
  supplierName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  categories: string;
}
