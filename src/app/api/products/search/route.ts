import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Product } from "@/features/products/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "12");

  let products = getCollection<Product>("products");

  if (search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search),
    );
  }

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    data: products.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  });
}
