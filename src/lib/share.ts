import { RESULT_META, TRAPS } from "@/lib/traps";
import { fillTemplate } from "@/lib/utils";
import type { ResultType, TrapType } from "@/types";

/** Wordle-style compact result summary for pasting anywhere. */
export function emojiGrid(resultType: ResultType, trapType: TrapType): string {
  return `${RESULT_META[resultType].grid} ${TRAPS[trapType].emoji}`;
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
  const grid = emojiGrid(opts.resultType, opts.trapType);
  return `Friend Trap Lab\n${grid}\n${line}\nYour turn: ${opts.url}`;
}

export function revengeShareText(friendName: string, url: string): string {
  const friend = friendName || "My friend";
  return `${friend} escaped my trap, which is rude. I am escalating. ${url}`;
}
