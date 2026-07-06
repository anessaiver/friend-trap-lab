/**
 * The generic challenge engine. Most traps are pure data: a mechanic,
 * scenario copy with {slot} placeholders, and a scoring map. Creators may
 * customize slot values (proper nouns, silly numbers) — never the
 * structural numbers that make the science work.
 */

import type { IconName } from "@/lib/icons";
import type { ResultType, ScoreOutcome } from "@/types";

/* ------------------------------------------------------------------ */
/* Slots                                                               */
/* ------------------------------------------------------------------ */

export interface SlotDef {
  id: string;
  label: string; // creator-facing
  defaultValue: string;
  maxLen?: number; // default 40
  hint?: string;
}

export function fillSlots(text: string, slots: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (m, key) => slots[key] ?? m);
}

/* ------------------------------------------------------------------ */
/* Mechanics                                                           */
/* ------------------------------------------------------------------ */

export interface ChoiceOption {
  id: string;
  label: string;
  sub?: string;
  icon?: IconName;
  /** For the "bars" visual (social proof line test) */
  barWidth?: number;
  result: ResultType;
  detail: string;
}

export interface ChoiceChallenge {
  mechanic: "choice";
  chip: string;
  chipIcon: IconName;
  story?: string;
  /** Extra highlighted line, e.g. the fake crowd banner */
  banner?: string;
  /** Renders a target bar above options (social proof line test) */
  targetBar?: number;
  question: string;
  options: ChoiceOption[];
  lockLabel?: string;
}

export interface VariantChoiceChallenge {
  mechanic: "variant-choice";
  chip: string;
  chipIcon: IconName;
  variants: Record<string, { story: string; question: string; options: ChoiceOption[] }>;
  lockLabel?: string;
}

export interface TwoRoundChallenge {
  mechanic: "two-round";
  chipIcon: IconName;
  rounds: [
    { title: string; story: string; options: { id: string; label: string }[] },
    { title: string; story: string; options: { id: string; label: string }[] },
  ];
  /** Keyed "r1|r2" */
  outcomes: Record<string, { result: ResultType; detail: string }>;
}

export interface NumericBand {
  variant?: string;
  eq?: number;
  lte?: number;
  gte?: number;
  result: ResultType;
  detail: string;
}

export interface VariantCompareCfg {
  title: string;
  labels: Record<string, string>; // variant -> "Subjects who owned it ask"
  unit?: string; // "$", "%", ""
}

export interface NumericChallenge {
  mechanic: "numeric";
  chip: string;
  chipIcon: IconName;
  story?: string;
  question: string;
  placeholder: string;
  min: number;
  max: number;
  allowDecimal?: boolean;
  unit?: string;
  /** Random per-attempt variants that change the copy (endowment WTA/WTP) */
  variants?: Record<string, { story?: string; question?: string }>;
  bands: NumericBand[]; // first match wins; filtered by variant when set
  compare?: VariantCompareCfg;
}

export interface ScaleChallenge {
  mechanic: "scale";
  chip: string;
  chipIcon: IconName;
  story: string;
  /** Optional list rendered as a "report" card (Forer statements) */
  statements?: string[];
  question: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  variants?: Record<string, { story: string }>;
  bands: NumericBand[];
  compare?: VariantCompareCfg;
}

export interface DualScaleChallenge {
  mechanic: "dual-scale";
  chipIcon: IconName;
  round1: { title: string; story: string };
  round2: { title: string; story: string };
  question: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  /** detail templates; {r1}/{r2} placeholders get the two ratings */
  deltaDetails: { big: string; small: string; none: string; reversed: string };
}

export interface PlanningChallenge {
  mechanic: "planning";
  chipIcon: IconName;
  estimatePrompt: string;
  taskSentence: string; // E-count computed at runtime — no hand-counting bugs
  taskQuestion: string;
}

export type GenericChallenge =
  | ChoiceChallenge
  | VariantChoiceChallenge
  | TwoRoundChallenge
  | NumericChallenge
  | ScaleChallenge
  | DualScaleChallenge
  | PlanningChallenge;

/* ------------------------------------------------------------------ */
/* Generic answers                                                     */
/* ------------------------------------------------------------------ */

export type GenericAnswer =
  | { kind: "choice"; choice: string; variant?: string }
  | { kind: "two-round"; r1: string; r2: string }
  | { kind: "numeric"; value: number; variant?: string }
  | { kind: "scale"; rating: number; variant?: string }
  | { kind: "dual-scale"; rating1: number; rating2: number }
  | { kind: "planning"; estimateSeconds: number; countAnswer: number };

const SCORE: Record<ResultType, number> = {
  "tiny-genius": 100,
  "clean-escape": 85,
  "suspicious-escape": 60,
  "double-agent": 40,
  "lab-incident": 25,
  "beautiful-disaster": 10,
};

function out(
  result: ResultType,
  detail: string,
  slots: Record<string, string>,
  extra?: Partial<ScoreOutcome>
): ScoreOutcome {
  return {
    resultType: result,
    isTrapped: result === "lab-incident" || result === "beautiful-disaster",
    score: SCORE[result],
    detailLine: fillSlots(detail, slots),
    ...extra,
  };
}

function matchBand(bands: NumericBand[], value: number, variant?: string): NumericBand | null {
  for (const b of bands) {
    if (b.variant && b.variant !== variant) continue;
    if (b.eq !== undefined && Math.abs(value - b.eq) > 1e-9) continue;
    if (b.lte !== undefined && value > b.lte) continue;
    if (b.gte !== undefined && value < b.gte) continue;
    return b;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export function scoreGeneric(
  challenge: GenericChallenge,
  answer: GenericAnswer,
  slots: Record<string, string>,
  timeToAnswerMs?: number
): ScoreOutcome | null {
  switch (challenge.mechanic) {
    case "choice": {
      if (answer.kind !== "choice") return null;
      const opt = challenge.options.find((o) => o.id === answer.choice);
      if (!opt) return null;
      return out(opt.result, opt.detail, slots);
    }

    case "variant-choice": {
      if (answer.kind !== "choice" || !answer.variant) return null;
      const variant = challenge.variants[answer.variant];
      if (!variant) return null;
      const opt = variant.options.find((o) => o.id === answer.choice);
      if (!opt) return null;
      return out(opt.result, opt.detail, slots, { frameVariant: answer.variant });
    }

    case "two-round": {
      if (answer.kind !== "two-round") return null;
      const key = `${answer.r1}|${answer.r2}`;
      const outcome = challenge.outcomes[key];
      if (!outcome) return null;
      return out(outcome.result, outcome.detail, slots, { frameVariant: key });
    }

    case "numeric": {
      if (answer.kind !== "numeric") return null;
      if (challenge.variants && (!answer.variant || !challenge.variants[answer.variant])) return null;
      const value = Math.min(Math.max(answer.value, challenge.min), challenge.max);
      const band = matchBand(challenge.bands, value, answer.variant);
      if (!band) return null;
      return out(band.result, band.detail.replaceAll("{value}", value.toLocaleString()), slots, {
        frameVariant: answer.variant,
      });
    }

    case "scale": {
      if (answer.kind !== "scale") return null;
      if (challenge.variants && (!answer.variant || !challenge.variants[answer.variant])) return null;
      const rating = Math.min(Math.max(answer.rating, challenge.min), challenge.max);
      const band = matchBand(challenge.bands, rating, answer.variant);
      if (!band) return null;
      return out(band.result, band.detail.replaceAll("{value}", String(rating)), slots, {
        frameVariant: answer.variant,
        confidence: rating,
      });
    }

    case "dual-scale": {
      if (answer.kind !== "dual-scale") return null;
      const r1 = Math.min(Math.max(answer.rating1, challenge.min), challenge.max);
      const r2 = Math.min(Math.max(answer.rating2, challenge.min), challenge.max);
      const delta = r1 - r2; // round 1 framed positively; positive delta = swayed
      const d = challenge.deltaDetails;
      const fill = (t: string) => t.replaceAll("{r1}", String(r1)).replaceAll("{r2}", String(r2));
      if (delta >= 2) return out("lab-incident", fill(d.big), slots, { frameVariant: `d${delta}` });
      if (delta === 1) return out("suspicious-escape", fill(d.small), slots, { frameVariant: "d1" });
      if (delta <= -2) return out("double-agent", fill(d.reversed), slots, { frameVariant: `d${delta}` });
      if (delta === -1) return out("suspicious-escape", fill(d.small), slots, { frameVariant: "d-1" });
      return out("tiny-genius", fill(d.none), slots, { frameVariant: "d0" });
    }

    case "planning": {
      if (answer.kind !== "planning") return null;
      const actual = Math.max(1, Math.round((timeToAnswerMs ?? 0) / 1000));
      const est = answer.estimateSeconds;
      const correctCount = (challenge.taskSentence.match(/e/gi) ?? []).length;
      const countNote =
        answer.countAnswer === correctCount
          ? `(Your E-count of ${answer.countAnswer} was even correct.)`
          : `(The E-count was ${correctCount}, not ${answer.countAnswer} — but that part was never the trap.)`;
      const base = `You estimated ${est}s. Reality: ${actual}s. ${countNote}`;
      if (timeToAnswerMs === undefined) {
        return out("suspicious-escape", `${base} Your clock went missing, so the lab calls this a draw.`, slots);
      }
      if (actual > est * 2) return out("beautiful-disaster", base, slots);
      if (actual > est * 1.3) return out("lab-incident", base, slots);
      if (actual < est * 0.5)
        return out("double-agent", `${base} You padded that estimate like a veteran contractor.`, slots);
      if (actual >= est * 0.7) return out("tiny-genius", base, slots);
      return out("clean-escape", base, slots);
    }
  }
}
