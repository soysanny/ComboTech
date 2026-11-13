import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Product } from "../src/features/products/types";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const products = JSON.parse(
  readFileSync(path.join(root, "data", "products.json"), "utf-8"),
) as Product[];

const isPlaceholder = (src?: string) =>
  !src || /(^|\/)placeholder\.(svg|png|jpe?g|webp)$/i.test(src);

function localPath(src: string): string | null {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  return path.join(root, "public", src.replace(/^\//, ""));
}

test("every local product image reference resolves to a file", () => {
  const broken: string[] = [];

  products.forEach((product) => {
    [product.thumbnail, ...(product.images ?? [])].forEach((src) => {
      if (!src) return;
      const filePath = localPath(src);
      if (filePath && !existsSync(filePath)) {
        broken.push(`${product.id}: ${src}`);
      }
    });
  });

  assert.deepEqual(broken, []);
});

test("image-sourced products no longer use the shared placeholder", () => {
  const expected = ["prod-cc-0165", "prod-cc-0170", "prod-cc-0179"];

  expected.forEach((id) => {
    const product = products.find((item) => item.id === id);
    assert.ok(product, `Missing product ${id}`);
    assert.equal(isPlaceholder(product.thumbnail), false);
    const filePath = localPath(product.thumbnail);
    assert.ok(filePath && existsSync(filePath));
  });
});
