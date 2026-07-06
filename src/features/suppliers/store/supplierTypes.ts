import type { Supplier } from "../types";

export interface GetSuppliersResponse {
  data: any[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateSupplierRequest {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
}

export type SupplierOperation = "fetch" | "create" | "update" | "delete";

export interface SupplierLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface SupplierErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export interface SupplierState {
  suppliers: Supplier[];
  pagination: GetSuppliersResponse["pagination"] | null;
  loading: SupplierLoadingState;
  errors: SupplierErrorState;
  successMessage: string | null;
}
