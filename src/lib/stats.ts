import { getRedis, KEYS } from "@/lib/redis";
import { TRAP_TYPES, TRAPS } from "@/lib/traps";
import { todayKey } from "@/lib/utils";
import type {
  AttemptRecord,
  PublicStats,
  TrapAggregate,
  TrapRecord,
  TrapType,
  TypeStats,
} from "@/types";

const DAILY_TTL_SECONDS = 60 * 60 * 24 * 90;
const MIN_SAMPLE_FOR_RATES = 10;
const MIN_SAMPLE_FOR_LEADERBOARD = 5;

function num(v: unknown): number {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

export async function persistTrap(trap: TrapRecord): Promise<void> {
  const redis = getRedis();
  const p = redis.pipeline();
  p.set(KEYS.trap(trap.trapId), trap);
  p.zadd(KEYS.trapsAll, { score: trap.createdAt, member: trap.trapId });
  if (trap.isTest) {
    p.sadd(KEYS.testTraps, trap.trapId);
  } else {
    p.hincrby(KEYS.statsGlobal, "trapsCreated", 1);
    p.hincrby(KEYS.statsDaily(todayKey()), "traps", 1);
    p.expire(KEYS.statsDaily(todayKey()), DAILY_TTL_SECONDS);
    if (trap.source === "revenge") p.hincrby(KEYS.statsGlobal, "revengeTraps", 1);
  }
  await p.exec();
}

export async function persistAttempt(attempt: AttemptRecord): Promise<void> {
  const redis = getRedis();
  const p = redis.pipeline();
  p.set(KEYS.attempt(attempt.attemptId), attempt);
  p.zadd(KEYS.attemptsAll, { score: attempt.createdAt, member: attempt.attemptId });
  p.lpush(KEYS.attemptsByTrap(attempt.trapId), attempt.attemptId);
  if (attempt.isTest) {
    p.sadd(KEYS.testAttempts, attempt.attemptId);
  } else {
    p.hincrby(KEYS.statsGlobal, "attempts", 1);
    p.hincrby(KEYS.statsGlobal, attempt.isTrapped ? "trapped" : "escaped", 1);
    if (attempt.timeToAnswerMs) {
      p.hincrby(KEYS.statsGlobal, "timeMsTotal", attempt.timeToAnswerMs);
      p.hincrby(KEYS.statsGlobal, "timedAttempts", 1);
    }
    p.hincrby(KEYS.statsType(attempt.trapType), "attempts", 1);
    if (attempt.isTrapped) p.hincrby(KEYS.statsType(attempt.trapType), "trapped", 1);
    p.hincrby(KEYS.statsType(attempt.trapType), `rt:${attempt.resultType}`, 1);
    p.hincrby(KEYS.trapStats(attempt.trapId), "attempts", 1);
    if (attempt.isTrapped) p.hincrby(KEYS.trapStats(attempt.trapId), "trapped", 1);
    p.hincrby(KEYS.statsDaily(todayKey()), "attempts", 1);
    p.expire(KEYS.statsDaily(todayKey()), DAILY_TTL_SECONDS);
    if (attempt.trapType === "anchor" && attempt.answer.trapType === "anchor") {
      const variant = attempt.answer.variant;
      p.hincrby(KEYS.statsAnchor(variant), "count", 1);
      p.hincrby(KEYS.statsAnchor(variant), "sum", Math.round(attempt.answer.estimate));
    }
  }
  await p.exec();
}

export async function incrementEmailSignups(): Promise<void> {
  await getRedis().incr(KEYS.emailSignups);
}

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

export async function getTrap(trapId: string): Promise<TrapRecord | null> {
  return await getRedis().get<TrapRecord>(KEYS.trap(trapId));
}

export async function getAttempt(attemptId: string): Promise<AttemptRecord | null> {
  return await getRedis().get<AttemptRecord>(KEYS.attempt(attemptId));
}

export async function getTrapAggregate(trapId: string): Promise<TrapAggregate> {
  const h = await getRedis().hgetall(KEYS.trapStats(trapId));
  return { attempts: num(h?.attempts), trapped: num(h?.trapped) };
}

export async function getTypeAggregate(trapType: TrapType): Promise<TrapAggregate> {
  const h = await getRedis().hgetall(KEYS.statsType(trapType));
  return { attempts: num(h?.attempts), trapped: num(h?.trapped) };
}

export interface AnchorAggregates {
  high: { count: number; mean: number | null };
  low: { count: number; mean: number | null };
}

export async function getAnchorAggregates(): Promise<AnchorAggregates> {
  const redis = getRedis();
  const [high, low] = await Promise.all([
    redis.hgetall(KEYS.statsAnchor("high")),
    redis.hgetall(KEYS.statsAnchor("low")),
  ]);
  const agg = (h: Record<string, unknown> | null) => {
    const count = num(h?.count);
    return { count, mean: count >= 4 ? Math.round(num(h?.sum) / count) : null };
  };
  return { high: agg(high), low: agg(low) };
}

export async function getPublicStats(): Promise<PublicStats> {
  const redis = getRedis();
  const p = redis.pipeline();
  p.hgetall(KEYS.statsGlobal);
  p.get(KEYS.emailSignups);
  p.hgetall(KEYS.statsDaily(todayKey()));
  for (const t of TRAP_TYPES) p.hgetall(KEYS.statsType(t));
  const results = await p.exec<unknown[]>();

  const global = (results[0] ?? {}) as Record<string, unknown>;
  const signups = num(results[1]);
  const daily = (results[2] ?? {}) as Record<string, unknown> | null;

  const byType: TypeStats[] = TRAP_TYPES.map((t, i) => {
    const h = (results[3 + i] ?? {}) as Record<string, unknown> | null;
    const attempts = num(h?.attempts);
    const trapped = num(h?.trapped);
    return {
      trapType: t,
      attempts,
      trapped,
      trappedRate:
        attempts >= MIN_SAMPLE_FOR_RATES ? Math.round((trapped / attempts) * 100) : null,
    };
  });

  const eligible = byType.filter((t) => t.attempts >= MIN_SAMPLE_FOR_LEADERBOARD);
  const mostDangerous = eligible.length
    ? [...eligible].sort((a, b) => b.trapped / b.attempts - a.trapped / a.attempts)[0]
    : null;
  const mostEscaped = eligible.length
    ? [...eligible].sort((a, b) => a.trapped / a.attempts - b.trapped / b.attempts)[0]
    : null;

  const attempts = num(global.attempts);
  const timeMsTotal = num(global.timeMsTotal);
  const timedAttempts = num(global.timedAttempts);

  return {
    trapsCreated: num(global.trapsCreated),
    attempts,
    trapped: num(global.trapped),
    escaped: num(global.escaped),
    revengeTraps: num(global.revengeTraps),
    emailSignups: signups,
    todayTraps: num(daily?.traps),
    todayAttempts: num(daily?.attempts),
    smallSample: attempts < 30,
    mostDangerous,
    mostEscaped,
    byType,
    avgAnswerSeconds:
      timedAttempts > 0 ? Math.round(timeMsTotal / timedAttempts / 100) / 10 : null,
  };
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export interface AdminStats {
  public: PublicStats;
  recentTraps: Array<Pick<TrapRecord, "trapId" | "createdAt" | "creatorName" | "friendName" | "trapType" | "tone" | "theme" | "source" | "isTest">>;
  recentAttempts: Array<Pick<AttemptRecord, "attemptId" | "trapId" | "createdAt" | "trapType" | "resultType" | "isTrapped" | "score" | "timeToAnswerMs" | "userAgentCategory" | "isTest">>;
  daily: Array<{ day: string; traps: number; attempts: number }>;
  testCounts: { traps: number; attempts: number };
  contentReview: Array<{ trapType: string; labName: string; citation: string; needsReview: boolean }>;
}

export async function getAdminStats(): Promise<AdminStats> {
  const redis = getRedis();
  const pub = await getPublicStats();

  const [trapIds, attemptIds, testTrapCount, testAttemptCount] = await Promise.all([
    redis.zrange<string[]>(KEYS.trapsAll, -20, -1),
    redis.zrange<string[]>(KEYS.attemptsAll, -25, -1),
    redis.scard(KEYS.testTraps),
    redis.scard(KEYS.testAttempts),
  ]);

  const traps =
    trapIds.length > 0
      ? await redis.mget<(TrapRecord | null)[]>(...trapIds.map(KEYS.trap))
      : [];
  const attempts =
    attemptIds.length > 0
      ? await redis.mget<(AttemptRecord | null)[]>(...attemptIds.map(KEYS.attempt))
      : [];

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() - i * 86_400_000);
    days.push(d.toISOString().slice(0, 10));
  }
  const dp = redis.pipeline();
  for (const d of days) dp.hgetall(KEYS.statsDaily(d));
  const dailyRaw = await dp.exec<Array<Record<string, unknown> | null>>();

  return {
    public: pub,
    recentTraps: traps
      .filter((t): t is TrapRecord => Boolean(t))
      .reverse()
      .map((t) => ({
        trapId: t.trapId,
        createdAt: t.createdAt,
        creatorName: t.creatorName,
        friendName: t.friendName,
        trapType: t.trapType,
        tone: t.tone,
        theme: t.theme,
        source: t.source,
        isTest: t.isTest,
      })),
    recentAttempts: attempts
      .filter((a): a is AttemptRecord => Boolean(a))
      .reverse()
      .map((a) => ({
        attemptId: a.attemptId,
        trapId: a.trapId,
        createdAt: a.createdAt,
        trapType: a.trapType,
        resultType: a.resultType,
        isTrapped: a.isTrapped,
        score: a.score,
        timeToAnswerMs: a.timeToAnswerMs,
        userAgentCategory: a.userAgentCategory,
        isTest: a.isTest,
      })),
    daily: days.map((day, i) => ({
      day,
      traps: num(dailyRaw[i]?.traps),
      attempts: num(dailyRaw[i]?.attempts),
    })),
    testCounts: { traps: num(testTrapCount), attempts: num(testAttemptCount) },
    contentReview: Object.values(TRAPS).map((t) => ({
      trapType: t.id,
      labName: t.labName,
      citation: t.citation.text,
      needsReview: /TODO|citation needed/i.test(t.citation.text),
    })),
  };
}

export interface ExportRow {
  attemptId: string;
  trapId: string;
  createdAt: string;
  trapType: string;
  resultType: string;
  isTrapped: boolean;
  score: number;
  confidence: number | "";
  timeToAnswerMs: number | "";
  frameVariant: string;
  userAgentCategory: string;
  isTest: boolean;
}

export async function exportAttempts(limit = 2000): Promise<ExportRow[]> {
  const redis = getRedis();
  const ids = await redis.zrange<string[]>(KEYS.attemptsAll, -limit, -1);
  if (ids.length === 0) return [];
  const records = await redis.mget<(AttemptRecord | null)[]>(...ids.map(KEYS.attempt));
  return records
    .filter((a): a is AttemptRecord => Boolean(a))
    .map((a) => ({
      attemptId: a.attemptId,
      trapId: a.trapId,
      createdAt: new Date(a.createdAt).toISOString(),
      trapType: a.trapType,
      resultType: a.resultType,
      isTrapped: a.isTrapped,
      score: a.score,
      confidence: a.confidence ?? "",
      timeToAnswerMs: a.timeToAnswerMs ?? "",
      frameVariant: a.frameVariant ?? "",
      userAgentCategory: a.userAgentCategory,
      isTest: a.isTest,
    }));
}

export async function purgeTestData(): Promise<{ traps: number; attempts: number }> {
  const redis = getRedis();
  const [testTraps, testAttempts] = await Promise.all([
    redis.smembers(KEYS.testTraps),
    redis.smembers(KEYS.testAttempts),
  ]);
  const p = redis.pipeline();
  for (const id of testTraps) {
    p.del(KEYS.trap(id));
    p.del(KEYS.trapStats(id));
    p.del(KEYS.attemptsByTrap(id));
    p.zrem(KEYS.trapsAll, id);
  }
  for (const id of testAttempts) {
    p.del(KEYS.attempt(id));
    p.zrem(KEYS.attemptsAll, id);
  }
  p.del(KEYS.testTraps);
  p.del(KEYS.testAttempts);
  if (testTraps.length + testAttempts.length > 0) await p.exec();
  return { traps: testTraps.length, attempts: testAttempts.length };
}
