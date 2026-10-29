import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Product } from "@/features/products/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { ids?: string[] };
  const ids = body?.ids ?? [];
  const products = await getCollection<Product>("products");
  const data = products.filter((p) => ids.includes(p.id));
  return NextResponse.json({ data });
}
