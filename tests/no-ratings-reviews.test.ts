import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Product } from "../src/features/products/types";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const srcDir = path.join(root, "src");
const productPattern =
  /\b(StarRating|aggregateRating|ReviewForm|ReviewList|ReviewCard|useReviews|reviewService|Write a review|No reviews yet)\b/i;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) return sourceFiles(fullPath);
    return /\.(ts|tsx|js|jsx)$/.test(entry) ? [fullPath] : [];
  });
}

test("the storefront source contains no product rating or review feature", () => {
  const offenders = sourceFiles(srcDir).filter((file) =>
    productPattern.test(readFileSync(file, "utf-8")),
  );

  assert.deepEqual(
    offenders.map((file) => path.relative(root, file)),
    [],
    "Product rating/review code was reintroduced",
  );
  assert.equal(
    existsSync(path.join(srcDir, "features", "review")),
    false,
    "The removed review feature directory is back",
  );
});

test("product fixtures no longer contain rating metadata", () => {
  const products = JSON.parse(
    readFileSync(path.join(root, "data", "products.json"), "utf-8"),
  ) as Product[];

  const offenders = products
    .filter((product) => "rating" in product || "reviewCount" in product)
    .map((product) => product.id);

  assert.deepEqual(offenders, []);
});
