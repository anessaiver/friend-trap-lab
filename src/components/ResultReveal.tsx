"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LabIcon } from "@/components/LabIcon";
import { SharePanel } from "@/components/SharePanel";
import { RESULT_META, TRAPS } from "@/lib/traps";
import { resultShareText, resultSignatureText } from "@/lib/share";
import { cn, percent } from "@/lib/utils";
import type { IconName } from "@/lib/icons";
import type { ResultType, TrapType } from "@/types";

export interface ResultRevealProps {
  attemptId: string;
  trapType: TrapType;
  resultType: ResultType;
  creatorName: string;
  friendName: string;
  roastLine: string;
  detailLine: string;
  aggregate: { attempts: number; trapped: number };
  anchorAgg: {
    high: { count: number; mean: number | null };
    low: { count: number; mean: number | null };
  } | null;
  shareUrl: string;
  isDemo: boolean;
}

/**
 * The visual result signature — a tiny lab report stamp:
 * brain → trap type → outcome → flask.
 */
function ResultSignature({
  trapType,
  escaped,
}: {
  trapType: TrapType;
  escaped: boolean;
}) {
  const tiles: Array<{ name: IconName; className: string }> = [
    { name: "brain", className: "text-fog border-white/15" },
    { name: TRAPS[trapType].icon, className: "text-grape border-grape/40" },
    escaped
      ? { name: "check", className: "text-teal border-teal/40" }
      : { name: "warning", className: "text-punch border-punch/40" },
    { name: "flask", className: "text-teal border-teal/40" },
  ];
  return (
    <span
      className="inline-flex items-center gap-1.5"
      role="img"
      aria-label={`Lab result: brain ${escaped ? "escaped" : "trapped"}`}
    >
      {tiles.map((t, i) => (
        <span
          key={i}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border bg-ink/60",
            t.className
          )}
        >
          <LabIcon name={t.name} className="h-4.5 w-4.5" />
        </span>
      ))}
    </span>
  );
}

export function ResultReveal(props: ResultRevealProps) {
  const meta = RESULT_META[props.resultType];
  const template = TRAPS[props.trapType];
  const reduceMotion = useReducedMotion();
  const creator = props.creatorName || "your friend";
  const friend = props.friendName || "The subject";

  const shareText = resultShareText({
    resultType: props.resultType,
    trapType: props.trapType,
    creatorName: props.creatorName,
    url: props.shareUrl,
  });

  const revengeParams = new URLSearchParams({
    type: props.trapType,
    revenge: "1",
    ...(props.creatorName ? { vs: props.creatorName } : {}),
    ...(props.friendName ? { me: props.friendName } : {}),
  });

  const stagger = (i: number) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.55 + i * 0.28, duration: 0.4 },
        };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      {/* The stamp */}
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 2.2, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className={cn(
          "mx-auto w-fit rounded-2xl border-4 px-6 py-3 text-center",
          meta.borderClass
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 text-3xl font-black tracking-[0.08em] sm:text-4xl",
            meta.colorClass
          )}
        >
          <LabIcon name={meta.icon} className="h-9 w-9 sm:h-10 sm:w-10" />
          {meta.title}
        </div>
      </motion.div>

      <motion.p {...stagger(0)} className="mt-5 text-center text-lg text-frost">
        <span className="font-semibold">{friend}</span>{" "}
        {meta.escaped ? "escaped" : "walked into"}{" "}
        <span className="text-teal">{template.labName}</span> — armed by{" "}
        <span className="font-semibold">{creator}</span>.
      </motion.p>
      <motion.p {...stagger(0)} className="mt-1 text-center text-sm text-fog">
        {meta.vibe}
      </motion.p>

      {/* Roast / praise */}
      <motion.div {...stagger(1)} className="glass mt-8 p-6">
        <p className="text-lg font-semibold leading-snug">“{props.roastLine}”</p>
        <p className="mt-3 text-sm leading-relaxed text-fog">{props.detailLine}</p>
      </motion.div>

      {/* The science */}
      <motion.div {...stagger(2)} className="glass mt-4 p-6">
        <div className="chip">
          <LabIcon name="microscope" className="h-3.5 w-3.5 text-teal" />
          what just happened
        </div>
        <h2 className="mt-3 text-xl font-bold">
          {template.principleName}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-fog">
          {template.principleExplanation}
        </p>
        <p className="mt-4 border-l-2 border-teal/50 pl-3 font-mono text-xs leading-relaxed text-fog/80">
          {template.citation.url ? (
            <a
              href={template.citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal hover:underline"
            >
              {template.citation.text}
            </a>
          ) : (
            template.citation.text
          )}
        </p>
      </motion.div>

      {/* Trap danger stats */}
      <motion.div {...stagger(3)} className="glass mt-4 p-6">
        <div className="chip">
          <LabIcon name="stats" className="h-3.5 w-3.5 text-grape" />
          this trap's record
        </div>
        {props.aggregate.attempts >= 5 ? (
          <>
            <p className="mt-3 text-[15px] text-frost">
              <span className="text-2xl font-bold text-punch">
                {percent(props.aggregate.trapped, props.aggregate.attempts)}%
              </span>{" "}
              of {props.aggregate.attempts} subjects walked into this one.
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-grape to-punch"
                style={{ width: `${percent(props.aggregate.trapped, props.aggregate.attempts)}%` }}
              />
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-fog">
            Sample size so far: {props.aggregate.attempts || "just you"}. A
            statistician is watching us with one eyebrow raised.
          </p>
        )}
        {props.anchorAgg?.high.mean && props.anchorAgg?.low.mean && (
          <div className="mt-4 rounded-xl border border-white/10 bg-ink/50 p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-fog">
              the anchor, live and in public
            </p>
            <p className="mt-2 text-sm text-frost">
              Subjects who saw <span className="font-mono text-grape">8,742</span> guess{" "}
              <span className="font-bold">{props.anchorAgg.high.mean.toLocaleString()}</span> on
              average. Those who saw <span className="font-mono text-grape">141</span> guess{" "}
              <span className="font-bold">{props.anchorAgg.low.mean.toLocaleString()}</span>. Same
              jar.
            </p>
          </div>
        )}
      </motion.div>

      {/* Share */}
      <motion.div {...stagger(4)} className="glass mt-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="chip">
            <LabIcon name="share" className="h-3.5 w-3.5 text-teal" />
            publish the evidence
          </div>
          <ResultSignature trapType={props.trapType} escaped={meta.escaped} />
        </div>
        <p className="mt-3 rounded-lg bg-ink/60 px-3 py-2 font-mono text-[11px] tracking-wide text-fog">
          {resultSignatureText(props.resultType, props.trapType)}
        </p>
        <div className="mt-4">
          <SharePanel url={props.shareUrl} text={shareText} />
        </div>
      </motion.div>

      {/* Revenge */}
      <motion.div {...stagger(5)} className="mt-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-fog">
          {meta.escaped ? "you know what comes next" : "there is only one correct response"}
        </p>
        <Link
          href={`/make?${revengeParams.toString()}`}
          className="btn-punch mt-3 w-full text-lg"
        >
          <LabIcon name="trap" className="h-5 w-5" />
          {props.isDemo ? "Trap a real friend" : `Trap ${creator} back`}
        </Link>
        <Link href="/make" className="btn-ghost mt-2.5 w-full">
          Or arm a different trap
        </Link>
      </motion.div>
    </div>
  );
}
