"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";
import type { CreateReviewInput, UpdateReviewInput } from "../types";

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (productId: string) => [...reviewKeys.all, "list", productId] as const,
};

/** Reviews for a product. */
export function useReviews(productId: string) {
  return useQuery({
    queryKey: reviewKeys.list(productId),
    queryFn: () => reviewService.getReviews(productId),
    enabled: Boolean(productId),
  });
}

/** Create/edit/delete review mutations, invalidating the product's list. */
export function useReviewMutations(productId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    void queryClient.invalidateQueries({
      queryKey: reviewKeys.list(productId),
    });

  const create = useMutation({
    mutationFn: (input: CreateReviewInput) => reviewService.createReview(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: (input: UpdateReviewInput) => reviewService.updateReview(input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
