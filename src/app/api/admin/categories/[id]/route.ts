import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Category } from "@/features/products/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as Partial<Category>;

  const categories = getCollection<Category>("categories");
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Category not found", status: 404 }, { status: 404 });
  }

  categories[index] = { ...categories[index], ...body, id };
  saveCollection("categories", categories);

  return NextResponse.json({ data: categories[index] });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const categories = getCollection<Category>("categories");
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Category not found", status: 404 }, { status: 404 });
  }

  categories.splice(index, 1);
  saveCollection("categories", categories);
  return NextResponse.json({ success: true });
}
