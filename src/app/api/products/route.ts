import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type {
  Product,
  ProductCategorySlug,
  ProductSortOption,
} from "@/features/products/types";
import { queryProducts } from "@/features/products/lib/productQuery";

function csv(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function numberParam(
  params: URLSearchParams,
  key: string,
): number | undefined {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function positiveInt(
  params: URLSearchParams,
  key: string,
): number | undefined {
  const value = numberParam(params, key);
  return value !== undefined && value > 0 ? Math.floor(value) : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const products = await getCollection<Product>("products");
  const category = searchParams.get("category")?.trim();
  const result = queryProducts(products, {
    search: searchParams.get("search")?.trim() || undefined,
    category: category ? (category as ProductCategorySlug) : undefined,
    brands: csv(searchParams, "brands"),
    series: csv(searchParams, "series"),
    modelKey: searchParams.get("modelKey")?.trim() || undefined,
    minPrice: numberParam(searchParams, "minPrice"),
    maxPrice: numberParam(searchParams, "maxPrice"),
    cpu: csv(searchParams, "cpu"),
    gpu: csv(searchParams, "gpu"),
    ram: csv(searchParams, "ram"),
    storage: csv(searchParams, "storage"),
    screenSize: csv(searchParams, "screenSize")
      .map(Number)
      .filter((value) => Number.isFinite(value)),
    ssd: searchParams.get("ssd") === "true",
    hdd: searchParams.get("hdd") === "true",
    inStockOnly: searchParams.get("inStockOnly") === "true",
    isFeatured: searchParams.get("isFeatured") === "true",
    isNewArrival: searchParams.get("isNewArrival") === "true",
    isBestSeller: searchParams.get("isBestSeller") === "true",
    sort:
      (searchParams.get("sort") as ProductSortOption | null) ?? "newest",
    page: positiveInt(searchParams, "page") ?? 1,
    pageSize: positiveInt(searchParams, "pageSize") ?? 24,
    all: searchParams.get("all") === "true",
  });

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
