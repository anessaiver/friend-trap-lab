import { NextResponse } from "next/server";
import { hasBeehiivConfig, hasRedisConfig } from "@/lib/env";
import { getRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  let redisStatus: "ok" | "unconfigured" | "error" = "unconfigured";
  if (hasRedisConfig()) {
    try {
      const pong = await getRedis().ping();
      redisStatus = pong === "PONG" ? "ok" : "error";
    } catch {
      redisStatus = "error";
    }
  }

  const healthy = redisStatus === "ok";
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      redis: redisStatus,
      beehiivConfigured: hasBeehiivConfig(),
      adminConfigured: Boolean(process.env.ADMIN_SECRET),
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
