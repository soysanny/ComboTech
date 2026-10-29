import { NextResponse } from "next/server";
import { createOne, getCollection } from "@/lib/db";
import type { CreateReviewInput, Review } from "@/features/review/types";

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

  if (!body || typeof body.rating !== "number") {
    return NextResponse.json(
      { message: "Rating is required", status: 400 },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const review: Review = {
    id: `review-${Date.now()}`,
    productId: id,
    userId: "guest",
    userName: "Guest",
    rating: body.rating,
    title: body.title ?? "",
    comment: body.comment ?? "",
    createdAt: now,
    updatedAt: now,
  };

  await createOne("reviews", review);
  return NextResponse.json({ data: review }, { status: 201 });
}
