import { api } from "@/config/api";
import type {
  GetReviewsRequest,
  GetReviewsResponse,
  CreateReviewRequest,
  ToggleVisibilityRequest,
  Review,
} from "../store/reviewsTypes";

const BASE = "/reviews";

export const getReviews = async (
  params?: GetReviewsRequest,
): Promise<GetReviewsResponse> => {
  const response = await api.get<GetReviewsResponse>(BASE, { params });
  return response.data;
};

export const createReview = async (
  data: CreateReviewRequest,
): Promise<{ review: Review }> => {
  const response = await api.post<{ review: Review }>(BASE, data);
  return response.data;
};

export const toggleReviewVisibility = async (
  id: string,
  data: ToggleVisibilityRequest,
): Promise<{ review: Review }> => {
  const response = await api.patch<{ review: Review }>(
    `${BASE}/${id}/visibility`,
    data,
  );
  return response.data;
};

export const deleteReview = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`${BASE}/${id}`);
  return response.data;
};

export const reviewsApi = {
  getReviews,
  createReview,
  toggleReviewVisibility,
  deleteReview,
};

export default reviewsApi;
