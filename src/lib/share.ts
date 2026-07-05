import { RESULT_META, TRAPS } from "@/lib/traps";
import { fillTemplate } from "@/lib/utils";
import type { ResultType, TrapType } from "@/types";

/**
 * Plain-text result signature for copied/shared text. (The visual version —
 * the Iconify "lab report stamp" — lives on the result page and OG images;
 * plain text can't carry SVGs, so words do the work here.)
 */
export function resultSignatureText(resultType: ResultType, trapType: TrapType): string {
  const meta = RESULT_META[resultType];
  const trapName = TRAPS[trapType].labName.replace(/^The /, "").toUpperCase();
  return `BRAIN: ${meta.escaped ? "ESCAPED" : "TRAPPED"} | TRAP: ${trapName} | LAB RESULT: ${meta.signature}`;
}

export function creatorShareText(friendName: string, trapType: TrapType, url: string): string {
  const friend = friendName || "a friend";
  return `I armed a tiny brain trap for ${friend}. Let's see if they survive. ${url}`;
}

export function resultShareText(opts: {
  resultType: ResultType;
  trapType: TrapType;
  creatorName: string;
  url: string;
}): string {
  const template = RESULT_META[opts.resultType].escaped
    ? TRAPS[opts.trapType].shareTextEscaped
    : TRAPS[opts.trapType].shareTextTrapped;
  const line = fillTemplate(template, { creator: opts.creatorName || "My friend" });
  return `Friend Trap Lab\n${resultSignatureText(opts.resultType, opts.trapType)}\n${line}\nYour turn: ${opts.url}`;
}

export function revengeShareText(friendName: string, url: string): string {
  const friend = friendName || "My friend";
  return `${friend} escaped my trap, which is rude. I am escalating. ${url}`;
}
