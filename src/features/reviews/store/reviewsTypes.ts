export interface Review {
  _id: string;
  customerName: string;
  customerPhone?: string;
  orderId?: string;
  orderType?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  categories: string[];
  isVisible: boolean;
  createdAt: string;
}

export interface ReviewsDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: ReviewsDistribution;
  highestRated: Review[];
}

export interface ReviewsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetReviewsRequest {
  rating?: number;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetReviewsResponse {
  data: Review[];
  pagination: ReviewsPagination;
  stats: ReviewStats;
}

export interface CreateReviewRequest {
  customerName: string;
  customerPhone?: string;
  orderId?: string;
  orderType?: string;
  rating: number;
  comment?: string;
  categories?: string[];
}

export interface ToggleVisibilityRequest {
  isVisible: boolean;
}

export type ReviewsOperation = "fetch" | "create" | "update" | "delete";

export interface ReviewsLoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface ReviewsErrorState {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export interface ReviewsState {
  reviews: Review[];
  reviewStats: ReviewStats;
  pagination: ReviewsPagination | null;
  loading: ReviewsLoadingState;
  errors: ReviewsErrorState;
  successMessage: string | null;
}
