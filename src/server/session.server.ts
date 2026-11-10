import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { deleteCookie, getCookie, getRequestIP, setCookie } from "@tanstack/react-start/server";

const SESSION_COOKIE = "safa_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

const isProduction = process.env["NODE_ENV"] === "production";

function adminPassword(): string | undefined {
  const configured = process.env["ADMIN_PASSWORD"];
  if (configured) return configured;
  return isProduction ? undefined : "admin";
}

function sessionSecret(): string {
  const configured = process.env["ADMIN_SESSION_SECRET"];
  if (configured) return configured;
  if (isProduction) {
    console.warn("[auth] ADMIN_SESSION_SECRET is not set; sessions will not survive a restart.");
  }
  return (secretCache ??= randomBytes(32).toString("hex"));
}
let secretCache: string | undefined;

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload, "utf8").digest("base64url");
}

function createToken() {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  const expected = sign(expires);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(expires) > Date.now();
}

export function isAdmin(): boolean {
  return verifyToken(getCookie(SESSION_COOKIE));
}

export function requireAdmin(): void {
  if (!isAdmin()) throw new Error("UNAUTHORIZED");
}

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export function attemptLogin(password: string): { ok: boolean; error?: string } {
  const expected = adminPassword();
  if (!expected) {
    return { ok: false, error: "ADMIN_PASSWORD is not configured on the server." };
  }

  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  if (rateLimited(ip)) {
    return { ok: false, error: "Too many attempts. Try again in 15 minutes." };
  }

  const provided = Buffer.from(digest(password));
  const target = Buffer.from(digest(expected));
  const matches = provided.length === target.length && timingSafeEqual(provided, target);

  if (!matches) return { ok: false, error: "Incorrect password." };

  setCookie(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return { ok: true };
}

export function clearSession(): void {
  deleteCookie(SESSION_COOKIE, { path: "/" });
}
