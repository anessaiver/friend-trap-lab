import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Text sanitation                                                     */
/* ------------------------------------------------------------------ */

export const LIMITS = {
  name: 40,
  message: 180,
} as const;

// Severe abuse only — playful trash talk is the product; slurs are not.
const BLOCKED_TERMS = [
  "nigger", "nigga", "faggot", "kike", "spic", "chink", "tranny",
  "retard", "wetback", "gook", "dyke", "coon",
  "kys", "killyourself", "kill yourself",
];

function normalizeForCheck(input: string): string {
  return input
    .toLowerCase()
    .replace(/[013457$@!]/g, (c) =>
      ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", $: "s", "@": "a", "!": "i" })[c] ?? c
    )
    .replace(/[^a-z ]/g, "");
}

export function containsBlockedLanguage(input: string): boolean {
  const normalized = normalizeForCheck(input);
  const squashed = normalized.replace(/ /g, "");
  return BLOCKED_TERMS.some(
    (term) => normalized.includes(term) || squashed.includes(term.replace(/ /g, ""))
  );
}

export function sanitizeText(input: string, maxLen: number): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, " ") // control chars
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen)
    .trim();
}

export function containsLink(input: string): boolean {
  return /(https?:\/\/|www\.)/i.test(input);
}

/* ------------------------------------------------------------------ */
/* API input schemas                                                   */
/* ------------------------------------------------------------------ */

export const trapTypeSchema = z.enum([
  "anchor", "frameflip", "baserate", "pattern",
  "availability", "sunkcost", "decoy", "confidence",
]);

export const toneSchema = z.enum(["nice", "spicy", "chaotic", "goblin"]);

export const themeSchema = z.enum([
  "clean-lab", "neon-trap", "evidence-board", "villain", "game-show", "emergency",
]);

export const createTrapSchema = z.object({
  creatorName: z.string().max(LIMITS.name).optional().default(""),
  friendName: z.string().max(LIMITS.name).optional().default(""),
  trapType: trapTypeSchema,
  tone: toneSchema.optional().default("spicy"),
  theme: themeSchema.optional().default("clean-lab"),
  customMessage: z.string().max(LIMITS.message + 60).optional().default(""),
  creatorSessionId: z.string().max(64).optional().default(""),
  source: z.string().max(32).optional().default("direct"),
  utm: z
    .object({
      source: z.string().max(64).optional(),
      medium: z.string().max(64).optional(),
      campaign: z.string().max(64).optional(),
    })
    .optional()
    .default({}),
});

const patternTest = z.object({
  a: z.number().int().min(-9999).max(9999),
  b: z.number().int().min(-9999).max(9999),
  c: z.number().int().min(-9999).max(9999),
});

export const answerSchema = z.discriminatedUnion("trapType", [
  z.object({
    trapType: z.literal("anchor"),
    estimate: z.number().int().min(0).max(1_000_000),
    variant: z.enum(["high", "low"]),
  }),
  z.object({
    trapType: z.literal("frameflip"),
    q1: z.enum(["sure", "gamble"]),
    q2: z.enum(["sure", "gamble"]),
  }),
  z.object({
    trapType: z.literal("baserate"),
    pick: z.enum(["flagged", "standard"]),
    confidence: z.number().int().min(50).max(100),
  }),
  z.object({
    trapType: z.literal("pattern"),
    tests: z.array(patternTest).max(3),
    guess: z.enum(["plus-two", "evens-up", "any-increasing", "sum-twelve"]),
  }),
  z.object({
    trapType: z.literal("availability"),
    picks: z.array(z.number().int().min(0).max(1)).length(3),
  }),
  z.object({
    trapType: z.literal("sunkcost"),
    choice: z.enum(["finish", "stop", "reprice"]),
  }),
  z.object({
    trapType: z.literal("decoy"),
    choice: z.enum(["small", "medium", "large"]),
  }),
  z.object({
    trapType: z.literal("confidence"),
    pick: z.enum(["jupiter", "saturn"]),
    confidence: z.number().int().min(50).max(100),
  }),
]);

export const createAttemptSchema = z.object({
  trapId: z.string().min(1).max(64),
  answer: answerSchema,
  timeToAnswerMs: z.number().int().min(0).max(600_000).optional(),
  anonymousSessionId: z.string().max(64).optional().default(""),
});

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  source: z.string().max(64).optional().default("site"),
  trapId: z.string().max(64).optional(),
  attemptId: z.string().max(64).optional(),
  // Honeypot: real humans never fill this.
  labNotes: z.string().max(0).optional().default(""),
});

export const FRIENDLY_LANGUAGE_ERROR =
  "Let's keep the lab playful — that wording won't fly here. Try a different taunt.";

export const FRIENDLY_LINK_ERROR =
  "Links can't ride along in messages (spam goblins ruined it for everyone).";
