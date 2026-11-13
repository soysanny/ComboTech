import test from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_CATALOG_STATE,
  applyCatalogPatch,
  clearSearch,
  parseCatalogState,
  removeRemovedCatalogParams,
  serializeCatalogState,
  toProductQuery,
  type CatalogState,
} from "../src/features/products/lib/catalogState";

function state(overrides: Partial<CatalogState> = {}): CatalogState {
  return { ...EMPTY_CATALOG_STATE, ...overrides };
}

test("URL state round-trips search, brand/category, sort, and comparison", () => {
  const original = state({
    search: "Dell XPS",
    modelKey: undefined,
    category: "laptops",
    brands: ["DELL", "ASUS"],
    series: ["XPS"],
    sort: "price_asc",
    compareIds: ["p1", "p2"],
  });

  const parsed = parseCatalogState(serializeCatalogState(original));

  assert.deepEqual(parsed, original);
});

test("changing search text preserves brand/category selections, sort, and comparison", () => {
  const current = state({
    search: "Dell",
    category: "laptops",
    brands: ["DELL"],
    sort: "price_desc",
    compareIds: ["p1"],
  });

  const next = applyCatalogPatch(current, { search: "Dell XPS" });

  assert.equal(next.search, "Dell XPS");
  assert.equal(next.category, "laptops");
  assert.deepEqual(next.brands, ["DELL"]);
  assert.equal(next.sort, "price_desc");
  assert.deepEqual(next.compareIds, ["p1"]);
});

test("changing a brand preserves the query, category, and sort", () => {
  const current = state({
    search: "Dell",
    category: "laptops",
    brands: ["DELL"],
    sort: "price_asc",
  });

  const next = applyCatalogPatch(current, { brands: ["DELL", "ASUS"] });

  assert.equal(next.search, "Dell");
  assert.equal(next.category, "laptops");
  assert.deepEqual(next.brands, ["DELL", "ASUS"]);
  assert.equal(next.sort, "price_asc");
});

test("changing category preserves the query and brand selection", () => {
  const current = state({
    search: "ASUS",
    category: "laptops",
    brands: ["ASUS"],
  });

  const next = applyCatalogPatch(current, { category: "desktops" });

  assert.equal(next.search, "ASUS");
  assert.equal(next.category, "desktops");
  assert.deepEqual(next.brands, ["ASUS"]);
});

test("changing sort keeps query and selections", () => {
  const current = state({
    search: "ASUS",
    category: "laptops",
    brands: ["ASUS"],
  });

  const next = applyCatalogPatch(current, { sort: "price_asc" });

  assert.equal(next.search, "ASUS");
  assert.equal(next.category, "laptops");
  assert.deepEqual(next.brands, ["ASUS"]);
  assert.equal(next.sort, "price_asc");
});

test("clear search clears only the query", () => {
  const current = state({
    search: "Dell",
    category: "laptops",
    brands: ["DELL"],
    sort: "price_asc",
  });

  const next = clearSearch(current);

  assert.equal(next.search, undefined);
  assert.equal(next.category, "laptops");
  assert.deepEqual(next.brands, ["DELL"]);
  assert.equal(next.sort, "price_asc");
});

test("toProductQuery forwards search, brand/category, sort, and requests all products", () => {
  const query = toProductQuery(
    state({
      search: "Dell",
      category: "laptops",
      brands: ["DELL"],
      sort: "price_asc",
    }),
  );

  assert.equal(query.search, "Dell");
  assert.equal(query.category, "laptops");
  assert.deepEqual(query.brands, ["DELL"]);
  assert.equal(query.sort, "price_asc");
  assert.equal(query.all, true);
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

test("an old highest-rating sort falls back to newest", () => {
  const parsed = parseCatalogState(new URLSearchParams("sort=highest_rating"));
  assert.equal(parsed.sort, "newest");
});
