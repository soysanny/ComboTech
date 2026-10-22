import { NextResponse } from "next/server";
import { getCollection, paginate } from "@/lib/db";
import type { Product } from "@/features/products/types";

function applyFilters(products: Product[], params: URLSearchParams): Product[] {
  let result = [...products];
  const search = params.get("search")?.toLowerCase();
  const category = params.get("category");
  const brand = params.get("brands");
  const series = params.get("series");
  const modelKey = params.get("modelKey");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const inStockOnly = params.get("inStockOnly");
  const sort = params.get("sort");

  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        (p.series?.toLowerCase().includes(search) ?? false) ||
        (p.productCode?.toLowerCase().includes(search) ?? false) ||
        p.description.toLowerCase().includes(search),
    );
  }
  if (category) result = result.filter((p) => p.category === category);
  if (brand) {
    const brands = brand.split(",").map((b) => b.toLowerCase());
    result = result.filter((p) => brands.includes(p.brand.toLowerCase()));
  }
  if (series) {
    const seriesList = series.split(",").map((s) => s.toLowerCase());
    result = result.filter(
      (p) => p.series && seriesList.includes(p.series.toLowerCase()),
    );
  }
  if (modelKey) {
    result = result.filter((p) => p.modelKey === modelKey);
  }
  if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
  if (inStockOnly === "true") result = result.filter((p) => p.stock > 0);

  switch (sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "best_selling":
      result.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case "highest_rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "12");

  const products = getCollection<Product>("products");
  const filtered = applyFilters(products, searchParams);

  return NextResponse.json(paginate(filtered, page, pageSize));
}
