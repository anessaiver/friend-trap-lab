import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Redis is not configured (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing)");
  }
  client = new Redis({ url, token });
  return client;
}

export const KEYS = {
  trap: (id: string) => `trap:${id}`,
  attempt: (id: string) => `attempt:${id}`,
  trapsAll: "traps:all",
  attemptsAll: "attempts:all",
  attemptsByTrap: (trapId: string) => `attempts:byTrap:${trapId}`,
  trapStats: (trapId: string) => `trapstats:${trapId}`,
  statsGlobal: "stats:global",
  statsType: (t: string) => `stats:type:${t}`,
  statsAnchor: (variant: "high" | "low") => `stats:anchor:${variant}`,
  statsDaily: (day: string) => `stats:daily:${day}`,
  emailSignups: "email:signups",
  testTraps: "test:traps",
  testAttempts: "test:attempts",
  rateLimit: (bucket: string, key: string) => `rl:${bucket}:${key}`,
} as const;
