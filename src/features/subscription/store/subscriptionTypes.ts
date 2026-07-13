import type { Subscription } from "../types";

export interface SubscriptionStats {
  active: number;
}

export interface GetSubscriptionsRequest {
  page?: number;
  limit?: number;
  status?: string;
}

export interface GetSubscriptionsResponse {
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

export interface CreateSubscriptionRequest {
  customerId: string;
  productId: string;
  frequency: string;
  quantity: number;
  nextDeliveryDate: string;
  status: string;
  startDate: string;
}

export type SubscriptionOperation =
  | "fetch"
  | "create"
  | "update"
  | "delete"
  | "stats"
  | "users"
  | "products"
  | "renewals";

export interface SubscriptionLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  stats: boolean;
  users: boolean;
  products: boolean;
  renewals: boolean;
}

export interface SubscriptionErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  stats: string | null;
  users: string | null;
  products: string | null;
  renewals: string | null;
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  stats: SubscriptionStats;
  pagination: GetSubscriptionsResponse["pagination"] | null;
  users: { id: string; name: string; email: string }[];
  products: { id: string; name: string; roast: string; grind: string }[];
  loading: SubscriptionLoadingState;
  errors: SubscriptionErrorState;
  successMessage: string | null;
}
