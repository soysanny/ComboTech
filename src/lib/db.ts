import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Repository helpers backed by Postgres (one `CollectionItem` row per
 * document). The public API intentionally mirrors the previous JSON layer so
 * API routes keep their logic; callers must now `await` these functions.
 */

function asJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

/** Read every document in a collection, preserving insertion order. */
export async function getCollection<T>(name: string): Promise<T[]> {
  const rows = await prisma.collectionItem.findMany({
    where: { collection: name },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { data: true },
  });
  return rows.map((row) => row.data as unknown as T);
}

/** Replace an entire collection atomically. */
export async function saveCollection<T>(name: string, data: T[]): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.collectionItem.deleteMany({ where: { collection: name } });
    if (data.length === 0) return;
    await tx.collectionItem.createMany({
      data: data.map((item, index) => {
        const rawId = (item as { id?: unknown }).id;
        return {
          collection: name,
          id: typeof rawId === "string" ? rawId : `${name}-${index}`,
          position: index,
          data: asJson(item),
        };
      }),
    });
  });
}

export async function getOne<T extends { id: string }>(
  name: string,
  id: string,
): Promise<T | undefined> {
  const row = await prisma.collectionItem.findUnique({
    where: { collection_id: { collection: name, id } },
    select: { data: true },
  });
  return row ? (row.data as unknown as T) : undefined;
}

export async function createOne<T extends { id: string }>(
  name: string,
  item: T,
): Promise<T> {
  const count = await prisma.collectionItem.count({ where: { collection: name } });
  await prisma.collectionItem.create({
    data: {
      collection: name,
      id: item.id,
      position: count,
      data: asJson(item),
    },
  });
  return item;
}

export async function updateOne<T extends { id: string }>(
  name: string,
  id: string,
  updates: Partial<T>,
): Promise<T | null> {
  const existing = await getOne<T>(name, id);
  if (!existing) return null;
  const updated = { ...existing, ...updates } as T;
  await prisma.collectionItem.update({
    where: { collection_id: { collection: name, id } },
    data: { data: asJson(updated) },
  });
  return updated;
}

export async function deleteOne(name: string, id: string): Promise<boolean> {
  const result = await prisma.collectionItem.deleteMany({
    where: { collection: name, id },
  });
  return result.count > 0;
}

export function paginate<T>(list: T[], page: number, pageSize: number) {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return {
    data: list.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}
