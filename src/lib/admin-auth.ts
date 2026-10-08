import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE_S = 7 * 24 * 60 * 60;

const password = () => process.env.ADMIN_PASSWORD ?? "";
const secret = () => process.env.ADMIN_SECRET || password();

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const adminConfigured = () => password().length >= 8;

export function checkPassword(candidate: string) {
  return adminConfigured() && safeEqual(candidate, password());
}

export async function startSession() {
  const expires = Date.now() + MAX_AGE_S * 1000;
  const token = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthenticated() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value ?? "";
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

// Simple per-instance brute-force guard for the login endpoint.
const attempts = new Map<string, number[]>();
export function loginRateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 10;
}
