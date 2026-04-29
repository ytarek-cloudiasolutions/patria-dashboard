export interface Supplier {
  id: number;
  name: string;
  status: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
}

export interface SupplierFormData {
  supplierName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  categories: string;
}

export interface SupplierOverview {
  totalSuppliers: number;
  supplySpeed: string;
  averageSupplyCycle: string;
  qualityAssurance: string;
}