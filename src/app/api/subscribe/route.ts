import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { hasRedisConfig } from "@/lib/env";
import { getRedis, KEYS } from "@/lib/redis";
import { incrementEmailSignups } from "@/lib/stats";
import { subscribeSchema } from "@/lib/validation";

/**
 * Light rate limit: 6 signups/hour per hashed network origin.
 * The raw IP is hashed immediately and never stored.
 */
async function isRateLimited(req: NextRequest): Promise<boolean> {
  if (!hasRedisConfig()) return false;
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const hash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const key = KEYS.rateLimit("subscribe", hash);
    const redis = getRedis();
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count > 6;
  } catch {
    return false; // rate limiting is best-effort
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That email doesn't look deliverable. Typo check?" },
      { status: 400 }
    );
  }

  // Honeypot filled → pretend success, deliver nothing.
  if (parsed.data.labNotes !== "") {
    return NextResponse.json({ message: "Check your inbox. The lab notes are on their way." });
  }

  if (await isRateLimited(req)) {
    return NextResponse.json(
      { error: "That's a lot of signups from one place. Give it an hour." },
      { status: 429 }
    );
  }

  const result = await subscribeToBeehiiv(parsed.data.email, {
    source: parsed.data.source,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 502 });
  }

  if (!result.alreadySubscribed) {
    try {
      await incrementEmailSignups();
    } catch {
      // counter is best-effort; the subscription itself succeeded
    }
  }

  return NextResponse.json({ message: result.message });
}
