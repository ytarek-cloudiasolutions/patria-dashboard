import type { UserAccount } from "../types";

export interface GetUsersResponse {
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

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export type UserOperation = "fetch" | "create" | "update" | "delete";

export interface UserLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface UserErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export interface UserState {
  users: UserAccount[];
  pagination: GetUsersResponse["pagination"] | null;
  loading: UserLoadingState;
  errors: UserErrorState;
  successMessage: string | null;
}
