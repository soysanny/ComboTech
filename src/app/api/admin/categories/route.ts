import { NextResponse } from "next/server";
import { getCollection, saveCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Category, Product } from "@/features/products/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const categories = await getCollection<Category>("categories");
  const products = await getCollection<Product>("products");
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  const withCounts = categories.map((category) => ({
    ...category,
    productCount: counts.get(category.slug) ?? 0,
  }));

  return NextResponse.json(paginate(withCounts, page, pageSize));
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

  const categories = await getCollection<Category>("categories");
  categories.push(newCategory);
  await saveCollection("categories", categories);

  return NextResponse.json({ data: newCategory }, { status: 201 });
}
