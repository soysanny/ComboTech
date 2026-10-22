"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/FormField";
import { StarRating } from "./StarRating";
import { useReviewMutations } from "../hooks/useReviews";
import { toast } from "@/lib/toast";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewSchema = z.infer<typeof reviewSchema>;

export interface ReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

/** Form for submitting a new product review. */
export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const { create } = useReviewMutations(productId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", comment: "" },
  });

  const onSubmit = async (values: ReviewSchema) => {
    await create.mutateAsync({ productId, ...values });
    toast.success("Review submitted", {
      description: "Thank you for sharing your feedback.",
    });
    reset();
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Your rating</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={field.onChange}
              size={24}
            />
          )}
        />
        {errors.rating && (
          <p className="text-destructive text-xs">{errors.rating.message}</p>
        )}
      </div>

      <FormField
        label="Review title"
        htmlFor="review-title"
        required
        error={errors.title?.message}
      >
        <Input
          id="review-title"
          placeholder="Summarize your experience"
          {...register("title")}
        />
      </FormField>

      <FormField
        label="Review"
        htmlFor="review-comment"
        required
        error={errors.comment?.message}
      >
        <Textarea
          id="review-comment"
          placeholder="What did you like or dislike?"
          rows={4}
          {...register("comment")}
        />
      </FormField>

      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  );
}
