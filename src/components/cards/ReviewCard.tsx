"use client";

import type { Review } from "@/features/review/types";

export interface ReviewCardProps {
  review: Review;
}

/** Placeholder — review card built in the components/cards milestone. */
export function ReviewCard(_props: ReviewCardProps) {
  return <article data-component="ReviewCard" />;
}
