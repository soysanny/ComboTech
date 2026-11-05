import { NextResponse } from "next/server";
import { createOne, getCollection, updateOne } from "@/lib/db";
import type { CreateReviewInput, Review } from "@/features/review/types";
import type { Product } from "@/features/products/types";

/** List reviews for a product. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reviews = await getCollection<Review>("reviews");
  return NextResponse.json({ data: reviews.filter((r) => r.productId === id) });
}

/** Submit a review for a product (public — customers are not authenticated). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: CreateReviewInput;
  try {
    body = (await request.json()) as CreateReviewInput;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body", status: 400 },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body.rating !== "number" ||
    !Number.isFinite(body.rating) ||
    body.rating < 1 ||
    body.rating > 5
  ) {
    return NextResponse.json(
      { message: "Rating must be a number between 1 and 5", status: 400 },
      { status: 400 },
    );
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const comment =
    typeof body.comment === "string" ? body.comment.trim() : "";

  if (title.length < 3 || comment.length < 10) {
    return NextResponse.json(
      {
        message: "Title must be at least 3 characters and review at least 10",
        status: 400,
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const review: Review = {
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productId: id,
    userId: "guest",
    userName: "Guest",
    rating: Math.round(body.rating),
    title,
    comment,
    createdAt: now,
    updatedAt: now,
  };

  await createOne("reviews", review);

  const productReviews = (await getCollection<Review>("reviews")).filter(
    (item) => item.productId === id,
  );
  if (productReviews.length > 0) {
    const average =
      productReviews.reduce((sum, item) => sum + item.rating, 0) /
      productReviews.length;
    await updateOne<Product>("products", id, {
      rating: Math.round(average * 10) / 10,
      reviewCount: productReviews.length,
    });
  }

  return NextResponse.json({ data: review }, { status: 201 });
}
