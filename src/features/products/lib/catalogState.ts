import type {
  ProductCategorySlug,
  ProductQueryParams,
  ProductSortOption,
} from "../types";

/**
 * Shareable catalog state. The URL is the source of truth; these helpers keep
 * search, brand/category browsing, sorting, and comparison in sync.
 */
export interface CatalogState {
  search?: string;
  category?: ProductCategorySlug;
  brands: string[];
  series: string[];
  modelKey?: string;
  sort: ProductSortOption;
  compareIds: string[];
}

const SORT_VALUES = new Set<ProductSortOption>([
  "newest",
  "price_asc",
  "price_desc",
  "best_selling",
]);

const REMOVED_RATING_PARAMS = [
  "rating",
  "minRating",
  "maxRating",
  "reviewCount",
  "minReviews",
  "minReviewCount",
];

const REMOVED_FILTER_PARAMS = [
  "cpu",
  "gpu",
  "ram",
  "storage",
  "screenSize",
  "minPrice",
  "maxPrice",
  "ssd",
  "hdd",
  "inStockOnly",
  "page",
  "pageSize",
];

const CATEGORY_VALUES = new Set<string>([
  "laptops",
  "desktops",
  "pc-components",
  "used",
  "peripherals",
  "storage",
  "network",
  "speakers",
  "printers",
  "accessories",
]);

export const EMPTY_CATALOG_STATE: CatalogState = {
  brands: [],
  series: [],
  sort: "newest",
  compareIds: [],
};

function csv(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * Strip parameters left by removed features: ratings/reviews and the retired
 * dedicated filter panel. Returns true when the URL should be rewritten.
 */
export function removeRemovedCatalogParams(params: URLSearchParams): boolean {
  let changed = false;
  [...REMOVED_RATING_PARAMS, ...REMOVED_FILTER_PARAMS].forEach((key) => {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  });
  if (params.get("sort") === "highest_rating") {
    params.delete("sort");
    changed = true;
  }
  return changed;
}

export function parseCatalogState(params: URLSearchParams): CatalogState {
  const category = params.get("category");
  const sort = params.get("sort");
  const search = params.get("search")?.trim();
  const modelKey = params.get("modelKey")?.trim();

  return {
    search: search || undefined,
    category:
      category && CATEGORY_VALUES.has(category)
        ? (category as ProductCategorySlug)
        : undefined,
    brands: csv(params, "brands"),
    series: csv(params, "series"),
    modelKey: modelKey || undefined,
    sort:
      sort && SORT_VALUES.has(sort as ProductSortOption)
        ? (sort as ProductSortOption)
        : "newest",
    compareIds: csv(params, "compare"),
  };
}

export function serializeCatalogState(state: CatalogState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.search?.trim()) params.set("search", state.search.trim());
  if (state.category) params.set("category", state.category);
  if (state.brands.length) params.set("brands", state.brands.join(","));
  if (state.series.length) params.set("series", state.series.join(","));
  if (state.modelKey) params.set("modelKey", state.modelKey);
  if (state.sort !== "newest") params.set("sort", state.sort);
  if (state.compareIds.length)
    params.set("compare", state.compareIds.join(","));
  return params;
}

export type CatalogPatch =
  | Partial<CatalogState>
  | ((state: CatalogState) => Partial<CatalogState>);

/** Merge a change into the current catalog state. */
export function applyCatalogPatch(
  state: CatalogState,
  patch: CatalogPatch,
): CatalogState {
  const resolved = typeof patch === "function" ? patch(state) : patch;
  return { ...state, ...resolved };
}

/** "Clear search" leaves brand/category selections and sort intact. */
export function clearSearch(state: CatalogState): CatalogState {
  return { ...state, search: undefined };
}

/** Convert catalog state into an unpaginated API query. */
export function toProductQuery(state: CatalogState): ProductQueryParams {
  return {
    search: state.search,
    category: state.category,
    brands: state.brands.length ? state.brands : undefined,
    series: state.series.length ? state.series : undefined,
    modelKey: state.modelKey,
    sort: state.sort,
    all: true,
  };
}
