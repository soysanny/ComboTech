import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Product } from "@/features/products/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getCollection<Product>("products");
  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ message: "Product not found", status: 404 }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}
