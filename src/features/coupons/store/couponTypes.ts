export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetCouponsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCouponsResponse {
  data: Coupon[];
  pagination?: Pagination;
}

export interface CreateCouponRequest {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses?: number;
  expiryDate?: string;
}

export type UpdateCouponRequest = Partial<CreateCouponRequest> & {
  isActive?: boolean;
};

export type CouponsOperation = "fetch" | "create" | "update" | "delete";

export interface CouponsLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CouponsErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export interface CouponsState {
  coupons: Coupon[];
  pagination: Pagination | null;
  loading: CouponsLoadingState;
  errors: CouponsErrorState;
  successMessage: string | null;
}
