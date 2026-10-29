#!/usr/bin/env node
/**
 * Reset a user's password in the Postgres database.
 *
 * Usage:
 *   node scripts/reset-password.mjs <email> <new-password>
 *   npm run reset-password -- <email> <new-password>
 *
 * The stored format (`scrypt$<saltHex>$<hashHex>`) must stay in sync with
 * src/lib/password.ts, which verifies it at login.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const SCHEME = "scrypt";
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// A plain `node` script doesn't load .env (Prisma CLI does), so load it here.
const envPath = path.join(projectRoot, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(password, salt, KEY_LENGTH);
  return `${SCHEME}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

async function main() {
  const [email, newPassword] = process.argv.slice(2);

  if (!email || !newPassword) {
    console.error(
      "Usage: node scripts/reset-password.mjs <email> <new-password>",
    );
    process.exit(1);
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    fail(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL is not set. Add it to .env (see .env.example).");
  }

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.collectionItem.findMany({
      where: { collection: "users" },
    });
    const row = rows.find(
      (item) =>
        typeof item.data?.email === "string" &&
        item.data.email.toLowerCase() === email.toLowerCase(),
    );

    if (!row) {
      fail(`No user found with email "${email}".`);
    }

    const updated = { ...row.data, passwordHash: hashPassword(newPassword) };
    delete updated.password;

    await prisma.collectionItem.update({
      where: { collection_id: { collection: "users", id: row.id } },
      data: { data: updated },
    });

    console.log(
      `Password updated for ${row.data.email}${row.data.role ? ` (${row.data.role})` : ""}.`,
    );
    if (row.data.blocked) {
      console.warn(
        "Note: this account is blocked — unblock it before the user can sign in.",
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
