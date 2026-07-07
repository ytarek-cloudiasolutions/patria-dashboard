import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ReviewsState,
  ReviewsLoadingState,
  ReviewsErrorState,
  ReviewsOperation,
  Review,
  ReviewStats,
  GetReviewsRequest,
  GetReviewsResponse,
  CreateReviewRequest,
  ToggleVisibilityRequest,
} from "./reviewsTypes";

const initialLoading: ReviewsLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
};

const initialErrors: ReviewsErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
};

const initialStats: ReviewStats = {
  avgRating: 0,
  totalReviews: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  highestRated: [],
};

const initialState: ReviewsState = {
  reviews: [],
  reviewStats: initialStats,
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: ReviewsState,
  operation: ReviewsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: ReviewsState,
  operation: ReviewsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    getReviewsRequest: (
      state,
      _action: PayloadAction<GetReviewsRequest | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getReviewsSuccess: (state, action: PayloadAction<GetReviewsResponse>) => {
      state.loading.fetch = false;
      state.reviews = action.payload.data ?? [];
      state.pagination = action.payload.pagination ?? null;
      state.reviewStats = action.payload.stats ?? initialStats;
    },
    getReviewsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createReviewRequest: (
      state,
      _action: PayloadAction<CreateReviewRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createReviewSuccess: (
      state,
      action: PayloadAction<{ review: Review; message?: string }>,
    ) => {
      state.loading.create = false;
      state.reviews.unshift(action.payload.review);
      state.successMessage =
        action.payload.message ?? "Review created successfully";
    },
    createReviewFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    toggleVisibilityRequest: (
      state,
      _action: PayloadAction<{ id: string; data: ToggleVisibilityRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    toggleVisibilitySuccess: (
      state,
      action: PayloadAction<{ review: Review; message?: string }>,
    ) => {
      state.loading.update = false;
      const idx = state.reviews.findIndex(
        (r) => r._id === action.payload.review._id,
      );
      if (idx !== -1) {
        state.reviews[idx] = action.payload.review;
      }
      state.successMessage =
        action.payload.message ?? "Review visibility updated";
    },
    toggleVisibilityFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteReviewRequest: (state, _action: PayloadAction<{ id: string }>) => {
      setOperationLoading(state, "delete");
    },
    deleteReviewSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.reviews = state.reviews.filter((r) => r._id !== action.payload.id);
      state.successMessage =
        action.payload.message ?? "Review deleted successfully";
    },
    deleteReviewFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearReviewsMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const reviewsActions = reviewsSlice.actions;
export const reviewsReducer = reviewsSlice.reducer;
export default reviewsReducer;
