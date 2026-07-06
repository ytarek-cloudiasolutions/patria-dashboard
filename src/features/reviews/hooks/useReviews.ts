import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reviewsActions } from "../store/reviewsSlice";
import {
  selectReviews,
  selectReviewStats,
  selectReviewsPagination,
  selectReviewsLoading,
  selectReviewsErrors,
} from "../store/reviewsSelectors";
import type {
  GetReviewsRequest,
  CreateReviewRequest,
  ToggleVisibilityRequest,
} from "../store/reviewsTypes";

export const useReviews = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const select = useSelector as (selector: (s: any) => any) => any;

  const reviews = select(selectReviews);
  const reviewStats = select(selectReviewStats);
  const pagination = select(selectReviewsPagination);
  const loading = select(selectReviewsLoading);
  const errors = select(selectReviewsErrors);

  const getReviews = useCallback(
    (params?: GetReviewsRequest) => {
      dispatch(reviewsActions.getReviewsRequest(params));
    },
    [dispatch],
  );

  const createReview = useCallback(
    (data: CreateReviewRequest) => {
      dispatch(reviewsActions.createReviewRequest(data));
    },
    [dispatch],
  );

  const toggleVisibility = useCallback(
    (id: string, data: ToggleVisibilityRequest) => {
      dispatch(reviewsActions.toggleVisibilityRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteReview = useCallback(
    (id: string) => {
      dispatch(reviewsActions.deleteReviewRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(reviewsActions.clearReviewsMessages());
  }, [dispatch]);

  return {
    reviews,
    reviewStats,
    pagination,
    loading,
    errors,
    getReviews,
    createReview,
    toggleVisibility,
    deleteReview,
    clearMessages,
  };
};

export default useReviews;
