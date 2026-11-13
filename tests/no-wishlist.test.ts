import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const srcDir = path.join(root, "src");
const pattern = /\b(wishlist|wishlisted|favorites?|favourites?)\b/i;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) return sourceFiles(fullPath);
    return /\.(ts|tsx|js|jsx)$/.test(entry) ? [fullPath] : [];
  });
}

test("the storefront source contains no wishlist/favorites UI or logic", () => {
  const offenders = sourceFiles(srcDir).filter((file) =>
    pattern.test(readFileSync(file, "utf-8")),
  );

  assert.deepEqual(
    offenders.map((file) => path.relative(root, file)),
    [],
    "Wishlist/favorites code was reintroduced",
  );
});
