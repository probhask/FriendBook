import { createClient } from "@sanity/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";

const {
  SANITY_PROJECT_ID,
  SANITY_DATASET = "production",
  SANITY_WRITE_TOKEN,
  SANITY_API_VERSION = "2024-06-10",
  JWT_SECRET,
} = process.env;

if (!SANITY_PROJECT_ID || !SANITY_WRITE_TOKEN || !JWT_SECRET) {
  // Surfaced once in the function logs on cold start — fail loud rather than
  // silently issuing unsigned tokens or unauthenticated writes.
  console.error(
    "[functions] Missing env: SANITY_PROJECT_ID / SANITY_WRITE_TOKEN / JWT_SECRET"
  );
}

/** Server-side Sanity client. Holds the write token — never shipped to the browser. */
export const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: SANITY_WRITE_TOKEN,
});

const COOKIE_NAME = "fb_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

/** Raised inside a handler to return a specific HTTP status. */
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function signSessionCookie(userId) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: SESSION_MAX_AGE,
  });
  return serializeCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie() {
  return serializeCookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Returns the authenticated user id from the session cookie, or null. */
export function getActorId(event) {
  const header = event.headers?.cookie || event.headers?.Cookie || "";
  if (!header) return null;
  const token = parseCookie(header)[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

// ---- validation helpers ------------------------------------------------------

export function str(value, { field, min = 1, max = 5000, trim = true } = {}) {
  if (typeof value !== "string") throw new HttpError(400, `${field} is required`);
  const v = trim ? value.trim() : value;
  if (v.length < min) throw new HttpError(400, `${field} is too short`);
  if (v.length > max) throw new HttpError(400, `${field} is too long`);
  return v;
}

export function email(value) {
  const v = str(value, { field: "email", min: 5, max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    throw new HttpError(400, "email is invalid");
  return v;
}

export function id(value, field = "id") {
  const v = str(value, { field, min: 1, max: 200 });
  // Sanity ids: letters, digits, dot, dash, underscore (drafts use a "." prefix)
  if (!/^[A-Za-z0-9._-]+$/.test(v)) throw new HttpError(400, `${field} is invalid`);
  return v;
}

export function idArray(value, field = "ids") {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 50).map((v) => id(v, field));
}

/** Fetch a single field from a document, for ownership checks. */
export async function fetchDoc(docId, projection) {
  return sanity.fetch(`*[_id == $docId][0]${projection}`, { docId });
}

export async function assertActorOwns(docId, ownerRefPath, actorId) {
  const doc = await fetchDoc(docId, `{ "owner": ${ownerRefPath} }`);
  if (!doc) throw new HttpError(404, "not found");
  if (doc.owner !== actorId) throw new HttpError(403, "forbidden");
  return doc;
}
