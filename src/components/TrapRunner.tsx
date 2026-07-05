"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { InviteCard } from "@/components/InviteCard";
import { getSessionId } from "@/lib/client-session";
import {
  ANCHOR_CHALLENGE,
  AVAILABILITY_CHALLENGE,
  BASERATE_CHALLENGE,
  CONFIDENCE_CHALLENGE,
  DECOY_CHALLENGE,
  FRAMEFLIP_CHALLENGE,
  PATTERN_CHALLENGE,
  SUNKCOST_CHALLENGE,
  TONES,
  TRAPS,
} from "@/lib/traps";
import { cn } from "@/lib/utils";
import type { AnswerPayload, PatternGuess, PublicTrap } from "@/types";

const SUSPENSE_LINES = [
  "Bait analyzed…",
  "The neurons are negotiating…",
  "Cross-referencing with 60 years of science…",
  "Science has requested a dramatic pause…",
  "Result incoming…",
];

const MIN_SUSPENSE_MS = 2200;

type Stage = "intro" | "challenge" | "suspense" | "error";

export function TrapRunner({ trap }: { trap: PublicTrap }) {
  const router = useRouter();
  const template = TRAPS[trap.trapType];
  const tone = TONES[trap.tone];
  const [stage, setStage] = useState<Stage>("intro");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef<number>(0);
  const pendingAnswer = useRef<AnswerPayload | null>(null);

  function begin() {
    startedAt.current = Date.now();
    setStage("challenge");
  }

  async function submit(answer: AnswerPayload) {
    pendingAnswer.current = answer;
    setStage("suspense");
    const suspenseStart = Date.now();
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trapId: trap.trapId,
          answer,
          timeToAnswerMs: Math.min(600_000, Date.now() - startedAt.current),
          anonymousSessionId: getSessionId(),
        }),
      });
      const data = (await res.json()) as { attemptId?: string; error?: string };
      if (!res.ok || !data.attemptId) {
        throw new Error(data.error ?? "The lab jammed.");
      }
      const elapsed = Date.now() - suspenseStart;
      const wait = Math.max(0, MIN_SUSPENSE_MS - elapsed);
      setTimeout(() => router.push(`/r/${data.attemptId}`), wait);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "The lab jammed.");
      setStage("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <InviteCard
              creatorName={trap.creatorName}
              friendName={trap.friendName}
              trapType={trap.trapType}
              tone={trap.tone}
              theme={trap.theme}
              customMessage={trap.customMessage}
            />
            <p className="mt-6 text-center text-lg text-frost">
              {template.preRevealFrame}
            </p>
            <button onClick={begin} className="btn-primary mt-6 w-full text-lg">
              {tone.buttonLabel}
            </button>
            <p className="mt-3 text-center font-mono text-xs text-fog">
              no signup · ~{template.estimatedTimeSeconds} seconds · your friend is
              watching, spiritually
            </p>
          </motion.div>
        )}

        {stage === "challenge" && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="chip">🔴 subject in the lab</span>
              <span className="font-mono text-xs text-fog">
                {template.emoji} {template.publicTitle}
              </span>
            </div>
            <Challenge trapType={trap.trapType} onSubmit={submit} />
          </motion.div>
        )}

        {stage === "suspense" && <SuspenseOverlay key="suspense" />}

        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-6 text-center"
          >
            <p className="text-lg font-semibold">The lab jammed. 🔧</p>
            <p className="mt-2 text-sm text-fog">{errorMsg}</p>
            <button
              className="btn-primary mt-5"
              onClick={() => {
                if (pendingAnswer.current) submit(pendingAnswer.current);
              }}
            >
              Try submitting again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuspenseOverlay() {
  const [lineIndex, setLineIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setLineIndex((i) => Math.min(i + 1, SUSPENSE_LINES.length - 1)), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass flex flex-col items-center gap-5 p-10 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
        transition={{ duration: 1.1, repeat: Infinity }}
        className="text-5xl"
        aria-hidden="true"
      >
        🧪
      </motion.div>
      <div className="h-1.5 w-full max-w-64 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-scan rounded-full bg-gradient-to-r from-teal via-grape to-punch" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="font-mono text-sm text-fog"
        >
          {SUSPENSE_LINES[lineIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Challenge dispatcher                                                */
/* ------------------------------------------------------------------ */

function Challenge({
  trapType,
  onSubmit,
}: {
  trapType: PublicTrap["trapType"];
  onSubmit: (answer: AnswerPayload) => void;
}) {
  switch (trapType) {
    case "anchor":
      return <AnchorChallenge onSubmit={onSubmit} />;
    case "frameflip":
      return <FrameFlipChallenge onSubmit={onSubmit} />;
    case "baserate":
      return <BaseRateChallenge onSubmit={onSubmit} />;
    case "pattern":
      return <PatternChallenge onSubmit={onSubmit} />;
    case "availability":
      return <AvailabilityChallenge onSubmit={onSubmit} />;
    case "sunkcost":
      return <SunkCostChallenge onSubmit={onSubmit} />;
    case "decoy":
      return <DecoyChallenge onSubmit={onSubmit} />;
    case "confidence":
      return <ConfidenceChallenge onSubmit={onSubmit} />;
  }
}

type SubmitFn = (answer: AnswerPayload) => void;

/* ---------- shared bits ---------- */

function OptionButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "glass w-full px-4 py-4 text-left text-[15px] leading-snug transition-all",
        selected
          ? "border-teal/70 bg-teal/10 shadow-[0_0_24px_-8px_rgba(24,212,208,0.6)]"
          : "hover:border-white/25 hover:bg-white/[0.07]",
        className
      )}
    >
      {children}
    </button>
  );
}

function LockIn({ disabled, onClick, label = "Lock it in" }: { disabled: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" className="btn-primary mt-5 w-full" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

/* ---------- 1. Anchor ---------- */

function JarSvg() {
  // A cute lab jar of jellybeans; decorative only.
  const beans = [
    [30, 78, "#18D4D0"], [44, 84, "#F72585"], [58, 79, "#8E4DFF"], [70, 85, "#18D4D0"],
    [36, 68, "#8E4DFF"], [52, 70, "#F8FAFC"], [66, 66, "#F72585"], [28, 58, "#F72585"],
    [44, 58, "#18D4D0"], [60, 55, "#8E4DFF"], [72, 58, "#F8FAFC"], [38, 46, "#F72585"],
    [54, 44, "#18D4D0"], [68, 46, "#8E4DFF"],
  ] as const;
  return (
    <svg viewBox="0 0 100 100" className="mx-auto h-36 w-36" aria-hidden="true">
      <path d="M30 12h40M34 12v10c-8 6-14 14-14 26v30a14 14 0 0 0 14 14h32a14 14 0 0 0 14-14V48c0-12-6-20-14-26V12" fill="rgba(248,250,252,0.05)" stroke="rgba(248,250,252,0.4)" strokeWidth="2.5" strokeLinecap="round" />
      {beans.map(([x, y, c], i) => (
        <ellipse key={i} cx={x} cy={y} rx="6" ry="4.2" fill={c} opacity="0.9" transform={`rotate(${(i * 37) % 60 - 30} ${x} ${y})`} />
      ))}
    </svg>
  );
}

function AnchorChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  // Variant is assigned when the challenge mounts (post-interaction, so no hydration issues).
  const [variant] = useState<"high" | "low">(() => (Math.random() < 0.5 ? "high" : "low"));
  const [value, setValue] = useState("");
  const anchor = ANCHOR_CHALLENGE.anchors[variant];
  const parsed = parseInt(value.replace(/[^\d]/g, ""), 10);
  const valid = Number.isFinite(parsed) && parsed >= 1 && parsed <= 1_000_000;

  return (
    <div className="glass p-6">
      <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-ink/60 px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
          calibration code
        </span>
        <span className="font-mono text-xl font-bold tracking-widest text-grape">
          {anchor.toLocaleString()}
        </span>
      </div>
      <JarSvg />
      <p className="mt-2 text-center text-sm text-fog">{ANCHOR_CHALLENGE.jarDescription}</p>
      <h2 className="mt-5 text-center text-xl font-bold">
        How many jellybeans are in the jar?
      </h2>
      <label className="sr-only" htmlFor="estimate">
        Your estimate
      </label>
      <input
        id="estimate"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Your gut number"
        className="input mt-4 text-center text-xl font-bold tabular-nums"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <LockIn disabled={!valid} onClick={() => valid && onSubmit({ trapType: "anchor", estimate: parsed, variant })} />
      <p className="mt-3 text-center font-mono text-xs text-fog/70">don't overthink it</p>
    </div>
  );
}

/* ---------- 2. Frame flip ---------- */

function FrameFlipChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [round, setRound] = useState<1 | 2>(1);
  const [q1, setQ1] = useState<"sure" | "gamble" | null>(null);
  const q = round === 1 ? FRAMEFLIP_CHALLENGE.q1 : FRAMEFLIP_CHALLENGE.q2;

  function pick(choice: "sure" | "gamble") {
    if (round === 1) {
      setQ1(choice);
      setTimeout(() => setRound(2), 350);
    } else if (q1) {
      onSubmit({ trapType: "frameflip", q1, q2: choice });
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={round}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.25 }}
        className="glass p-6"
      >
        <div className="chip">{round}/2 · act fast</div>
        <h2 className="mt-3 text-xl font-bold">{q.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-fog">{q.story}</p>
        <div className="mt-5 flex flex-col gap-3">
          <OptionButton onClick={() => pick("sure")}>{q.sure}</OptionButton>
          <OptionButton onClick={() => pick("gamble")}>{q.gamble}</OptionButton>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- 3. Base rate ---------- */

function BaseRateChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [pick, setPick] = useState<"flagged" | "standard" | null>(null);
  const [confidence, setConfidence] = useState(75);

  return (
    <div className="glass p-6">
      <div className="chip">🚨 incident report</div>
      <p className="mt-3 text-[15px] leading-relaxed text-frost">{BASERATE_CHALLENGE.story}</p>
      <h2 className="mt-4 text-xl font-bold">{BASERATE_CHALLENGE.question}</h2>
      <div className="mt-4 flex flex-col gap-3">
        <OptionButton selected={pick === "flagged"} onClick={() => setPick("flagged")}>
          🐭 {BASERATE_CHALLENGE.options.flagged}
        </OptionButton>
        <OptionButton selected={pick === "standard"} onClick={() => setPick("standard")}>
          🐁 {BASERATE_CHALLENGE.options.standard}
        </OptionButton>
      </div>
      <div className="mt-6">
        <label htmlFor="br-conf" className="label">
          How sure are you? <span className="text-frost">{confidence}%</span>
        </label>
        <input
          id="br-conf"
          type="range"
          min={50}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="flex justify-between font-mono text-[10px] text-fog/70">
          <span>50% · coin flip</span>
          <span>100% · bet the lab</span>
        </div>
      </div>
      <LockIn
        disabled={!pick}
        onClick={() => pick && onSubmit({ trapType: "baserate", pick, confidence })}
        label="File the accusation"
      />
    </div>
  );
}

/* ---------- 4. Pattern ---------- */

function PatternChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [inputs, setInputs] = useState(["", "", ""]);
  const [tests, setTests] = useState<{ a: number; b: number; c: number; fits: boolean }[]>([]);
  const [guess, setGuess] = useState<PatternGuess | null>(null);
  const testsLeft = PATTERN_CHALLENGE.maxTests - tests.length;
  const nums = inputs.map((v) => parseInt(v, 10));
  const canTest = testsLeft > 0 && nums.every((n) => Number.isFinite(n) && Math.abs(n) <= 9999);

  function runTest() {
    if (!canTest) return;
    const [a, b, c] = nums;
    setTests((t) => [...t, { a, b, c, fits: PATTERN_CHALLENGE.fits(a, b, c) }]);
    setInputs(["", "", ""]);
  }

  return (
    <div className="glass p-6">
      <div className="chip">🔐 the lab lock</div>
      <p className="mt-3 text-[15px] leading-relaxed text-fog">
        The lock follows a secret number rule. This code opens it:
      </p>
      <div className="mt-3 flex items-center gap-2 font-mono text-lg font-bold">
        <span className="rounded-lg bg-ink/60 px-3 py-1.5 border border-teal/40">2</span>
        <span className="rounded-lg bg-ink/60 px-3 py-1.5 border border-teal/40">4</span>
        <span className="rounded-lg bg-ink/60 px-3 py-1.5 border border-teal/40">6</span>
        <span className="text-sm text-teal">✓ OPENS</span>
      </div>

      <div className="mt-5">
        <span className="label">
          Test your own codes ({testsLeft} left — or skip straight to the answer)
        </span>
        <div className="flex items-center gap-2">
          {inputs.map((v, i) => (
            <input
              key={i}
              aria-label={`Test number ${i + 1}`}
              inputMode="numeric"
              className="input !px-2 text-center font-mono tabular-nums"
              value={v}
              onChange={(e) =>
                setInputs((prev) => prev.map((p, j) => (j === i ? e.target.value.replace(/[^\d-]/g, "") : p)))
              }
            />
          ))}
          <button type="button" className="btn-ghost shrink-0 !min-h-11 !px-4" disabled={!canTest} onClick={runTest}>
            Test
          </button>
        </div>
        {tests.length > 0 && (
          <ul className="mt-3 space-y-1.5" aria-live="polite">
            {tests.map((t, i) => (
              <li key={i} className="flex items-center gap-2 font-mono text-sm">
                <span className="text-fog">
                  {t.a} · {t.b} · {t.c}
                </span>
                {t.fits ? (
                  <span className="text-teal">✓ OPENS</span>
                ) : (
                  <span className="text-punch">✗ DENIED</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <fieldset className="mt-6">
        <legend className="label">Name the rule</legend>
        <div className="flex flex-col gap-2.5">
          {PATTERN_CHALLENGE.guesses.map((g) => (
            <OptionButton key={g.id} selected={guess === g.id} onClick={() => setGuess(g.id)}>
              {g.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      <LockIn
        disabled={!guess}
        onClick={() =>
          guess &&
          onSubmit({
            trapType: "pattern",
            tests: tests.map(({ a, b, c }) => ({ a, b, c })),
            guess,
          })
        }
        label="Call it"
      />
    </div>
  );
}

/* ---------- 5. Availability ---------- */

function AvailabilityChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const rounds = AVAILABILITY_CHALLENGE.rounds;

  function pick(index: number) {
    const next = [...picks, index];
    if (next.length === rounds.length) {
      onSubmit({ trapType: "availability", picks: next });
    } else {
      setPicks(next);
      setRound((r) => r + 1);
    }
  }

  const current = rounds[round];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={round}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.25 }}
        className="glass p-6"
      >
        <div className="chip">
          round {round + 1}/{rounds.length}
        </div>
        <h2 className="mt-3 text-xl font-bold">{AVAILABILITY_CHALLENGE.question}</h2>
        <div className="mt-5 flex flex-col gap-3">
          {current.options.map((opt, i) => (
            <OptionButton key={opt} onClick={() => pick(i)} className="text-lg">
              {opt}
            </OptionButton>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-xs text-fog/70">
          gut first, spreadsheet later
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- 6. Sunk cost ---------- */

function SunkCostChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [choice, setChoice] = useState<"finish" | "stop" | "reprice" | null>(null);
  return (
    <div className="glass p-6">
      <div className="chip">🗂️ director's desk</div>
      <p className="mt-3 text-[15px] leading-relaxed text-frost">{SUNKCOST_CHALLENGE.story}</p>
      <h2 className="mt-4 text-xl font-bold">{SUNKCOST_CHALLENGE.question}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {SUNKCOST_CHALLENGE.options.map((o) => (
          <OptionButton key={o.id} selected={choice === o.id} onClick={() => setChoice(o.id)}>
            {o.label}
          </OptionButton>
        ))}
      </div>
      <LockIn
        disabled={!choice}
        onClick={() => choice && onSubmit({ trapType: "sunkcost", choice })}
        label="Sign the budget"
      />
    </div>
  );
}

/* ---------- 7. Decoy ---------- */

function DecoyChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [choice, setChoice] = useState<"small" | "medium" | "large" | null>(null);
  return (
    <div className="glass p-6">
      <div className="chip">🍿 concession stand</div>
      <p className="mt-3 text-[15px] text-fog">{DECOY_CHALLENGE.intro}</p>
      <div className="mt-4 flex flex-col gap-3">
        {DECOY_CHALLENGE.options.map((o) => (
          <OptionButton key={o.id} selected={choice === o.id} onClick={() => setChoice(o.id)}>
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{o.label}</span>
              <span className="font-mono text-lg text-teal">{o.price}</span>
            </span>
            <span className="text-sm text-fog">{o.tag}</span>
          </OptionButton>
        ))}
      </div>
      <LockIn
        disabled={!choice}
        onClick={() => choice && onSubmit({ trapType: "decoy", choice })}
        label="Order it"
      />
    </div>
  );
}

/* ---------- 8. Confidence ---------- */

function ConfidenceChallenge({ onSubmit }: { onSubmit: SubmitFn }) {
  const [pick, setPick] = useState<"jupiter" | "saturn" | null>(null);
  const [confidence, setConfidence] = useState(75);
  return (
    <div className="glass p-6">
      <div className="chip">🔭 question one of one</div>
      <h2 className="mt-3 text-xl font-bold">{CONFIDENCE_CHALLENGE.question}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {CONFIDENCE_CHALLENGE.options.map((o) => (
          <OptionButton key={o.id} selected={pick === o.id} onClick={() => setPick(o.id)} className="text-lg">
            {o.id === "jupiter" ? "🟠" : "🪐"} {o.label}
          </OptionButton>
        ))}
      </div>
      <div className="mt-6">
        <label htmlFor="cc-conf" className="label">
          Now aim the confidence cannon: <span className="text-frost">{confidence}%</span>
        </label>
        <input
          id="cc-conf"
          type="range"
          min={50}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="flex justify-between font-mono text-[10px] text-fog/70">
          <span>50% · pure guess</span>
          <span>100% · stake your reputation</span>
        </div>
      </div>
      <LockIn
        disabled={!pick}
        onClick={() => pick && onSubmit({ trapType: "confidence", pick, confidence })}
        label="Fire"
      />
    </div>
  );
}
