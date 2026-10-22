"use client";

import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  className?: string;
  /** When provided, renders interactive buttons for selecting a rating. */
  onChange?: (value: number) => void;
}

/** Accessible star rating — read-only display or interactive input. */
export function StarRating({
  value,
  max = 5,
  size = 16,
  className,
  onChange,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const interactive = typeof onChange === "function";

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${value} out of ${max}`}
    >
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        const icon = (
          <Star
            width={size}
            height={size}
            className={cn(
              filled
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground",
            )}
            aria-hidden
          />
        );
        return interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === Math.round(value)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange?.(star)}
            className="focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        );
      })}
    </div>
  );
}
