import { NextResponse } from "next/server";
import { getCollection, saveCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Category } from "@/features/products/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const categories = getCollection<Category>("categories");
  return NextResponse.json(paginate(categories, page, pageSize));
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const body = (await request.json()) as Omit<Category, "id">;
  const newCategory: Category = {
    ...body,
    id: `cat-${Date.now()}`,
    productCount: 0,
  };

  const categories = getCollection<Category>("categories");
  categories.push(newCategory);
  saveCollection("categories", categories);

  return NextResponse.json({ data: newCategory }, { status: 201 });
}
