"use client";

import { Star, User } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Review } from "../types";

export interface ReviewListProps {
  reviews: Review[];
}

/** Displays product reviews in a card list. */
export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share your thoughts about this product."
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-card ring-foreground/5 rounded-2xl p-5 shadow-sm ring-1"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
                <User className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{review.userName}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`size-3.5 ${
                    index < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
          <h4 className="mt-3 font-semibold">{review.title}</h4>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
