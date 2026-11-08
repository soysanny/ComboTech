import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Product } from "@/features/products/types";
import {
  DEFAULT_HOMEPAGE_BRAND_SECTIONS,
  HOMEPAGE_BRAND_SECTIONS_COLLECTION,
  MAX_PRODUCT_LIMIT,
  MIN_PRODUCT_LIMIT,
} from "@/features/homepage/constants";
import type {
  BrandSelectionMode,
  HomepageBrandProductOption,
  HomepageBrandSection,
  HomepageBrandSectionsAdminData,
} from "@/features/homepage/types";

function clampLimit(value: unknown): number {
  const limit = Number(value);
  if (!Number.isFinite(limit)) return MIN_PRODUCT_LIMIT;
  return Math.min(MAX_PRODUCT_LIMIT, Math.max(MIN_PRODUCT_LIMIT, Math.trunc(limit)));
}

function normalizeSections(input: unknown): HomepageBrandSection[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const sections: HomepageBrandSection[] = [];

  input.forEach((raw) => {
    if (!raw || typeof raw !== "object") return;
    const section = raw as Partial<HomepageBrandSection>;
    const brand = typeof section.brand === "string" ? section.brand.trim() : "";
    if (!brand) return;

    const key = brand.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const mode: BrandSelectionMode =
      section.selectionMode === "manual" ? "manual" : "auto";

    sections.push({
      id:
        typeof section.id === "string" && section.id
          ? section.id
          : `brand-${key}`,
      brand,
      enabled: section.enabled !== false,
      order: sections.length,
      productLimit: clampLimit(section.productLimit),
      selectionMode: mode,
      productIds: Array.isArray(section.productIds)
        ? section.productIds.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
    });
  });

  return sections;
}

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const [storedSections, products] = await Promise.all([
    getCollection<HomepageBrandSection>(HOMEPAGE_BRAND_SECTIONS_COLLECTION),
    getCollection<Product>("products"),
  ]);

  const sections = (
    storedSections.length > 0 ? storedSections : DEFAULT_HOMEPAGE_BRAND_SECTIONS
  )
    .slice()
    .sort((a, b) => a.order - b.order);

  const brands = Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b),
  );

  const productOptions: HomepageBrandProductOption[] = products.map(
    (product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      thumbnail: product.thumbnail,
    }),
  );

  const data: HomepageBrandSectionsAdminData = {
    sections,
    brands,
    products: productOptions,
  };

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const body = (await request.json()) as { sections?: unknown };
  const sections = normalizeSections(body.sections);

  await saveCollection(HOMEPAGE_BRAND_SECTIONS_COLLECTION, sections);

  return NextResponse.json({ data: sections });
}
