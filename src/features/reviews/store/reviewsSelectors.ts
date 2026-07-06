import type { ReviewsState } from "./reviewsTypes";

// Local augmented state type: reviews slice is wired into rootReducer separately
type StateWithReviews = { reviews: ReviewsState } & Record<string, unknown>;

export const selectReviews = (state: StateWithReviews) =>
  state.reviews.reviews;

export const selectReviewStats = (state: StateWithReviews) =>
  state.reviews.reviewStats;

export const selectReviewsPagination = (state: StateWithReviews) =>
  state.reviews.pagination;

export const selectReviewsLoading = (state: StateWithReviews) =>
  state.reviews.loading;

export const selectReviewsErrors = (state: StateWithReviews) =>
  state.reviews.errors;

export const selectReviewsSuccessMessage = (state: StateWithReviews) =>
  state.reviews.successMessage;
