import { NextResponse } from "next/server";
import { deleteOne, updateOne } from "@/lib/db";
import { getAuth, forbidden, unauthorized } from "@/lib/auth";
import type { Review, UpdateReviewInput } from "@/features/review/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();
  if (auth.role !== "admin") return forbidden();

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
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();
  if (auth.role !== "admin") return forbidden();

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
