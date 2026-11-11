import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Product } from "@/features/products/types";
import {
  DEFAULT_HOMEPAGE_BRAND_SECTIONS,
  HOMEPAGE_BRAND_SECTIONS_COLLECTION,
} from "@/features/homepage/constants";
import type {
  HomepageBrandSection,
  HomepageBrandSectionView,
} from "@/features/homepage/types";

export const dynamic = "force-dynamic";

function uniqueByName(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = product.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function selectProducts(
  section: HomepageBrandSection,
  products: Product[],
): Product[] {
  const brandProducts = products.filter(
    (product) => product.brand.toLowerCase() === section.brand.toLowerCase(),
  );

  const byPopularity = uniqueByName(
    [...brandProducts].sort(
      (a, b) =>
        b.soldCount - a.soldCount ||
        b.rating - a.rating ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  if (section.selectionMode === "manual" && section.productIds.length > 0) {
    const byId = new Map(brandProducts.map((product) => [product.id, product]));
    const manual = uniqueByName(
      section.productIds
        .map((id) => byId.get(id))
        .filter((product): product is Product => Boolean(product)),
    );
    const selectedIds = new Set(manual.map((product) => product.id));
    const fillers = byPopularity.filter(
      (product) => !selectedIds.has(product.id),
    );
    return [...manual, ...fillers].slice(0, section.productLimit);
  }

  return byPopularity.slice(0, section.productLimit);
}

export async function GET() {
  const [storedSections, products] = await Promise.all([
    getCollection<HomepageBrandSection>(HOMEPAGE_BRAND_SECTIONS_COLLECTION),
    getCollection<Product>("products"),
  ]);

  const sections = (
    storedSections.length > 0 ? storedSections : DEFAULT_HOMEPAGE_BRAND_SECTIONS
  )
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const data: HomepageBrandSectionView[] = sections
    .map((section) => ({
      ...section,
      products: selectProducts(section, products),
    }))
    .filter((section) => section.products.length > 0);

  return NextResponse.json({ data });
}
