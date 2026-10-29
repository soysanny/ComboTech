import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { CreateReviewInput, Review, UpdateReviewInput } from "../types";

/** Review service — list, create, edit, and delete product reviews. */
export const reviewService = {
  getReviews: (productId: string) =>
    apiClient.get<Review[]>(ENDPOINTS.reviews.list(productId)),
  createReview: (input: CreateReviewInput) =>
    apiClient.post<{ data: Review }>(
      ENDPOINTS.reviews.create(input.productId),
      input,
    ),
  updateReview: (input: UpdateReviewInput) =>
    apiClient.put<{ data: Review }>(ENDPOINTS.reviews.detail(input.id), input),
  deleteReview: (id: string) =>
    apiClient.delete<{ success: boolean }>(ENDPOINTS.reviews.detail(id)),
};
