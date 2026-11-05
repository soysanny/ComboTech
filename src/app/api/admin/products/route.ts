import { NextResponse } from "next/server";
import { getCollection, saveCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Product, CreateProductInput } from "@/features/products/types";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search")?.trim().toLowerCase();

  let products = await getCollection<Product>("products");
  if (search) {
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        (product.productCode?.toLowerCase().includes(search) ?? false),
    );
  }

  return NextResponse.json(paginate(products, page, pageSize));
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const body = (await request.json()) as CreateProductInput;
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...body,
    id: `prod-${Date.now()}`,
    slug: slugify(body.name),
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const products = await getCollection<Product>("products");
  products.unshift(newProduct);
  await saveCollection("products", products);

  return NextResponse.json({ data: newProduct }, { status: 201 });
}
