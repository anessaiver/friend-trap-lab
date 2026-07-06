"use client";

/**
 * Renders any data-driven challenge spec from the generic engine.
 * One component per mechanic; all copy passes through fillSlots so
 * creators' mad-lib customizations appear everywhere.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LabIcon } from "@/components/LabIcon";
import { fillSlots } from "@/lib/challenge";
import type {
  ChoiceChallenge,
  ChoiceOption,
  DualScaleChallenge,
  GenericAnswer,
  GenericChallenge,
  NumericChallenge,
  PlanningChallenge,
  ScaleChallenge,
  TwoRoundChallenge,
  VariantChoiceChallenge,
} from "@/lib/challenge";
import { cn } from "@/lib/utils";

type Submit = (answer: GenericAnswer) => void;

interface Props {
  challenge: GenericChallenge;
  slots: Record<string, string>;
  onSubmit: Submit;
}

export function GenericChallengeView({ challenge, slots, onSubmit }: Props) {
  switch (challenge.mechanic) {
    case "choice":
      return <ChoiceView c={challenge} slots={slots} onSubmit={onSubmit} />;
    case "variant-choice":
      return <VariantChoiceView c={challenge} slots={slots} onSubmit={onSubmit} />;
    case "two-round":
      return <TwoRoundView c={challenge} slots={slots} onSubmit={onSubmit} />;
    case "numeric":
      return <NumericView c={challenge} slots={slots} onSubmit={onSubmit} />;
    case "scale":
      return <ScaleView c={challenge} slots={slots} onSubmit={onSubmit} />;
    case "dual-scale":
      return <DualScaleView c={challenge} slots={slots} onSubmit={onSubmit} />;
    case "planning":
      return <PlanningView c={challenge} slots={slots} onSubmit={onSubmit} />;
  }
}

/* ---------- shared bits ---------- */

function Chip({ icon, text }: { icon: Parameters<typeof LabIcon>[0]["name"]; text: string }) {
  return (
    <div className="chip">
      <LabIcon name={icon} className="h-3.5 w-3.5 text-teal" />
      {text}
    </div>
  );
}

function Lock({ disabled, onClick, label }: { disabled: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" className="btn-primary mt-5 w-full" disabled={disabled} onClick={onClick}>
      {label ?? "Lock it in"}
    </button>
  );
}

function Bar({ width, className }: { width: number; className?: string }) {
  return (
    <span className="block h-2.5 w-full max-w-56 overflow-hidden rounded-full bg-white/10">
      <span
        className={cn("block h-full rounded-full", className ?? "bg-fog")}
        style={{ width: `${width}%` }}
      />
    </span>
  );
}

function OptionRow({
  option,
  slots,
  selected,
  onClick,
}: {
  option: ChoiceOption;
  slots: Record<string, string>;
  selected: boolean;
  onClick: () => void;
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
          : "hover:border-white/25 hover:bg-white/[0.07]"
      )}
    >
      <span className="flex items-center gap-2.5">
        {option.icon && <LabIcon name={option.icon} className="h-5 w-5 text-teal" />}
        <span className="flex-1 font-medium">{fillSlots(option.label, slots)}</span>
      </span>
      {option.sub && <span className="mt-0.5 block text-sm text-fog">{fillSlots(option.sub, slots)}</span>}
      {option.barWidth !== undefined && (
        <span className="mt-2 block">
          <Bar width={option.barWidth} />
        </span>
      )}
    </button>
  );
}

function SliderBlock({
  id,
  min,
  max,
  minLabel,
  maxLabel,
  value,
  onChange,
  label,
}: {
  id: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className="label">
        {label} <span className="text-frost">{value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
      <div className="flex justify-between font-mono text-[10px] text-fog/70">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/* ---------- choice ---------- */

function ChoiceBody({
  c,
  slots,
  story,
  options,
  question,
  variant,
  onSubmit,
}: {
  c: ChoiceChallenge | VariantChoiceChallenge;
  slots: Record<string, string>;
  story: string;
  options: ChoiceOption[];
  question: string;
  variant?: string;
  onSubmit: Submit;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const banner = "banner" in c ? c.banner : undefined;
  const targetBar = "targetBar" in c ? c.targetBar : undefined;
  return (
    <div className="glass p-6">
      <Chip icon={c.chipIcon} text={c.chip} />
      {story && <p className="mt-3 text-[15px] leading-relaxed text-frost">{fillSlots(story, slots)}</p>}
      {targetBar !== undefined && (
        <div className="mt-4 rounded-xl border border-white/10 bg-ink/60 p-4">
          <span className="label">target</span>
          <Bar width={targetBar} className="bg-gradient-to-r from-teal to-grape" />
        </div>
      )}
      {banner && (
        <p className="mt-3 rounded-xl border border-grape/40 bg-grape/10 px-4 py-2.5 text-sm text-frost">
          {fillSlots(banner, slots)}
        </p>
      )}
      <h2 className="mt-4 text-xl font-bold">{fillSlots(question, slots)}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {options.map((o) => (
          <OptionRow key={o.id} option={o} slots={slots} selected={choice === o.id} onClick={() => setChoice(o.id)} />
        ))}
      </div>
      <Lock
        disabled={!choice}
        onClick={() => choice && onSubmit({ kind: "choice", choice, variant })}
        label={c.lockLabel}
      />
    </div>
  );
}

function ChoiceView({ c, slots, onSubmit }: { c: ChoiceChallenge; slots: Record<string, string>; onSubmit: Submit }) {
  return (
    <ChoiceBody c={c} slots={slots} story={c.story ?? ""} options={c.options} question={c.question} onSubmit={onSubmit} />
  );
}

function VariantChoiceView({
  c,
  slots,
  onSubmit,
}: {
  c: VariantChoiceChallenge;
  slots: Record<string, string>;
  onSubmit: Submit;
}) {
  const [variant] = useState(() => {
    const keys = Object.keys(c.variants);
    return keys[Math.floor(Math.random() * keys.length)];
  });
  const v = c.variants[variant];
  return (
    <ChoiceBody
      c={c}
      slots={slots}
      story={v.story}
      options={v.options}
      question={v.question}
      variant={variant}
      onSubmit={onSubmit}
    />
  );
}

/* ---------- two-round ---------- */

function TwoRoundView({ c, slots, onSubmit }: { c: TwoRoundChallenge; slots: Record<string, string>; onSubmit: Submit }) {
  const [round, setRound] = useState<0 | 1>(0);
  const [r1, setR1] = useState<string | null>(null);
  const current = c.rounds[round];

  function pick(id: string) {
    if (round === 0) {
      setR1(id);
      setTimeout(() => setRound(1), 350);
    } else if (r1) {
      onSubmit({ kind: "two-round", r1, r2: id });
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
        <div className="chip">
          <LabIcon name={c.chipIcon} className="h-3.5 w-3.5 text-teal" />
          {round + 1}/2 · trust your gut
        </div>
        <h2 className="mt-3 text-xl font-bold">{fillSlots(current.title, slots)}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-fog">{fillSlots(current.story, slots)}</p>
        <div className="mt-5 flex flex-col gap-3">
          {current.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => pick(o.id)}
              className="glass w-full px-4 py-4 text-left text-[15px] leading-snug transition-all hover:border-white/25 hover:bg-white/[0.07]"
            >
              {fillSlots(o.label, slots)}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- numeric ---------- */

function NumericView({ c, slots, onSubmit }: { c: NumericChallenge; slots: Record<string, string>; onSubmit: Submit }) {
  const [variant] = useState<string | undefined>(() => {
    if (!c.variants) return undefined;
    const keys = Object.keys(c.variants);
    return keys[Math.floor(Math.random() * keys.length)];
  });
  const [raw, setRaw] = useState("");
  const story = (variant && c.variants?.[variant]?.story) || c.story || "";
  const question = (variant && c.variants?.[variant]?.question) || c.question;
  const cleaned = raw.replace(/[^\d.]/g, "");
  const parsed = c.allowDecimal ? parseFloat(cleaned) : parseInt(cleaned, 10);
  const valid = Number.isFinite(parsed) && parsed >= c.min && parsed <= c.max;

  return (
    <div className="glass p-6">
      <Chip icon={c.chipIcon} text={c.chip} />
      {story && <p className="mt-3 text-[15px] leading-relaxed text-frost">{fillSlots(story, slots)}</p>}
      <h2 className="mt-4 text-xl font-bold">{fillSlots(question, slots)}</h2>
      <div className="mt-4 flex items-center gap-2">
        {c.unit === "$" && <span className="text-xl font-bold text-fog">$</span>}
        <input
          inputMode={c.allowDecimal ? "decimal" : "numeric"}
          placeholder={c.placeholder}
          className="input text-center text-xl font-bold tabular-nums"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          aria-label={fillSlots(question, slots)}
          autoFocus
        />
        {c.unit === "%" && <span className="text-xl font-bold text-fog">%</span>}
      </div>
      <Lock disabled={!valid} onClick={() => valid && onSubmit({ kind: "numeric", value: parsed, variant })} />
      <p className="mt-3 text-center font-mono text-xs text-fog/70">don't overthink it</p>
    </div>
  );
}

/* ---------- scale ---------- */

function ScaleView({ c, slots, onSubmit }: { c: ScaleChallenge; slots: Record<string, string>; onSubmit: Submit }) {
  const [variant] = useState<string | undefined>(() => {
    if (!c.variants) return undefined;
    const keys = Object.keys(c.variants);
    return keys[Math.floor(Math.random() * keys.length)];
  });
  const mid = Math.round((c.min + c.max) / 2);
  const [rating, setRating] = useState(mid);
  const story = (variant && c.variants?.[variant]?.story) || c.story;

  return (
    <div className="glass p-6">
      <Chip icon={c.chipIcon} text={c.chip} />
      {story && <p className="mt-3 text-[15px] leading-relaxed text-frost">{fillSlots(story, slots)}</p>}
      {c.statements && (
        <ul className="mt-4 space-y-2 rounded-xl border border-grape/30 bg-ink/60 p-4">
          {c.statements.map((s) => (
            <li key={s} className="flex gap-2 text-sm leading-snug text-frost">
              <LabIcon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-grape" />
              {fillSlots(s, slots)}
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-4 text-lg font-bold">{fillSlots(c.question, slots)}</h2>
      <SliderBlock
        id="scale-rating"
        min={c.min}
        max={c.max}
        minLabel={c.minLabel}
        maxLabel={c.maxLabel}
        value={rating}
        onChange={setRating}
        label="Your rating:"
      />
      <Lock disabled={false} onClick={() => onSubmit({ kind: "scale", rating, variant })} />
    </div>
  );
}

/* ---------- dual scale ---------- */

function DualScaleView({ c, slots, onSubmit }: { c: DualScaleChallenge; slots: Record<string, string>; onSubmit: Submit }) {
  const [phase, setPhase] = useState<0 | 1>(0);
  const mid = Math.round((c.min + c.max) / 2);
  const [rating, setRating] = useState(mid);
  const [rating1, setRating1] = useState<number | null>(null);
  const round = phase === 0 ? c.round1 : c.round2;

  function next() {
    if (phase === 0) {
      setRating1(rating);
      setRating(mid);
      setPhase(1);
    } else if (rating1 !== null) {
      onSubmit({ kind: "dual-scale", rating1, rating2: rating });
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.25 }}
        className="glass p-6"
      >
        <div className="chip">
          <LabIcon name={c.chipIcon} className="h-3.5 w-3.5 text-teal" />
          {phase + 1}/2 · {fillSlots(round.title, slots)}
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-frost">{fillSlots(round.story, slots)}</p>
        <SliderBlock
          id={`dual-${phase}`}
          min={c.min}
          max={c.max}
          minLabel={c.minLabel}
          maxLabel={c.maxLabel}
          value={rating}
          onChange={setRating}
          label={fillSlots(c.question, slots)}
        />
        <Lock disabled={false} onClick={next} label={phase === 0 ? "Next" : "Lock it in"} />
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- planning ---------- */

function PlanningView({ c, slots, onSubmit }: { c: PlanningChallenge; slots: Record<string, string>; onSubmit: Submit }) {
  const [phase, setPhase] = useState<0 | 1>(0);
  const [estimateRaw, setEstimateRaw] = useState("");
  const [countRaw, setCountRaw] = useState("");
  const estimate = parseInt(estimateRaw.replace(/[^\d]/g, ""), 10);
  const estimateValid = Number.isFinite(estimate) && estimate >= 3 && estimate <= 3600;
  const count = parseInt(countRaw.replace(/[^\d]/g, ""), 10);
  const countValid = Number.isFinite(count) && count >= 0 && count <= 999;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.25 }}
        className="glass p-6"
      >
        <div className="chip">
          <LabIcon name={c.chipIcon} className="h-3.5 w-3.5 text-teal" />
          {phase === 0 ? "step 1 · the estimate" : "step 2 · the task (clock running)"}
        </div>
        {phase === 0 ? (
          <>
            <p className="mt-3 text-[15px] leading-relaxed text-frost">{fillSlots(c.estimatePrompt, slots)}</p>
            <label htmlFor="plan-est" className="label mt-4">
              Your estimate, in seconds
            </label>
            <input
              id="plan-est"
              inputMode="numeric"
              placeholder="e.g. 30"
              className="input text-center text-xl font-bold tabular-nums"
              value={estimateRaw}
              onChange={(e) => setEstimateRaw(e.target.value)}
              autoFocus
            />
            <Lock disabled={!estimateValid} onClick={() => setPhase(1)} label="Start the clock" />
          </>
        ) : (
          <>
            <blockquote className="mt-3 rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-[15px] leading-relaxed text-frost">
              “{c.taskSentence}”
            </blockquote>
            <h2 className="mt-4 text-lg font-bold">{fillSlots(c.taskQuestion, slots)}</h2>
            <input
              inputMode="numeric"
              placeholder="count"
              className="input mt-3 text-center text-xl font-bold tabular-nums"
              value={countRaw}
              onChange={(e) => setCountRaw(e.target.value)}
              aria-label={fillSlots(c.taskQuestion, slots)}
              autoFocus
            />
            <Lock
              disabled={!countValid || !estimateValid}
              onClick={() =>
                countValid &&
                estimateValid &&
                onSubmit({ kind: "planning", estimateSeconds: estimate, countAnswer: count })
              }
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
