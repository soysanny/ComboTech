import test from "node:test";
import assert from "node:assert/strict";
import { queryProducts, scoreProductSearch } from "../src/features/products/lib/productQuery";
import type { Product } from "../src/features/products/types";

const baseProduct: Product = {
  id: "base",
  name: "Base Laptop",
  slug: "base-laptop",
  brand: "ASUS",
  category: "laptops",
  description: "Base product",
  price: 500,
  currency: "USD",
  images: ["/base.jpg"],
  thumbnail: "/base.jpg",
  stock: 5,
  warrantyMonths: 12,
  soldCount: 0,
  specs: { cpu: "Intel Core i5", ram: "8GB DDR5", storage: "512GB SSD" },
  tags: [],
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function product(overrides: Partial<Product>): Product {
  return { ...baseProduct, ...overrides };
}

test("exact model/SKU matches rank ahead of broad text matches", () => {
  const exact = product({
    id: "exact",
    name: "ASUS ExpertBook B1503CVA",
    productCode: "L001-B1503CVA1",
    modelKey: "asus-expertbook-b1503cva-s79007",
  });
  const broad = product({
    id: "broad",
    name: "L001 B1503 laptop sleeve",
    productCode: "SLEEVE-1",
    modelKey: "l001-b1503-sleeve",
  });

  const result = queryProducts([broad, exact], {
    search: "L001-B1503CVA1",
  });

  assert.equal(result.data[0]?.id, "exact");
  assert.ok(scoreProductSearch(exact, "L001-B1503CVA1").score > scoreProductSearch(broad, "L001-B1503CVA1").score);
});

test("capitalization and surrounding whitespace produce equivalent results", () => {
  const first = product({ id: "first", name: "Lenovo IdeaPad Slim 5" });
  const second = product({ id: "second", name: "Dell Inspiron 3530", brand: "DELL" });

  const normalized = queryProducts([first, second], {
    search: "   lEnOvO   iDeApAd   ",
  });
  const compact = queryProducts([first, second], { search: "Lenovo IdeaPad" });

  assert.deepEqual(
    normalized.data.map((item) => item.id),
    compact.data.map((item) => item.id),
  );
  assert.deepEqual(normalized.data.map((item) => item.id), ["first"]);
});

test("searching a brand and selecting the same brand keeps assigned products", () => {
  const asus = product({ id: "asus", brand: "ASUS" });
  const dell = product({ id: "dell", brand: "DELL" });

  const result = queryProducts([asus, dell], {
    search: "ASUS",
    brands: ["ASUS"],
  });

  assert.deepEqual(result.data.map((item) => item.id), ["asus"]);
});

test("a newer brand-only search replaces a conflicting brand selection", () => {
  const apple = product({ id: "apple", brand: "APPLE", name: "MacBook Air" });
  const asus = product({ id: "asus", brand: "ASUS", name: "ASUS Vivobook" });

  const result = queryProducts([apple, asus], {
    search: "Apple",
    brands: ["ASUS"],
  });

  assert.deepEqual(result.data.map((item) => item.id), ["apple"]);
});

test("brand-only phrases match the brand without appearing in the title", () => {
  const apple = product({ id: "apple", brand: "APPLE", name: "MacBook Air" });
  const asus = product({ id: "asus", brand: "ASUS", name: "ASUS Vivobook" });

  const result = queryProducts([apple, asus], { search: "Apple brand" });

  assert.deepEqual(result.data.map((item) => item.id), ["apple"]);
  assert.ok(scoreProductSearch(apple, "Apple brand").score > 0);
  assert.equal(scoreProductSearch(asus, "Apple brand").score, 0);
});

test("a legacy multi-brand query keeps only the last brand", () => {
  const asus = product({ id: "asus", brand: "ASUS" });
  const dell = product({ id: "dell", brand: "DELL" });
  const lenovo = product({ id: "lenovo", brand: "LENOVO" });

  const result = queryProducts([asus, dell, lenovo], {
    brands: ["ASUS", "DELL"],
  });

  assert.deepEqual(result.data.map((item) => item.id), ["dell"]);
});

test("each result has a configuration that matches the RAM filter", () => {
  const eight = product({
    id: "eight",
    modelKey: "model-a",
    specs: { ram: "8GB DDR5", storage: "512GB SSD" },
  });
  const sixteen = product({
    id: "sixteen",
    modelKey: "model-b",
    specs: { ram: "16GB DDR5", storage: "512GB SSD" },
  });

  const result = queryProducts([eight, sixteen], { ram: ["16GB"] });

  assert.equal(result.total, 1);
  assert.match(result.data[0]?.specs.ram ?? "", /16GB/i);
});

test("RAM and price must be satisfied by the same variant", () => {
  const variantA = product({
    id: "variant-a",
    modelKey: "same-model",
    price: 450,
    specs: { ram: "8GB DDR5", storage: "512GB SSD" },
  });
  const variantB = product({
    id: "variant-b",
    modelKey: "same-model",
    price: 650,
    specs: { ram: "16GB DDR5", storage: "512GB SSD" },
  });

  const impossible = queryProducts([variantA, variantB], {
    ram: ["16GB"],
    maxPrice: 500,
  });
  assert.equal(impossible.total, 0);

  const possible = queryProducts([variantA, variantB], {
    ram: ["16GB"],
    maxPrice: 700,
  });
  assert.equal(possible.total, 1);
  assert.equal(possible.data[0]?.id, "variant-b");
  assert.equal(possible.data[0]?.price, 650);
});

test("grouped cards show the configuration that satisfies the filters", () => {
  const cheapEight = product({
    id: "cheap-eight",
    modelKey: "grouped",
    price: 400,
    specs: { ram: "8GB DDR5", storage: "512GB SSD" },
  });
  const expensiveSixteen = product({
    id: "expensive-sixteen",
    modelKey: "grouped",
    price: 700,
    specs: { ram: "16GB DDR5", storage: "512GB SSD" },
  });

  const result = queryProducts([cheapEight, expensiveSixteen], {
    ram: ["16GB"],
  });

  assert.equal(result.total, 1);
  assert.equal(result.data[0]?.id, "expensive-sixteen");
});

test("specification text is searchable", () => {
  const result = queryProducts(
    [
      product({ id: "ram", specs: { ram: "16GB DDR5" } }),
      product({ id: "other", specs: { ram: "8GB DDR5" } }),
    ],
    { search: "16GB" },
  );

  assert.deepEqual(result.data.map((item) => item.id), ["ram"]);
});

test("price sorting keeps filtered results and orders by current price", () => {
  const cheap = product({ id: "cheap", price: 300 });
  const middle = product({ id: "middle", price: 500 });
  const expensive = product({ id: "expensive", price: 900 });
  const excluded = product({
    id: "excluded",
    price: 200,
    specs: { ram: "8GB DDR5", storage: "512GB SSD" },
  });

  const result = queryProducts([expensive, cheap, excluded, middle], {
    ram: ["8GB"],
    sort: "price_asc",
  });

  assert.deepEqual(result.data.map((item) => item.id), [
    "excluded",
    "cheap",
    "middle",
    "expensive",
  ]);
});

test("an impossible combination returns no unrelated products", () => {
  const result = queryProducts(
    [
      product({ id: "asus", brand: "ASUS", price: 1200 }),
      product({ id: "dell", brand: "DELL", price: 400 }),
    ],
    { search: "nonexistent-model-xyz", brands: ["ASUS"], maxPrice: 100 },
  );

  assert.equal(result.total, 0);
  assert.deepEqual(result.data, []);
});

test("pagination happens after filtering and exposes the full count", () => {
  const products = Array.from({ length: 30 }, (_, index) =>
    product({
      id: `product-${index}`,
      modelKey: `model-${index}`,
      name: `Lenovo IdeaPad ${index}`,
      brand: "LENOVO",
    }),
  );

  const firstPage = queryProducts(products, {
    search: "Lenovo",
    pageSize: 10,
    page: 1,
  });
  const thirdPage = queryProducts(products, {
    search: "Lenovo",
    pageSize: 10,
    page: 3,
  });

  assert.equal(firstPage.total, 30);
  assert.equal(firstPage.totalPages, 3);
  assert.equal(firstPage.data.length, 10);
  assert.equal(thirdPage.data.length, 10);
  assert.equal(new Set(firstPage.data.map((item) => item.id)).size, 10);
});

test("all mode returns every matching product without a page slice", () => {
  const products = Array.from({ length: 45 }, (_, index) =>
    product({
      id: `all-${index}`,
      modelKey: `all-model-${index}`,
      name: `ASUS Product ${index}`,
      brand: "ASUS",
    }),
  );

  const result = queryProducts(products, { search: "ASUS", all: true });

  assert.equal(result.total, 45);
  assert.equal(result.data.length, 45);
  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 1);
});
