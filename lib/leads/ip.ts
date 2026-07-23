import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";

/**
 * Reads the caller's IP from the standard proxy headers Vercel sets. We never
 * store the raw IP — only a salted hash, used solely to correlate rate-limit
 * and spam attempts (never to identify a person).
 */
export async function getRequestIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "nguera-tech-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
