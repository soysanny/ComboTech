import type { Product, ProductCategorySlug } from "../types";

/**
 * Canonical catalog vocabulary.
 *
 * Brand, category, and series are deliberately separate concepts. Brand values
 * are resolved to a stable id so filtering does not depend on display casing.
 * Nothing in this module infers a brand from a product title: unknown brand
 * strings are kept as-is and reported for manual review instead.
 */
export interface BrandDefinition {
  id: string;
  name: string;
  aliases?: string[];
}

export const CATALOG_BRANDS: BrandDefinition[] = [
  { id: "acer", name: "ACER", aliases: ["Acer"] },
  { id: "apple", name: "APPLE", aliases: ["Apple"] },
  { id: "asus", name: "ASUS", aliases: ["Asus"] },
  { id: "cooler-master", name: "COOLER MASTER", aliases: ["CoolerMaster"] },
  { id: "dell", name: "DELL", aliases: ["Dell"] },
  { id: "dji", name: "DJI", aliases: ["Dji"] },
  { id: "epson", name: "EPSON", aliases: ["Epson"] },
  { id: "forge", name: "Forge" },
  { id: "gigabyte", name: "GIGABYTE", aliases: ["Gigabyte"] },
  { id: "hp", name: "HP", aliases: ["Hp"] },
  { id: "jonbo", name: "JONBO", aliases: ["Jonbo"] },
  { id: "kaspersky", name: "KASPERSKY", aliases: ["Kaspersky"] },
  { id: "lenovo", name: "LENOVO", aliases: ["Lenovo"] },
  { id: "logitech", name: "LOGITECH", aliases: ["Logitech"] },
  { id: "microsoft", name: "MICROSOFT", aliases: ["Microsoft"] },
  { id: "msi", name: "MSI", aliases: ["Msi"] },
  { id: "nova", name: "Nova" },
  { id: "nzxt", name: "NZXT", aliases: ["Nzxt"] },
  { id: "razer", name: "RAZER", aliases: ["Razer"] },
  { id: "samsung", name: "SAMSUNG", aliases: ["Samsung"] },
  { id: "teamgroup", name: "TEAMGROUP", aliases: ["TeamGroup", "Team Group"] },
  { id: "ugreen", name: "UGREEN", aliases: ["Ugreen"] },
];

/**
 * These values appear in the `brand` field but describe a component type, not
 * a manufacturer. They are excluded from selectable brands and reported for
 * manual review instead of being guessed from the product title.
 */
export const PLACEHOLDER_BRANDS = new Set([
  "cooling",
  "gpu partner",
  "memory",
  "other",
  "processor",
  "storage",
  "network",
]);

export interface CategoryDefinition {
  id: string;
  slug: ProductCategorySlug;
  name: string;
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { id: "cat-laptops", slug: "laptops", name: "Laptops" },
  { id: "cat-desktops", slug: "desktops", name: "Desktops" },
  { id: "cat-pc-components", slug: "pc-components", name: "PC Parts" },
  { id: "cat-used", slug: "used", name: "Used Computers" },
  { id: "cat-peripherals", slug: "peripherals", name: "Peripherals" },
  { id: "cat-storage", slug: "storage", name: "Storage" },
  { id: "cat-network", slug: "network", name: "Network" },
  { id: "cat-speakers", slug: "speakers", name: "Speakers" },
  { id: "cat-printers", slug: "printers", name: "Printers" },
  { id: "cat-accessories", slug: "accessories", name: "Accessories" },
];

export const CATEGORY_BY_SLUG = new Map(
  CATEGORY_DEFINITIONS.map((category) => [category.slug, category]),
);

export const CATEGORY_BY_ID = new Map(
  CATEGORY_DEFINITIONS.map((category) => [category.id, category]),
);

const BRAND_BY_ID = new Map(CATALOG_BRANDS.map((brand) => [brand.id, brand]));
const BRAND_BY_ALIAS = new Map<string, BrandDefinition>();
CATALOG_BRANDS.forEach((brand) => {
  BRAND_BY_ALIAS.set(slugifyCatalogValue(brand.name), brand);
  brand.aliases?.forEach((alias) =>
    BRAND_BY_ALIAS.set(slugifyCatalogValue(alias), brand),
  );
});

const SERIES_CANONICAL: Record<string, string> = {
  macbook: "MacBook",
  expertbook: "ExpertBook",
  vivobook: "Vivobook",
  inspiron: "Inspiron",
  ideapad: "IdeaPad",
  modern: "Modern",
  cyborg: "Cyborg",
  yoga: "Yoga",
  loq: "LOQ",
  legion: "Legion",
  nitro: "Nitro",
  rog: "ROG",
  tuf: "TUF",
  stealth: "Stealth",
  latitude: "Latitude",
  thinkpad: "ThinkPad",
  kraken: "Kraken",
  deathadder: "DeathAdder",
  cobra: "Cobra",
  alienware: "Alienware",
  predator: "Predator",
  pavilion: "Pavilion",
  envy: "Envy",
  probook: "ProBook",
  omen: "Omen",
  aspire: "Aspire",
  summit: "Summit",
  raider: "Raider",
};

/** Stable id used for brand, category, and series relationships. */
export function slugifyCatalogValue(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isPlaceholderBrand(value?: string | null): boolean {
  return PLACEHOLDER_BRANDS.has(
    (value ?? "").toLowerCase().replace(/\s+/g, " ").trim(),
  );
}

export interface ResolvedBrand {
  id: string;
  name: string;
  known: boolean;
  placeholder: boolean;
}

/** Resolve a brand string (name or id) without using the product title. */
export function resolveBrand(value?: string | null): ResolvedBrand {
  const raw = (value ?? "").trim();
  const key = slugifyCatalogValue(raw);
  const known = BRAND_BY_ID.get(key) ?? BRAND_BY_ALIAS.get(key);
  if (known) {
    return { id: known.id, name: known.name, known: true, placeholder: false };
  }
  const normalized = raw.toLowerCase().replace(/\s+/g, " ").trim();
  return {
    id: key || "unknown",
    name: raw || "Unknown",
    known: false,
    placeholder: PLACEHOLDER_BRANDS.has(normalized),
  };
}

/** Selectable brand names for the storefront and product editor. */
export const SELECTABLE_BRANDS = CATALOG_BRANDS.map((brand) => brand.name);

export function categoryIdFor(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  return CATEGORY_BY_SLUG.get(slug as ProductCategorySlug)?.id;
}

/** Normalize a series value and drop values that merely repeat the brand. */
export function resolveSeries(
  value?: string | null,
  brand?: string | null,
): { name?: string; id?: string } {
  const raw = (value ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return {};
  const brandKey = slugifyCatalogValue(brand ?? "");
  const key = slugifyCatalogValue(raw);
  if (!key || key === brandKey) return {};
  return {
    name: SERIES_CANONICAL[key] ?? raw,
    id: key,
  };
}

export const SERIES_BY_BRAND: Record<string, string[]> = {
  acer: ["Nitro", "Predator", "Aspire"],
  apple: ["MacBook"],
  asus: ["ROG", "TUF", "Vivobook", "ExpertBook"],
  dell: ["Inspiron", "Latitude", "Alienware", "XPS"],
  gigabyte: ["Aero", "Aorus"],
  hp: ["Pavilion", "Envy", "ProBook", "Omen"],
  lenovo: ["IdeaPad", "Legion", "LOQ", "ThinkPad", "Yoga"],
  msi: ["Modern", "Cyborg", "Stealth", "Summit", "Raider"],
  razer: ["Kraken", "DeathAdder", "Cobra", "BlackWidow"],
};

export const ALL_SERIES = Array.from(
  new Set(Object.values(SERIES_BY_BRAND).flat()),
).sort((a, b) => a.localeCompare(b));

export function seriesOptionsForBrand(brand?: string | null): string[] {
  const resolved = resolveBrand(brand);
  const preset = SERIES_BY_BRAND[resolved.id] ?? [];
  return Array.from(new Set([...preset, ...ALL_SERIES])).sort((a, b) =>
    a.localeCompare(b),
  );
}

/**
 * Apply stable relationship ids and canonical casing to a product record.
 * Brand assignment is never derived from the title.
 */
export function withCatalogIdentity<T extends Partial<Product>>(product: T): T {
  const brand = resolveBrand(product.brand);
  const series = resolveSeries(product.series, product.brand);
  const category = product.category as ProductCategorySlug | undefined;
  return {
    ...product,
    brand: brand.name,
    brandId: brand.id,
    categoryId: category ? categoryIdFor(category) : product.categoryId,
    series: series.name,
    seriesId: series.id,
  };
}

/** Records that need a human to confirm the brand relationship. */
export function findCatalogReviewRecords(product: Product): string[] {
  const issues: string[] = [];
  const brand = resolveBrand(product.brand);
  if (brand.placeholder) {
    issues.push(`brand "${product.brand}" is a component type, not a manufacturer`);
  } else if (!brand.known) {
    issues.push(`unknown brand "${product.brand}"`);
  }
  if (product.series && slugifyCatalogValue(product.series) === brand.id) {
    issues.push("series repeats the brand");
  }
  return issues;
}
