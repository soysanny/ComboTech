import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Password hashing built on Node's `scrypt` (memory-hard KDF) — no external
 * dependency. Stored format: `scrypt$<saltHex>$<hashHex>`.
 */

const SCHEME = "scrypt";
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

/** Hash a plaintext password into a self-describing, salted digest. */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(password, salt, KEY_LENGTH);
  return `${SCHEME}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/** Constant-time verification of a plaintext password against a stored hash. */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== SCHEME || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const derived = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
