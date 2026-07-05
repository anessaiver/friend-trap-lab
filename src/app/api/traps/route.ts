import { NextRequest, NextResponse } from "next/server";
import { newTrapId } from "@/lib/ids";
import { isAdminRequest, siteUrl } from "@/lib/env";
import { creatorShareText } from "@/lib/share";
import { getTrap, persistTrap } from "@/lib/stats";
import {
  containsBlockedLanguage,
  containsLink,
  createTrapSchema,
  FRIENDLY_LANGUAGE_ERROR,
  FRIENDLY_LINK_ERROR,
  LIMITS,
  sanitizeText,
} from "@/lib/validation";
import type { PublicTrap, TrapRecord } from "@/types";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createTrapSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That trap configuration doesn't parse. Check your inputs." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const creatorName = sanitizeText(input.creatorName, LIMITS.name);
  const friendName = sanitizeText(input.friendName, LIMITS.name);
  const customMessage = sanitizeText(input.customMessage, LIMITS.message);

  for (const text of [creatorName, friendName, customMessage]) {
    if (text && containsBlockedLanguage(text)) {
      return NextResponse.json({ error: FRIENDLY_LANGUAGE_ERROR }, { status: 400 });
    }
  }
  if (containsLink(customMessage)) {
    return NextResponse.json({ error: FRIENDLY_LINK_ERROR }, { status: 400 });
  }

  const trapId = newTrapId();
  const isTest = isAdminRequest(req.headers.get("x-lab-test"));

  const trap: TrapRecord = {
    trapId,
    createdAt: Date.now(),
    creatorName,
    friendName,
    trapType: input.trapType,
    tone: input.tone,
    theme: input.theme,
    customMessage,
    shareSlug: trapId,
    creatorSessionId: input.creatorSessionId,
    source: input.source,
    utm: input.utm,
    isTest,
  };

  try {
    await persistTrap(trap);
  } catch (err) {
    console.error("Trap persist failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "The lab's storage vault is unreachable. Try again in a moment." },
      { status: 503 }
    );
  }

  const url = `${siteUrl()}/t/${trapId}`;
  return NextResponse.json({
    trapId,
    url,
    shareText: creatorShareText(friendName, input.trapType, url),
    ogUrl: `${siteUrl()}/api/og/trap?id=${trapId}`,
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    const trap = await getTrap(id);
    if (!trap) return NextResponse.json({ error: "Trap not found." }, { status: 404 });
    const publicTrap: PublicTrap = {
      trapId: trap.trapId,
      createdAt: trap.createdAt,
      creatorName: trap.creatorName,
      friendName: trap.friendName,
      trapType: trap.trapType,
      tone: trap.tone,
      theme: trap.theme,
      customMessage: trap.customMessage,
    };
    return NextResponse.json({ trap: publicTrap });
  } catch (err) {
    console.error("Trap read failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Storage unreachable." }, { status: 503 });
  }
}
