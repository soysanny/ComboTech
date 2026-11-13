/**
 * Normalize product catalog relationships.
 *
 * - canonicalizes known brand casing
 * - adds stable brandId / categoryId / seriesId values
 * - clears a "series" that only repeats the brand
 * - applies the verified Razer Kraken brand correction
 * - writes a manual-review report without guessing brands from titles
 *
 * Usage:
 *   node scripts/normalize-catalog.mjs          (update data/products.json)
 *   node --env-file=.env scripts/normalize-catalog.mjs --db
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsPath = path.join(root, "data", "products.json");
const reviewPath = path.join(root, "data", "catalog-review.json");
const updateDatabase = process.argv.includes("--db");

const CANONICAL_BRANDS = {
  acer: "ACER",
  apple: "APPLE",
  asus: "ASUS",
  "cooler-master": "COOLER MASTER",
  dell: "DELL",
  dji: "DJI",
  epson: "EPSON",
  forge: "Forge",
  gigabyte: "GIGABYTE",
  hp: "HP",
  jonbo: "JONBO",
  kaspersky: "KASPERSKY",
  lenovo: "LENOVO",
  logitech: "LOGITECH",
  microsoft: "MICROSOFT",
  msi: "MSI",
  nova: "Nova",
  nzxt: "NZXT",
  razer: "RAZER",
  samsung: "SAMSUNG",
  teamgroup: "TEAMGROUP",
  ugreen: "UGREEN",
};

const BRAND_ALIASES = {
  coolermaster: "cooler-master",
  "team-group": "teamgroup",
};

const PLACEHOLDER_BRANDS = new Set([
  "cooling",
  "gpu partner",
  "memory",
  "other",
  "processor",
  "storage",
  "network",
]);

const SERIES_CANONICAL = {
  macbook: "MacBook",
  expertbook: "ExpertBook",
  vivobook: "Vivobook",
  inspiron: "Inspiron",
  ideapad: "IdeaPad",
  modern: "Modern",
  cyborg: "Cyborg",
  yoga: "Yoga",
  loq: "LOQ",
  legion: "Legion",
  nitro: "Nitro",
  rog: "ROG",
  tuf: "TUF",
  stealth: "Stealth",
  latitude: "Latitude",
  thinkpad: "ThinkPad",
  kraken: "Kraken",
  deathadder: "DeathAdder",
  cobra: "Cobra",
};

/**
 * Confirmed corrections only. Do not add title-based guesses here; uncertain
 * records belong in the review report.
 */
const VERIFIED_BRAND_FIXES = [
  {
    match: /^razer kraken-v3 x$/i,
    brand: "RAZER",
    series: "Kraken",
    reason: "reported NZXT/Razer mismatch; verified against product name and SKU",
  },
];

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKC")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveBrand(raw) {
  const key = slugify(raw);
  const alias = BRAND_ALIASES[key] ?? key;
  return CANONICAL_BRANDS[alias] ?? String(raw ?? "").trim();
}

function normalizeProduct(product) {
  const fixes = VERIFIED_BRAND_FIXES.filter((fix) => fix.match.test(product.name));
  const fix = fixes[0];
  const brand = fix ? fix.brand : resolveBrand(product.brand);
  const brandId = slugify(brand);
  const categoryId = product.category ? `cat-${product.category}` : undefined;

  let series = fix?.series ?? String(product.series ?? "").replace(/\s+/g, " ").trim();
  let seriesId;
  if (!series || slugify(series) === brandId) {
    series = undefined;
  } else {
    seriesId = slugify(series);
    series = SERIES_CANONICAL[seriesId] ?? series;
  }

  const normalized = {
    ...product,
    brand,
    brandId,
    ...(categoryId ? { categoryId } : {}),
    ...(series ? { series, seriesId } : { series: undefined, seriesId: undefined }),
  };

  // Product ratings and reviews were removed from the storefront. Stored
  // review documents are intentionally left untouched pending approval.
  delete normalized.rating;
  delete normalized.reviewCount;

  return normalized;
}

function reviewReasons(product) {
  const reasons = [];
  const normalized = String(product.brand ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  const brandId = slugify(product.brand);
  if (PLACEHOLDER_BRANDS.has(normalized)) {
    reasons.push(`brand "${product.brand}" is a component type, not a manufacturer`);
  } else if (!CANONICAL_BRANDS[BRAND_ALIASES[brandId] ?? brandId]) {
    reasons.push(`unknown brand "${product.brand}"`);
  }
  if (/deathadder-v3\.png/i.test(product.name)) {
    reasons.push("product name looks like an image filename");
  }
  if (!product.productCode) {
    reasons.push("missing SKU / product code");
  }
  if (/[$=]/.test(product.specs?.ram ?? "")) {
    reasons.push("RAM spec mixes base and upgrade values; verify configuration");
  }
  return reasons;
}

function main() {
  const products = JSON.parse(readFileSync(productsPath, "utf-8"));
  const normalized = products.map(normalizeProduct);
  const review = [];

  normalized.forEach((product, index) => {
    const reasons = reviewReasons(product);
    if (reasons.length > 0) {
      review.push({
        id: product.id,
        name: product.name,
        brand: products[index].brand,
        series: products[index].series,
        reasons,
      });
    }
  });

  writeFileSync(productsPath, `${JSON.stringify(normalized, null, 2)}\n`);
  writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);

  const applied = normalized.filter(
    (product, index) =>
      product.brand !== products[index].brand ||
      product.series !== products[index].series,
  );
  console.log(`normalized ${normalized.length} products`);
  console.log(`corrected ${applied.length} brand/series records`);
  console.log(`manual review: ${review.length} records -> data/catalog-review.json`);

  if (updateDatabase) {
    updateCollection(normalized).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
}

async function updateCollection(products) {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.collectionItem.findMany({
      where: { collection: "products" },
      select: { id: true },
    });
    const byId = new Map(products.map((product) => [product.id, product]));
    let updated = 0;

    // Serverless Postgres closes long interactive transactions, so update in
    // small independent batches instead of one long transaction.
    for (let index = 0; index < rows.length; index += 40) {
      const batch = rows.slice(index, index + 40);
      await Promise.all(
        batch.map((row) => {
          const product = byId.get(row.id);
          if (!product) return Promise.resolve();
          updated += 1;
          return prisma.collectionItem.update({
            where: { collection_id: { collection: "products", id: row.id } },
            data: { data: product },
          });
        }),
      );
    }

    console.log(`updated ${updated} product row(s) in Postgres`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
