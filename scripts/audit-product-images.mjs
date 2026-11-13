/**
 * Audit catalog image references.
 *
 * Classifies products with a usable image, products that only have the shared
 * placeholder, and references to files that do not exist. Never downloads or
 * invents an image automatically.
 *
 * Usage: node scripts/audit-product-images.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsPath = path.join(root, "data", "products.json");
const reportPath = path.join(root, "data", "product-image-audit.json");

const isPlaceholder = (src) =>
  !src || /(^|\/)placeholder\.(svg|png|jpe?g|webp)$/i.test(src);

const isLocal = (src) => src.startsWith("/") && !src.startsWith("//");

const products = JSON.parse(readFileSync(productsPath, "utf-8"));
const needsUpload = [];
const brokenReferences = [];
let usable = 0;

for (const product of products) {
  const references = Array.from(
    new Set([product.thumbnail, ...(product.images ?? [])].filter(Boolean)),
  );
  const realReferences = references.filter((src) => !isPlaceholder(src));

  references.forEach((src) => {
    if (!isLocal(src)) return;
    const filePath = path.join(root, "public", src.replace(/^\//, ""));
    if (!existsSync(filePath)) {
      brokenReferences.push({
        id: product.id,
        name: product.name,
        src,
      });
    }
  });

  if (realReferences.length === 0) {
    needsUpload.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      currentThumbnail: product.thumbnail,
    });
  } else {
    usable += 1;
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    products: products.length,
    usableImages: usable,
    needsUpload: needsUpload.length,
    brokenReferences: brokenReferences.length,
  },
  needsUpload,
  brokenReferences,
};

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`products: ${products.length}`);
console.log(`usable images: ${usable}`);
console.log(`need upload: ${needsUpload.length}`);
console.log(`broken references: ${brokenReferences.length}`);
console.log(`report: data/product-image-audit.json`);
