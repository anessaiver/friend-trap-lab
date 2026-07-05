/**
 * Server-side environment access. Secrets never leave the server.
 * Public pages must not crash when an optional integration is missing;
 * API routes that need a missing secret fail with a clear 503 instead.
 */

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function hasRedisConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export function hasBeehiivConfig(): boolean {
  return Boolean(
    process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID
  );
}

export function adminSecret(): string | undefined {
  return process.env.ADMIN_SECRET || undefined;
}

/** Constant-ish time compare; good enough for a low-stakes admin panel. */
export function isAdminRequest(provided: string | null | undefined): boolean {
  const secret = adminSecret();
  if (!secret || !provided) return false;
  if (provided.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) {
    diff |= secret.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}
