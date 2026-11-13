import type {
  Product,
  ProductFilters,
  ProductSortOption,
  ProductSpecs,
} from "../types";
import {
  CATEGORY_BY_SLUG,
  resolveBrand,
  resolveSeries,
  slugifyCatalogValue,
} from "./catalogMeta";

/**
 * Pure search / filter / sort pipeline for the storefront catalog.
 *
 * Filter groups combine with AND. Values inside one group combine with OR.
 * Every condition is evaluated against the same product row (a row is one
 * sellable variant), so RAM from one variant is never combined with the price
 * of another. Grouping happens only after the variant-level filtering.
 */

const EXACT_MATCH_SCORE = 900;

export interface SearchResult {
  score: number;
  exact: boolean;
}

export function normalizeText(value?: string | number | null): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u00ae\u2122]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function compactText(value?: string | number | null): string {
  return normalizeText(value).replace(/[^a-z0-9]/g, "");
}

function specValues(specs: ProductSpecs | undefined): string[] {
  if (!specs) return [];
  return [
    specs.cpu,
    specs.gpu,
    specs.ram,
    specs.storage,
    specs.ssd,
    specs.hdd,
    specs.display,
    specs.os,
    specs.color,
    specs.features,
    specs.battery,
    specs.weight,
    ...(specs.ports ?? []),
  ].filter((value): value is string => Boolean(value?.trim()));
}

function searchableValues(product: Product): string[] {
  const category = CATEGORY_BY_SLUG.get(product.category);
  const brand = resolveBrand(product.brand);
  return [
    product.name,
    product.brand,
    brand.name,
    product.series,
    category?.name,
    category?.slug,
    product.productCode,
    product.modelKey,
    product.slug,
    ...specValues(product.specs),
    ...(product.tags ?? []),
  ].filter((value): value is string => Boolean(value?.trim()));
}

/** Score a product against a search query. Exact model/SKU matches win. */
export function scoreProductSearch(
  product: Product,
  query?: string | null,
): SearchResult {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return { score: 0, exact: false };

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  const compactQuery = compactText(normalizedQuery);
  const codes = [product.productCode, product.modelKey, product.slug]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => ({ raw: normalizeText(value), compact: compactText(value) }));

  if (codes.some((code) => code.raw === normalizedQuery)) {
    return { score: 1000, exact: true };
  }
  if (codes.some((code) => code.compact && code.compact === compactQuery)) {
    return { score: 980, exact: true };
  }

  const normalizedName = normalizeText(product.name);
  if (normalizedName === normalizedQuery) {
    return { score: EXACT_MATCH_SCORE + 50, exact: true };
  }
  if (codes.some((code) => code.raw.includes(normalizedQuery))) {
    return { score: 850, exact: true };
  }
  if (
    tokens.length > 1 &&
    tokens.every((token) =>
      codes.some((code) => code.compact.includes(compactText(token))),
    )
  ) {
    return { score: 800, exact: true };
  }

  if (tokens.every((token) => normalizedName.includes(token))) {
    return { score: 650, exact: false };
  }

  const brand = resolveBrand(product.brand);
  if (
    tokens.every(
      (token) =>
        normalizeText(brand.name).includes(token) ||
        token === compactText(brand.name),
    )
  ) {
    return { score: 500, exact: false };
  }

  const series = resolveSeries(product.series, product.brand);
  if (series.name) {
    const normalizedSeries = normalizeText(series.name);
    if (tokens.every((token) => normalizedSeries.includes(token))) {
      return { score: 450, exact: false };
    }
  }

  const specs = specValues(product.specs).map(normalizeText);
  if (tokens.every((token) => specs.some((value) => value.includes(token)))) {
    return { score: 300, exact: false };
  }

  const haystack = searchableValues(product)
    .map(normalizeText)
    .join(" ");
  if (tokens.every((token) => haystack.includes(token))) {
    return { score: 150, exact: false };
  }

  if (
    normalizedQuery.length >= 4 &&
    normalizeText(product.description).includes(normalizedQuery)
  ) {
    return { score: 20, exact: false };
  }

  return { score: 0, exact: false };
}

function capacityTokens(value: string): Set<string> {
  const tokens = new Set<string>();
  const pattern = /(\d+(?:\.\d+)?)\s*(tb|gb|mb)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    tokens.add(`${Number(match[1])}${match[2].toLowerCase()}`);
  }
  return tokens;
}

function isCapacityOption(value: string): boolean {
  return /^\d+(?:\.\d+)?\s*(tb|gb|mb)$/i.test(value.trim());
}

function matchesSelectedValues(
  value: string | number | undefined,
  selected: string[] | undefined,
): boolean {
  if (!selected || selected.length === 0) return true;
  if (value === undefined || value === null || value === "") return false;

  const normalizedValue = normalizeText(value);
  const compactValue = compactText(value);
  const valueCapacities = capacityTokens(String(value));

  return selected.some((option) => {
    const normalizedOption = normalizeText(option);
    if (!normalizedOption) return false;
    if (isCapacityOption(normalizedOption)) {
      const optionCapacity = capacityTokens(normalizedOption);
      return Array.from(optionCapacity).some((capacity) =>
        valueCapacities.has(capacity),
      );
    }
    return (
      normalizedValue.includes(normalizedOption) ||
      (compactValue !== "" &&
        compactValue.includes(compactText(normalizedOption)))
    );
  });
}

function matchesScreenSize(
  value: number | undefined,
  selected: number[] | undefined,
): boolean {
  if (!selected || selected.length === 0) return true;
  if (typeof value !== "number" || Number.isNaN(value)) return false;
  return selected.some((option) => Math.abs(value - option) < 0.05);
}

function hasDriveType(product: Product, type: "ssd" | "hdd"): boolean {
  const direct = product.specs?.[type];
  if (direct && !/^(no|none|n\/a|false)$/i.test(direct.trim())) return true;
  const combined = normalizeText(
    [product.specs?.storage, product.specs?.ssd, product.specs?.hdd]
      .filter(Boolean)
      .join(" "),
  );
  return combined.includes(type);
}

function matchesBrand(product: Product, selected: string[] | undefined): boolean {
  if (!selected || selected.length === 0) return true;
  const productBrand = resolveBrand(product.brandId ?? product.brand).id;
  return selected.some(
    (value) => resolveBrand(value).id === productBrand,
  );
}

function matchesSeries(product: Product, selected: string[] | undefined): boolean {
  if (!selected || selected.length === 0) return true;
  const productSeries =
    product.seriesId ??
    resolveSeries(product.series, product.brand).id ??
    "";
  return selected.some(
    (value) => slugifyCatalogValue(value) === productSeries,
  );
}

/** True when a single sellable variant satisfies every active filter group. */
export function matchesVariantFilters(
  product: Product,
  filters: ProductFilters,
): boolean {
  if (filters.brands?.length && !matchesBrand(product, filters.brands)) {
    return false;
  }
  if (filters.series?.length && !matchesSeries(product, filters.series)) {
    return false;
  }
  if (filters.category && product.category !== filters.category) {
    return false;
  }
  if (filters.modelKey && product.modelKey !== filters.modelKey) {
    return false;
  }
  if (typeof filters.minPrice === "number" && product.price < filters.minPrice) {
    return false;
  }
  if (typeof filters.maxPrice === "number" && product.price > filters.maxPrice) {
    return false;
  }
  if (filters.inStockOnly && product.stock <= 0) return false;
  if (filters.isFeatured && !product.isFeatured) return false;
  if (filters.isNewArrival && !product.isNewArrival) return false;
  if (filters.isBestSeller && !product.isBestSeller) return false;
  if (filters.ssd && !hasDriveType(product, "ssd")) return false;
  if (filters.hdd && !hasDriveType(product, "hdd")) return false;

  if (!matchesSelectedValues(product.specs?.cpu, filters.cpu)) return false;
  if (!matchesSelectedValues(product.specs?.gpu, filters.gpu)) return false;
  if (!matchesSelectedValues(product.specs?.ram, filters.ram)) return false;
  if (!matchesSelectedValues(product.specs?.storage, filters.storage)) {
    return false;
  }
  if (!matchesScreenSize(product.specs?.screenSize, filters.screenSize)) {
    return false;
  }

  return true;
}

function compareBySort(
  a: Product,
  b: Product,
  sort: ProductSortOption,
): number {
  switch (sort) {
    case "price_asc":
      return a.price - b.price;
    case "price_desc":
      return b.price - a.price;
    case "best_selling":
      return b.soldCount - a.soldCount;
    case "newest":
    default:
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

interface MatchedVariant {
  product: Product;
  score: number;
  exact: boolean;
}

interface ProductGroup {
  key: string;
  variants: MatchedVariant[];
  score: number;
  exact: boolean;
  representative: Product;
}

function pickRepresentative(variants: MatchedVariant[]): MatchedVariant {
  const hasExact = variants.some((variant) => variant.exact);
  return [...variants].sort((a, b) => {
    if (hasExact && a.exact !== b.exact) return a.exact ? -1 : 1;
    if (hasExact && a.score !== b.score) return b.score - a.score;
    if (a.product.price !== b.product.price) {
      return a.product.price - b.product.price;
    }
    return a.product.id.localeCompare(b.product.id);
  })[0];
}

function groupMatches(variants: MatchedVariant[]): ProductGroup[] {
  const groups = new Map<string, MatchedVariant[]>();
  variants.forEach((variant) => {
    const key =
      variant.product.modelKey?.trim() || `product:${variant.product.id}`;
    const existing = groups.get(key);
    if (existing) existing.push(variant);
    else groups.set(key, [variant]);
  });

  return Array.from(groups.entries()).map(([key, groupVariants]) => {
    const representative = pickRepresentative(groupVariants);
    return {
      key,
      variants: groupVariants,
      score: Math.max(...groupVariants.map((variant) => variant.score)),
      exact: groupVariants.some((variant) => variant.exact),
      representative: representative.product,
    };
  });
}

export interface ProductQueryResult<T extends Product = Product> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProductQueryOptions extends ProductFilters {
  page?: number;
  pageSize?: number;
  /** Return every matching product without slicing. */
  all?: boolean;
}

/**
 * Full pipeline: search + variant filters -> group -> sort -> count -> page.
 * Grouping happens after filtering so a card can only be represented by a
 * configuration that satisfies the active filters.
 */
export function queryProducts(
  products: Product[],
  options: ProductQueryOptions = {},
): ProductQueryResult {
  const all = options.all === true;
  const page = all ? 1 : Math.max(1, Math.floor(options.page ?? 1) || 1);
  const requestedPageSize = Math.max(
    1,
    Math.floor(options.pageSize ?? 24) || 24,
  );
  const sort = options.sort ?? "newest";

  const matched: MatchedVariant[] = [];
  products.forEach((product) => {
    if (!matchesVariantFilters(product, options)) return;
    const search = scoreProductSearch(product, options.search);
    if (options.search?.trim() && search.score === 0) return;
    matched.push({
      product,
      score: search.score,
      exact: search.exact,
    });
  });

  const groups = groupMatches(matched);

  groups.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.exact !== b.exact) return a.exact ? -1 : 1;
    const sorted = compareBySort(a.representative, b.representative, sort);
    if (sorted !== 0) return sorted;
    return a.representative.id.localeCompare(b.representative.id);
  });

  const total = groups.length;
  const pageSize = all ? Math.max(1, total) : requestedPageSize;
  const totalPages = all ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const start = all ? 0 : (page - 1) * pageSize;
  const end = all ? total : start + pageSize;

  return {
    data: groups
      .slice(start, end)
      .map((group) => group.representative),
    page,
    pageSize,
    total,
    totalPages,
  };
}
