import { NextRequest, NextResponse } from "next/server";
import { newAttemptId } from "@/lib/ids";
import { isAdminRequest, siteUrl } from "@/lib/env";
import { scoreAttempt } from "@/lib/scoring";
import { RESULT_META, TRAPS } from "@/lib/traps";
import { getAttempt, getTrap, getTrapAggregate, persistAttempt } from "@/lib/stats";
import { createAttemptSchema } from "@/lib/validation";
import { pickFrom } from "@/lib/utils";
import { isDemoTrapId, synthesizeDemoTrap } from "@/lib/demo";
import type { AttemptRecord, TrapRecord } from "@/types";

function uaCategory(req: NextRequest): "mobile" | "desktop" | "unknown" {
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua) return "unknown";
  return /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createAttemptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That answer doesn't parse. The lab is confused but intrigued." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  let trap: TrapRecord | null = null;
  const isDemo = isDemoTrapId(input.trapId);
  try {
    trap = isDemo
      ? synthesizeDemoTrap(input.trapId, input.answer.trapType)
      : await getTrap(input.trapId);
  } catch (err) {
    console.error("Trap lookup failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Storage unreachable." }, { status: 503 });
  }
  if (!trap) {
    return NextResponse.json({ error: "This trap doesn't exist (or was never armed)." }, { status: 404 });
  }
  if (trap.trapType !== input.answer.trapType) {
    return NextResponse.json({ error: "Answer doesn't match this trap type." }, { status: 400 });
  }

  const result = scoreAttempt(input.answer);
  const template = TRAPS[trap.trapType];
  const roastPool = RESULT_META[result.resultType].escaped
    ? template.praiseCopy
    : template.roastCopy;

  const attemptId = newAttemptId();
  const attempt: AttemptRecord = {
    attemptId,
    trapId: trap.trapId,
    createdAt: Date.now(),
    trapType: trap.trapType,
    creatorName: trap.creatorName,
    friendName: trap.friendName,
    tone: trap.tone,
    theme: trap.theme,
    answer: input.answer,
    isTrapped: result.isTrapped,
    resultType: result.resultType,
    score: result.score,
    confidence: result.confidence,
    timeToAnswerMs: input.timeToAnswerMs,
    frameVariant: result.frameVariant,
    anonymousSessionId: input.anonymousSessionId,
    userAgentCategory: uaCategory(req),
    roastLine: pickFrom(roastPool),
    detailLine: result.detailLine,
    isTest: trap.isTest || isAdminRequest(req.headers.get("x-lab-test")),
  };

  try {
    await persistAttempt(attempt);
  } catch (err) {
    console.error("Attempt persist failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "The lab's storage vault is unreachable. Try again in a moment." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    attemptId,
    url: `${siteUrl()}/r/${attemptId}`,
    resultType: result.resultType,
    isTrapped: result.isTrapped,
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    const attempt = await getAttempt(id);
    if (!attempt) return NextResponse.json({ error: "Result not found." }, { status: 404 });
    const aggregate = await getTrapAggregate(attempt.trapId);
    // Public-safe: no session ids, no raw answers beyond what the result page shows.
    return NextResponse.json({
      result: {
        attemptId: attempt.attemptId,
        trapId: attempt.trapId,
        createdAt: attempt.createdAt,
        trapType: attempt.trapType,
        creatorName: attempt.creatorName,
        friendName: attempt.friendName,
        resultType: attempt.resultType,
        isTrapped: attempt.isTrapped,
        score: attempt.score,
        roastLine: attempt.roastLine,
        detailLine: attempt.detailLine,
      },
      aggregate,
    });
  } catch (err) {
    console.error("Attempt read failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Storage unreachable." }, { status: 503 });
  }
}
