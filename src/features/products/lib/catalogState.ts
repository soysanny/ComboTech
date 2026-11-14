import type {
  ProductCategorySlug,
  ProductQueryParams,
  ProductSortOption,
} from "../types";
import { parseBrandOnlySearch, resolveBrand } from "./catalogMeta";

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

const CATALOG_KEYS = new Set([
  "search",
  "category",
  "brands",
  "series",
  "modelKey",
  "sort",
  "compare",
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

function hasOwn(object: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Brand filtering is single-select. When a legacy URL or caller supplies
 * several brands, the last listed brand wins — the same rule the UI uses when
 * a new brand replaces the previous one.
 */
export function normalizeBrandSelection(
  brands: string[] | undefined,
): string[] {
  if (!brands?.length) return [];
  const last = brands[brands.length - 1]?.trim();
  if (!last) return [];
  const resolved = resolveBrand(last);
  return [resolved.known ? resolved.name : last];
}

function sameBrandSelection(a: string[], b: string[]): boolean {
  const left = normalizeBrandSelection(a);
  const right = normalizeBrandSelection(b);
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
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
  const brandSearch = parseBrandOnlySearch(search);
  // A recognized brand-only search is the newest selection, so it replaces
  // any brand retained in the URL.
  const brands = brandSearch
    ? [brandSearch.name]
    : normalizeBrandSelection(csv(params, "brands"));

  return {
    search: search || undefined,
    // Brand browsing spans every category. Keep category only when no brand is
    // selected, so legacy `category` + `brands` URLs normalize to the brand.
    category:
      brands.length === 0 && category && CATEGORY_VALUES.has(category)
        ? (category as ProductCategorySlug)
        : undefined,
    brands,
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
  const brands = normalizeBrandSelection(state.brands);
  if (brands.length === 0 && state.category) {
    params.set("category", state.category);
  }
  if (brands.length) params.set("brands", brands.join(","));
  if (state.series.length) params.set("series", state.series.join(","));
  if (state.modelKey) params.set("modelKey", state.modelKey);
  if (state.sort !== "newest") params.set("sort", state.sort);
  if (state.compareIds.length)
    params.set("compare", state.compareIds.join(","));
  return params;
}

/**
 * Canonical catalog query string, preserving unrelated URL parameters. Used
 * to rewrite legacy multi-brand URLs and brand-only search conflicts.
 */
export function normalizeCatalogParams(params: URLSearchParams): string {
  const working = new URLSearchParams(params);
  removeRemovedCatalogParams(working);

  const output = new URLSearchParams();
  working.forEach((value, key) => {
    if (!CATALOG_KEYS.has(key)) output.append(key, value);
  });
  serializeCatalogState(parseCatalogState(working)).forEach((value, key) => {
    output.set(key, value);
  });
  return output.toString();
}

export type CatalogPatch =
  | Partial<CatalogState>
  | ((state: CatalogState) => Partial<CatalogState>);

/**
 * Merge a change into the current catalog state.
 *
 * Invariants enforced here:
 * - only one brand can be selected;
 * - a brand selection clears the category so brand results span all categories;
 * - a brand-only search selects (replaces) that brand;
 * - choosing a different brand or "All brands" removes the obsolete
 *   brand-only search, while ordinary keywords such as "wireless mouse"
 *   are preserved.
 */
export function applyCatalogPatch(
  state: CatalogState,
  patch: CatalogPatch,
): CatalogState {
  const resolved = typeof patch === "function" ? patch(state) : patch;
  const hasBrands = hasOwn(resolved, "brands");
  const hasSearch = hasOwn(resolved, "search");
  const next: CatalogState = {
    ...state,
    ...resolved,
    brands: normalizeBrandSelection(
      hasBrands ? resolved.brands : state.brands,
    ),
  };

  const brandsChanged =
    hasBrands &&
    !sameBrandSelection(next.brands, state.brands);
  const searchChanged =
    hasSearch &&
    (next.search?.trim() ?? "") !== (state.search?.trim() ?? "");
  const brandSearch = parseBrandOnlySearch(next.search);

  if (brandSearch) {
    if (searchChanged) {
      // The search is the newest action, so it replaces the selected brand.
      next.brands = [brandSearch.name];
    } else if (brandsChanged) {
      const selected = next.brands[0]
        ? resolveBrand(next.brands[0])
        : undefined;
      if (!selected || selected.id !== brandSearch.id) {
        // Brand selection is newer than the retained brand-only search.
        next.search = undefined;
      } else {
        next.brands = [brandSearch.name];
      }
    } else {
      const selected = next.brands[0]
        ? resolveBrand(next.brands[0])
        : undefined;
      if (!selected || selected.id !== brandSearch.id) {
        next.brands = [brandSearch.name];
      }
    }
  } else if (brandsChanged) {
    const previousBrandSearch = parseBrandOnlySearch(state.search);
    const searchUnchanged =
      !hasSearch ||
      (next.search?.trim() ?? "") === (state.search?.trim() ?? "");
    const selected = next.brands[0]
      ? resolveBrand(next.brands[0])
      : undefined;

    if (
      previousBrandSearch &&
      searchUnchanged &&
      (!selected || selected.id !== previousBrandSearch.id)
    ) {
      next.search = undefined;
    }
  }

  // Brand browsing spans every category. Selecting a brand or "All brands"
  // clears the category filter; a brand can never coexist with a category.
  if (hasBrands || next.brands.length > 0) {
    next.category = undefined;
  }

  return next;
}

/** "Clear search" leaves brand/category selections and sort intact. */
export function clearSearch(state: CatalogState): CatalogState {
  return { ...state, search: undefined };
}

/** Remove the brand restriction, including a brand-only search. */
export function clearBrandFilter(state: CatalogState): CatalogState {
  return applyCatalogPatch(state, { brands: [] });
}

/** Remove search and every browse/filter selection while keeping sort. */
export function clearAllFilters(state: CatalogState): CatalogState {
  return applyCatalogPatch(state, {
    search: undefined,
    brands: [],
    category: undefined,
    series: [],
    modelKey: undefined,
  });
}

/** Convert catalog state into an unpaginated API query. */
export function toProductQuery(state: CatalogState): ProductQueryParams {
  const brandSearch = parseBrandOnlySearch(state.search);
  const brands = brandSearch
    ? [brandSearch.name]
    : normalizeBrandSelection(state.brands);

  return {
    search: brandSearch ? undefined : state.search,
    category: brands.length ? undefined : state.category,
    brands: brands.length ? brands : undefined,
    series: state.series.length ? state.series : undefined,
    modelKey: state.modelKey,
    sort: state.sort,
    all: true,
  };
}
