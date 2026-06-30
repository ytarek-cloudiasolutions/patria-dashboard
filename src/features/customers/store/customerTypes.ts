import type { Customer } from "../types";

export interface CustomerStats {
  total: number;
  active: number;
}

export interface GetCustomersRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCustomersResponse {
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

export interface UpdateCustomerRequest {
  loyaltyPoints: number;
  tier: string;
}

export type CustomersOperation = "fetch" | "update" | "delete";

export interface CustomersLoadingState {
  fetch: boolean;
  update: boolean;
  delete: boolean;
}

export interface CustomersErrorState {
  fetch: string | null;
  update: string | null;
  delete: string | null;
}

export interface CustomersState {
  customers: Customer[];
  stats: CustomerStats;
  pagination: GetCustomersResponse["pagination"] | null;
  loading: CustomersLoadingState;
  errors: CustomersErrorState;
  successMessage: string | null;
}
