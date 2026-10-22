import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import type { UserRole } from "@/types/common";

interface TokenPayload {
  userId: string;
  role: UserRole;
  exp: number;
}

const DEV_FALLBACK_SECRET = "svc-store-dev-secret-key-change-in-production";

/**
 * Resolve the signing secret lazily so a missing AUTH_SECRET fails fast at
 * request time in production instead of silently using the dev fallback.
 */
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET environment variable is required in production.",
    );
  }
  return DEV_FALLBACK_SECRET;
}

function base64UrlEncode(data: string): string {
  return Buffer.from(data).toString("base64url");
}

function base64UrlDecode(data: string): string {
  return Buffer.from(data, "base64url").toString("utf-8");
}

function sign(payload: TokenPayload): string {
  const header = { alg: "HS256", typ: "JWT" };
  const input = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const signature = createHmac("sha256", getSecret()).update(input).digest("base64url");
  return `${input}.${signature}`;
}

function verify(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const input = `${header}.${payload}`;
    const expected = createHmac("sha256", getSecret()).update(input).digest("base64url");
    if (!Buffer.from(sig).equals(Buffer.from(expected))) return null;
    const decoded = JSON.parse(base64UrlDecode(payload)) as TokenPayload;
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function signToken(userId: string, role: UserRole): string {
  return sign({ userId, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
}

export function verifyToken(token: string): TokenPayload | null {
  return verify(token);
}

function extractToken(request?: Request): string | null {
  if (request) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }
  }
  return null;
}

export async function getAuth(request?: Request): Promise<{ userId: string; role: UserRole } | null> {
  let token = extractToken(request);
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value ?? null;
  }
  if (!token) return null;
  return verifyToken(token);
}

export function unauthorized() {
  return Response.json({ message: "Unauthorized", status: 401 }, { status: 401 });
}

export function forbidden() {
  return Response.json({ message: "Forbidden", status: 403 }, { status: 403 });
}
