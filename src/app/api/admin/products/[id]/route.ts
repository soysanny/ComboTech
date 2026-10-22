import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Product } from "@/features/products/types";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as Partial<Product>;

  const products = getCollection<Product>("products");
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Product not found", status: 404 }, { status: 404 });
  }

  products[index] = {
    ...products[index],
    ...body,
    id,
    slug: body.name ? slugify(body.name) : products[index].slug,
    updatedAt: new Date().toISOString(),
  };

  saveCollection("products", products);
  return NextResponse.json({ data: products[index] });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const products = getCollection<Product>("products");
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Product not found", status: 404 }, { status: 404 });
  }

  products.splice(index, 1);
  saveCollection("products", products);
  return NextResponse.json({ success: true });
}
