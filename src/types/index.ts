export type TrapType =
  | "anchor"
  | "frameflip"
  | "baserate"
  | "pattern"
  | "availability"
  | "sunkcost"
  | "decoy"
  | "confidence";

export type Tone = "nice" | "spicy" | "chaotic" | "goblin";

export type Theme =
  | "clean-lab"
  | "neon-trap"
  | "evidence-board"
  | "villain"
  | "game-show"
  | "emergency";

export type ResultType =
  | "clean-escape"
  | "suspicious-escape"
  | "lab-incident"
  | "beautiful-disaster"
  | "double-agent"
  | "tiny-genius";

export type PatternGuess = "plus-two" | "evens-up" | "any-increasing" | "sum-twelve";

export type AnswerPayload =
  | { trapType: "anchor"; estimate: number; variant: "high" | "low" }
  | { trapType: "frameflip"; q1: "sure" | "gamble"; q2: "sure" | "gamble" }
  | { trapType: "baserate"; pick: "flagged" | "standard"; confidence: number }
  | { trapType: "pattern"; tests: { a: number; b: number; c: number }[]; guess: PatternGuess }
  | { trapType: "availability"; picks: number[] }
  | { trapType: "sunkcost"; choice: "finish" | "stop" | "reprice" }
  | { trapType: "decoy"; choice: "small" | "medium" | "large" }
  | { trapType: "confidence"; pick: "jupiter" | "saturn"; confidence: number };

export interface UtmFields {
  source?: string;
  medium?: string;
  campaign?: string;
}

export interface TrapRecord {
  trapId: string;
  createdAt: number;
  creatorName: string;
  friendName: string;
  trapType: TrapType;
  tone: Tone;
  theme: Theme;
  customMessage: string;
  shareSlug: string;
  creatorSessionId: string;
  source: string;
  utm: UtmFields;
  isTest: boolean;
}

/** Trap data safe to send to any client (no session ids). */
export interface PublicTrap {
  trapId: string;
  createdAt: number;
  creatorName: string;
  friendName: string;
  trapType: TrapType;
  tone: Tone;
  theme: Theme;
  customMessage: string;
}

export interface AttemptRecord {
  attemptId: string;
  trapId: string;
  createdAt: number;
  trapType: TrapType;
  creatorName: string;
  friendName: string;
  tone: Tone;
  theme: Theme;
  answer: AnswerPayload;
  isTrapped: boolean;
  resultType: ResultType;
  score: number;
  confidence?: number;
  timeToAnswerMs?: number;
  frameVariant?: string;
  anonymousSessionId: string;
  userAgentCategory: "mobile" | "desktop" | "unknown";
  roastLine: string;
  detailLine: string;
  isTest: boolean;
}

export interface ScoreOutcome {
  isTrapped: boolean;
  resultType: ResultType;
  score: number;
  detailLine: string;
  frameVariant?: string;
  confidence?: number;
}

export interface TrapAggregate {
  attempts: number;
  trapped: number;
}

export interface TypeStats {
  trapType: TrapType;
  attempts: number;
  trapped: number;
  trappedRate: number | null; // null when the sample is too small to be meaningful
}

export interface PublicStats {
  trapsCreated: number;
  attempts: number;
  trapped: number;
  escaped: number;
  revengeTraps: number;
  emailSignups: number;
  todayTraps: number;
  todayAttempts: number;
  smallSample: boolean;
  mostDangerous: TypeStats | null;
  mostEscaped: TypeStats | null;
  byType: TypeStats[];
  avgAnswerSeconds: number | null;
}
