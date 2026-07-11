// Server-only in-app auth for the site's own customer accounts.
// PBKDF2 password hashing + opaque session tokens (SHA-256 hashed at rest).
import type { D1Database } from "@cloudflare/workers-types";
import { bindings } from "./bindings.server";

export const SESSION_COOKIE = "tc_session";
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 100_000;

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

function b64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const byte of bytes) s += String.fromCharCode(byte);
  return btoa(s);
}

function fromB64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function pbkdf2(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await pbkdf2(password, salt);
  return `${b64(salt)}:${b64(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(":");
  if (!saltB64 || !hashB64) return false;
  const derived = new Uint8Array(await pbkdf2(password, fromB64(saltB64)));
  const expected = fromB64(hashB64);
  if (derived.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < derived.length; i++) diff |= derived[i] ^ expected[i];
  return diff === 0;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function requireDb(): D1Database | null {
  return bindings().DB ?? null;
}

export async function createSession(db: D1Database, userId: string): Promise<string> {
  const token = b64(crypto.getRandomValues(new Uint8Array(32)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const tokenHash = await sha256Hex(token);
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString();
  await db
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(tokenHash, userId, expires)
    .run();
  return token;
}

export function sessionCookie(token: string, maxAgeSeconds = SESSION_DAYS * 86_400): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readSessionToken(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  for (const part of cookie.split(/;\s*/)) {
    const [name, ...rest] = part.split("=");
    if (name === SESSION_COOKIE) return rest.join("=") || null;
  }
  return null;
}

export async function getUserByRequest(request: Request): Promise<PublicUser | null> {
  const db = requireDb();
  const token = readSessionToken(request);
  if (!db || !token) return null;
  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare(
      `SELECT u.id, u.email, u.first_name, u.last_name
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > datetime('now')`,
    )
    .bind(tokenHash)
    .first<{ id: string; email: string; first_name: string; last_name: string }>();
  if (!row) return null;
  return { id: row.id, email: row.email, firstName: row.first_name, lastName: row.last_name };
}

export async function destroySession(request: Request): Promise<void> {
  const db = requireDb();
  const token = readSessionToken(request);
  if (!db || !token) return;
  const tokenHash = await sha256Hex(token);
  await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
}
