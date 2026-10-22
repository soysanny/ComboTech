import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import { registerMock } from "@/services/api/mockAdapter";
import reviewsData from "@data/reviews.json";
import type { CreateReviewInput, Review, UpdateReviewInput } from "../types";

const reviews = reviewsData as unknown as Review[];

registerMock("GET", ENDPOINTS.reviews.list(":productId"), (ctx) => {
  const productReviews = reviews.filter(
    (r) => r.productId === ctx.params.productId,
  );
  return { data: productReviews };
});

registerMock("POST", ENDPOINTS.reviews.create(":productId"), (ctx) => {
  const body = ctx.body as CreateReviewInput;
  const review: Review = {
    id: `review-${Date.now()}`,
    productId: ctx.params.productId,
    userId: "user-shopper-1",
    userName: "Dara Chan",
    rating: body.rating,
    title: body.title,
    comment: body.comment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  reviews.unshift(review);
  return { data: { data: review } };
});

registerMock("PUT", ENDPOINTS.reviews.detail(":id"), (ctx) => {
  const body = ctx.body as UpdateReviewInput;
  const review = reviews.find((r) => r.id === ctx.params.id);
  if (!review) {
    return {
      status: 404,
      data: { message: "Review not found", status: 404 },
    };
  }
  if (body.rating !== undefined) review.rating = body.rating;
  if (body.title !== undefined) review.title = body.title;
  if (body.comment !== undefined) review.comment = body.comment;
  review.updatedAt = new Date().toISOString();
  return { data: { data: review } };
});

registerMock("DELETE", ENDPOINTS.reviews.detail(":id"), (ctx) => {
  const index = reviews.findIndex((r) => r.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Review not found", status: 404 },
    };
  }
  reviews.splice(index, 1);
  return { data: { success: true } };
});

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
