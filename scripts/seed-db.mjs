/**
 * Seed the Postgres database from data/*.json.
 *
 * Run with:  npx prisma db seed
 * (Prisma loads .env for you, so DATABASE_URL is available.)
 *
 * Re-running is safe: each collection is replaced atomically.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const prisma = new PrismaClient();

async function main() {
  const files = readdirSync(dataDir).filter((file) => file.endsWith(".json"));
  if (files.length === 0) {
    console.warn("No JSON files found in data/.");
    return;
  }

  for (const file of files) {
    const name = file.replace(/\.json$/, "");
    const raw = readFileSync(path.join(dataDir, file), "utf-8");

    let items;
    try {
      items = JSON.parse(raw);
    } catch {
      console.warn(`skip ${file}: invalid JSON`);
      continue;
    }
    if (!Array.isArray(items)) {
      console.warn(`skip ${file}: not a JSON array`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      await tx.collectionItem.deleteMany({ where: { collection: name } });
      if (items.length === 0) return;
      await tx.collectionItem.createMany({
        data: items.map((item, index) => ({
          collection: name,
          id: String(item?.id ?? `${name}-${index}`),
          position: index,
          data: item,
        })),
      });
    });

    console.log(`${name}: seeded ${items.length} row(s)`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
