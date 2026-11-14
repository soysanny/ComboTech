import test from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_CATALOG_STATE,
  applyCatalogPatch,
  clearAllFilters,
  clearBrandFilter,
  clearSearch,
  normalizeBrandSelection,
  normalizeCatalogParams,
  parseCatalogState,
  removeRemovedCatalogParams,
  serializeCatalogState,
  toProductQuery,
  type CatalogState,
} from "../src/features/products/lib/catalogState";
import { CATEGORY_NAV } from "../src/constants/site";

function state(overrides: Partial<CatalogState> = {}): CatalogState {
  return { ...EMPTY_CATALOG_STATE, ...overrides };
}

test("URL state round-trips search, single brand, sort, and comparison", () => {
  const original = state({
    search: "Dell XPS",
    category: undefined,
    modelKey: undefined,
    brands: ["DELL"],
    series: ["XPS"],
    sort: "price_asc",
    compareIds: ["p1", "p2"],
  });

  const parsed = parseCatalogState(serializeCatalogState(original));

  assert.deepEqual(parsed, original);
});

test("legacy multi-brand URLs normalize to the last listed brand", () => {
  const parsed = parseCatalogState(
    new URLSearchParams("brands=UGREEN,GIGABYTE"),
  );
  assert.deepEqual(parsed.brands, ["GIGABYTE"]);
  assert.equal(
    normalizeCatalogParams(new URLSearchParams("brands=UGREEN,GIGABYTE")),
    "brands=GIGABYTE",
  );
});

test("legacy category+brand URLs normalize to the brand alone", () => {
  const params = new URLSearchParams("category=desktops&brands=APPLE");
  const parsed = parseCatalogState(params);

  assert.equal(parsed.category, undefined);
  assert.deepEqual(parsed.brands, ["APPLE"]);
  assert.equal(normalizeCatalogParams(params), "brands=APPLE");
});

test("brand selection always keeps a single canonical brand", () => {
  assert.deepEqual(normalizeBrandSelection(["UGREEN", "GIGABYTE"]), [
    "GIGABYTE",
  ]);
  assert.equal(
    serializeCatalogState(state({ brands: ["UGREEN", "GIGABYTE"] })).toString(),
    "brands=GIGABYTE",
  );
});

test("brand-only searches select the matching brand", () => {
  ["Apple", "apple", "Apple brand", "brand apple"].forEach((search) => {
    const parsed = parseCatalogState(
      new URLSearchParams(`search=${encodeURIComponent(search)}`),
    );
    assert.deepEqual(parsed.brands, ["APPLE"]);
    assert.equal(parsed.search, search);
  });
});

test("a brand-only search replaces a previously selected brand", () => {
  const current = state({ search: "Apple", brands: ["ASUS"] });

  const next = applyCatalogPatch(current, { search: "Apple brand" });

  assert.deepEqual(next.brands, ["APPLE"]);
  assert.equal(next.search, "Apple brand");
});

test("selecting a new brand replaces the old brand, clears its search, and clears the category", () => {
  const current = state({
    search: "Apple",
    category: "laptops",
    brands: ["APPLE"],
    sort: "price_asc",
  });

  const next = applyCatalogPatch(current, {
    search: current.search,
    brands: ["UGREEN", "GIGABYTE"],
  });

  assert.deepEqual(next.brands, ["GIGABYTE"]);
  assert.equal(next.search, undefined);
  assert.equal(next.category, undefined);
  assert.equal(next.sort, "price_asc");
});

test("selecting a brand clears the category from the URL", () => {
  const current = state({ category: "desktops" });

  const next = applyCatalogPatch(current, { brands: ["APPLE"] });

  assert.equal(next.category, undefined);
  assert.deepEqual(next.brands, ["APPLE"]);
  assert.equal(serializeCatalogState(next).toString(), "brands=APPLE");
});

test("a changed search wins even when the patch also carries the old brand", () => {
  const current = state({ brands: ["UGREEN"] });

  const next = applyCatalogPatch(current, {
    search: "Apple",
    brands: ["UGREEN"],
  });

  assert.equal(next.search, "Apple");
  assert.deepEqual(next.brands, ["APPLE"]);
});

test("selecting the same brand keeps a brand-only search", () => {
  const current = state({ search: "Apple", brands: ["APPLE"] });

  const next = applyCatalogPatch(current, { brands: ["APPLE"] });

  assert.deepEqual(next.brands, ["APPLE"]);
  assert.equal(next.search, "Apple");
});

test("All brands removes the brand filter and a brand-only search", () => {
  const current = state({ search: "Apple", brands: ["APPLE"] });

  const next = clearBrandFilter(current);

  assert.deepEqual(next.brands, []);
  assert.equal(next.search, undefined);
});

test("All brands preserves meaningful product keywords", () => {
  const current = state({ search: "wireless mouse", brands: ["APPLE"] });

  const next = clearBrandFilter(current);

  assert.deepEqual(next.brands, []);
  assert.equal(next.search, "wireless mouse");
});

test("changing brand preserves non-brand product keywords", () => {
  const current = state({
    search: "wireless mouse",
    brands: ["UGREEN"],
  });

  const next = applyCatalogPatch(current, { brands: ["GIGABYTE"] });

  assert.deepEqual(next.brands, ["GIGABYTE"]);
  assert.equal(next.search, "wireless mouse");
});

test("changing search text preserves brand selection, sort, and comparison", () => {
  const current = state({
    search: "wireless",
    brands: ["DELL"],
    sort: "price_desc",
    compareIds: ["p1"],
  });

  const next = applyCatalogPatch(current, { search: "wireless mouse" });

  assert.equal(next.search, "wireless mouse");
  assert.deepEqual(next.brands, ["DELL"]);
  assert.equal(next.sort, "price_desc");
  assert.deepEqual(next.compareIds, ["p1"]);
});

test("a category cannot coexist with a selected brand", () => {
  const current = state({
    search: "ASUS",
    brands: ["ASUS"],
  });

  const next = applyCatalogPatch(current, { category: "desktops" });

  assert.equal(next.search, "ASUS");
  assert.equal(next.category, undefined);
  assert.deepEqual(next.brands, ["ASUS"]);
});

test("every storefront category link selects its category", () => {
  CATEGORY_NAV.forEach((category) => {
    const parsed = parseCatalogState(
      new URLSearchParams(`category=${category.slug}`),
    );
    assert.equal(parsed.category, category.slug);
  });
});

test("changing category preserves other filters and clears stale pagination", () => {
  const current = state({
    search: "wireless mouse",
    sort: "price_asc",
  });

  const next = applyCatalogPatch(current, { category: "peripherals" });

  assert.equal(next.category, "peripherals");
  assert.equal(next.search, "wireless mouse");
  assert.equal(next.sort, "price_asc");

  const url = new URLSearchParams("category=laptops&page=3");
  assert.equal(parseCatalogState(url).category, "laptops");
  assert.equal(normalizeCatalogParams(url), "category=laptops");
});

test("All brands clears the category filter and keeps meaningful keywords", () => {
  const current = state({
    search: "wireless mouse",
    category: "peripherals",
  });

  const next = applyCatalogPatch(current, { brands: [] });

  assert.equal(next.category, undefined);
  assert.equal(next.search, "wireless mouse");
  assert.deepEqual(next.brands, []);
});

test("changing sort keeps query and selections", () => {
  const current = state({
    search: "wireless mouse",
    category: "laptops",
  });

  const next = applyCatalogPatch(current, { sort: "price_asc" });

  assert.equal(next.search, "wireless mouse");
  assert.equal(next.category, "laptops");
  assert.deepEqual(next.brands, []);
  assert.equal(next.sort, "price_asc");
});

test("clear search clears only the query", () => {
  const current = state({
    search: "Dell",
    category: "laptops",
    sort: "price_asc",
  });

  const next = clearSearch(current);

  assert.equal(next.search, undefined);
  assert.equal(next.category, "laptops");
  assert.deepEqual(next.brands, []);
  assert.equal(next.sort, "price_asc");
});

test("clear all filters removes search and browse selections but keeps sort", () => {
  const current = state({
    search: "wireless mouse",
    category: "peripherals",
    brands: ["LOGITECH"],
    series: ["Kraken"],
    modelKey: "model-1",
    sort: "price_asc",
    compareIds: ["p1"],
  });

  const next = clearAllFilters(current);

  assert.equal(next.search, undefined);
  assert.equal(next.category, undefined);
  assert.deepEqual(next.brands, []);
  assert.deepEqual(next.series, []);
  assert.equal(next.modelKey, undefined);
  assert.equal(next.sort, "price_asc");
  assert.deepEqual(next.compareIds, ["p1"]);
});

test("toProductQuery forwards non-brand search, brand, sort, and requests all products", () => {
  const query = toProductQuery(
    state({
      search: "wireless mouse",
      category: "peripherals",
      brands: ["LOGITECH"],
      sort: "price_asc",
    }),
  );

  assert.equal(query.search, "wireless mouse");
  assert.equal(query.category, undefined);
  assert.deepEqual(query.brands, ["LOGITECH"]);
  assert.equal(query.sort, "price_asc");
  assert.equal(query.all, true);
});

test("toProductQuery forwards category when no brand is selected", () => {
  const query = toProductQuery(state({ category: "laptops" }));

  assert.equal(query.category, "laptops");
  assert.equal(query.brands, undefined);
});

test("toProductQuery converts a brand-only search into a single brand filter", () => {
  const query = toProductQuery(state({ search: "Apple brand" }));

  assert.equal(query.search, undefined);
  assert.deepEqual(query.brands, ["APPLE"]);
});

test("invalid URL values are ignored and old page values are not restored", () => {
  const parsed = parseCatalogState(
    new URLSearchParams("category=not-real&sort=sideways&page=3&pageSize=24"),
  );

  assert.equal(parsed.category, undefined);
  assert.equal(parsed.sort, "newest");
  assert.equal("page" in parsed, false);
});

test("empty state stays out of the URL", () => {
  const params = serializeCatalogState(state());
  assert.equal(params.toString(), "");
});

test("removed rating and dedicated-filter parameters are stripped from URLs", () => {
  const params = new URLSearchParams(
    "search=Dell&category=laptops&brands=DELL&rating=4&ram=16GB&minPrice=500&maxPrice=900&inStockOnly=true&sort=highest_rating&page=2&pageSize=24",
  );

  assert.equal(removeRemovedCatalogParams(params), true);
  assert.equal(params.toString(), "search=Dell&category=laptops&brands=DELL");
});

test("normalizing a legacy brand URL updates the searchable query string", () => {
  const normalized = normalizeCatalogParams(
    new URLSearchParams("search=Apple&brands=UGREEN,GIGABYTE"),
  );
  assert.equal(normalized, "search=Apple&brands=APPLE");
});

test("an old highest-rating sort falls back to newest", () => {
  const parsed = parseCatalogState(new URLSearchParams("sort=highest_rating"));
  assert.equal(parsed.sort, "newest");
});
