import type { Offer } from "../types";

export interface GetOffersRequest {
  page?: number;
  limit?: number;
}

export interface GetOffersResponse {
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

export interface CreateOfferRequest {
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  status?: string;
  productIds?: string[];
  image?: string;
}

export type OffersOperation = "fetch" | "create" | "update" | "delete" | "toggle";

export interface OffersLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  toggle: boolean;
}

export interface OffersErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  toggle: string | null;
}

export interface OffersState {
  offers: Offer[];
  pagination: GetOffersResponse["pagination"] | null;
  loading: OffersLoadingState;
  errors: OffersErrorState;
  successMessage: string | null;
}
