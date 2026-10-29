import { NextResponse } from "next/server";
import { deleteOne, updateOne } from "@/lib/db";
import type { Review, UpdateReviewInput } from "@/features/review/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as UpdateReviewInput;
  const updated = await updateOne<Review>("reviews", id, body);
  if (!updated) {
    return NextResponse.json(
      { message: "Review not found", status: 404 },
      { status: 404 },
    );
  }
  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const removed = await deleteOne("reviews", id);
  if (!removed) {
    return NextResponse.json(
      { message: "Review not found", status: 404 },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true });
}
