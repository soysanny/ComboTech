import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function seedCollection(name: string): void {
  const seedPath = path.join(process.cwd(), "src", "mock", `${name}.json`);
  const filePath = path.join(DATA_DIR, `${name}.json`);

  if (!fs.existsSync(seedPath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return;
  }

  const raw = fs.readFileSync(seedPath, "utf-8");
  let data = JSON.parse(raw);

  // Never persist plaintext passwords: hash any seed `password` field.
  if (name === "users") {
    data = (data as Array<Record<string, unknown>>).map((user) => {
      const { password, ...rest } = user as { password?: unknown };
      return typeof password === "string"
        ? { ...rest, passwordHash: hashPassword(password) }
        : user;
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getCollection<T>(name: string): T[] {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    seedCollection(name);
  }
  if (!fs.existsSync(filePath)) {
    return [] as T[];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

export function saveCollection<T>(name: string, data: T[]): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getOne<T extends { id: string }>(name: string, id: string): T | undefined {
  const collection = getCollection<T>(name);
  return collection.find((item) => item.id === id);
}

export function createOne<T extends { id: string }>(name: string, item: T): T {
  const collection = getCollection<T>(name);
  collection.push(item);
  saveCollection(name, collection);
  return item;
}

export function updateOne<T extends { id: string }>(name: string, id: string, updates: Partial<T>): T | null {
  const collection = getCollection<T>(name);
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...updates };
  saveCollection(name, collection);
  return collection[index];
}

export function deleteOne<T extends { id: string }>(name: string, id: string): boolean {
  const collection = getCollection<T>(name);
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  saveCollection(name, collection);
  return true;
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
