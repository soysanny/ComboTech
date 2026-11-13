import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import { withCatalogIdentity } from "@/features/products/lib/catalogMeta";
import type { CreateProductInput, Product } from "@/features/products/types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const body = (await request.json()) as { products?: unknown };
  if (!Array.isArray(body.products)) {
    return NextResponse.json(
      { message: "products must be an array." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const existing = await getCollection<Product>("products");
  const created: Product[] = [];
  let skipped = 0;

  body.products.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") {
      skipped += 1;
      return;
    }

    const input = raw as Partial<CreateProductInput>;
    if (
      !input.name ||
      !input.brand ||
      !input.category ||
      typeof input.price !== "number"
    ) {
      skipped += 1;
      return;
    }

    created.push(
      withCatalogIdentity<Product>({
        ...input,
        id: `prod-${Date.now()}-${index}`,
        slug: slugify(input.name),
        soldCount: 0,
        createdAt: now,
        updatedAt: now,
      } as Product),
    );
  });

  if (created.length > 0) {
    await saveCollection("products", [...created, ...existing]);
  }

  return NextResponse.json({ created: created.length, skipped });
}
