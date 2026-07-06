"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DangerMeter } from "@/components/DangerMeter";
import { InviteCard } from "@/components/InviteCard";
import { LabIcon } from "@/components/LabIcon";
import { SharePanel } from "@/components/SharePanel";
import { getSessionId } from "@/lib/client-session";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  THEME_LIST,
  TONE_LIST,
  TRAP_LIST,
  TRAPS,
} from "@/lib/traps";
import { cn } from "@/lib/utils";
import type { Theme, Tone, TrapType } from "@/types";

const NAME_MAX = 40;
const MESSAGE_MAX = 180;

type Step = "pick" | "customize" | "share";

interface CreatedTrap {
  trapId: string;
  url: string;
  shareText: string;
}

export function TrapCreator() {
  const params = useSearchParams();
  const prefillType = params.get("type") as TrapType | null;
  const isRevenge = params.get("revenge") === "1";

  const [step, setStep] = useState<Step>(
    prefillType && TRAPS[prefillType] ? "customize" : "pick"
  );
  const [trapType, setTrapType] = useState<TrapType>(
    prefillType && TRAPS[prefillType] ? prefillType : "anchor"
  );
  const [creatorName, setCreatorName] = useState(params.get("me") ?? "");
  const [friendName, setFriendName] = useState(params.get("vs") ?? "");
  const [tone, setTone] = useState<Tone>(isRevenge ? "spicy" : "spicy");
  const [theme, setTheme] = useState<Theme>("clean-lab");
  const [customMessage, setCustomMessage] = useState("");
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedTrap | null>(null);

  const template = TRAPS[trapType];

  const utm = useMemo(() => {
    const u: Record<string, string> = {};
    for (const k of ["source", "medium", "campaign"] as const) {
      const v = params.get(`utm_${k}`);
      if (v) u[k] = v.slice(0, 64);
    }
    return u;
  }, [params]);

  async function create() {
    if (creating) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/traps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName,
          friendName,
          trapType,
          tone,
          theme,
          customMessage,
          slots: slotValues,
          creatorSessionId: getSessionId(),
          source: isRevenge ? "revenge" : "direct",
          utm,
        }),
      });
      const data = (await res.json()) as CreatedTrap & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Trap creation failed.");
      setCreated(data);
      setStep("share");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trap creation failed.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      {isRevenge && step !== "share" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-punch/40 bg-punch/10 px-4 py-3 text-sm text-frost">
          <LabIcon name="flame" className="h-5 w-5 shrink-0 text-punch" />
          <span>
            <span className="font-semibold">Revenge mode.</span> They trapped
            you. Statistics demand a response.
          </span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Choose your trap</h1>
            <p className="mt-2 text-fog">
              Thirty lab-grade brain traps, each built on peer-reviewed
              research. Pick the one your friend deserves.
            </p>
            {CATEGORY_ORDER.map((cat) => (
              <section key={cat} className="mt-8" aria-label={CATEGORY_META[cat].label}>
                <div className="flex items-baseline gap-3">
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                    {CATEGORY_META[cat].label}
                  </h2>
                  <span className="text-xs text-fog/70">{CATEGORY_META[cat].blurb}</span>
                </div>
                <div className="mt-3 grid gap-3">
                  {TRAP_LIST.filter((t) => t.category === cat).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTrapType(t.id);
                        setSlotValues({});
                        setStep("customize");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="glass group flex items-start gap-4 p-5 text-left transition-all hover:border-teal/50 hover:bg-white/[0.07]"
                    >
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink/60 text-teal">
                        <LabIcon name={t.icon} className="h-6 w-6" />
                      </span>
                      <span className="flex-1">
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-bold">{t.labName}</span>
                          <DangerMeter level={t.difficulty} />
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-fog">
                          {t.shortDescription}
                        </span>
                        <span className="mt-1.5 block font-mono text-[11px] uppercase tracking-widest text-fog/60">
                          disguised as “{t.publicTitle}” · ~{t.estimatedTimeSeconds}s
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        )}

        {step === "customize" && (
          <motion.div
            key="customize"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep("pick")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-fog hover:text-frost"
            >
              <LabIcon name="arrowLeft" /> All traps
            </button>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <LabIcon name={template.icon} className="h-8 w-8 text-teal" />
              {template.labName}
            </h1>
            <p className="mt-1 text-fog">{template.shortDescription}</p>

            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="creator" className="label">
                    Your name
                  </label>
                  <input
                    id="creator"
                    className="input"
                    placeholder="Dr. You"
                    maxLength={NAME_MAX}
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="friend" className="label">
                    Their name
                  </label>
                  <input
                    id="friend"
                    className="input"
                    placeholder="The victim"
                    maxLength={NAME_MAX}
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="taunt" className="label">
                  Custom taunt <span className="text-fog/60">(optional)</span>
                  <span className="float-right tabular-nums">
                    {customMessage.length}/{MESSAGE_MAX}
                  </span>
                </label>
                <textarea
                  id="taunt"
                  className="input min-h-20 resize-y"
                  placeholder={`e.g. "You said you're immune to this stuff. Prove it."`}
                  maxLength={MESSAGE_MAX}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>

              {template.slots && template.slots.length > 0 && (
                <fieldset className="glass !rounded-xl p-4">
                  <legend className="label px-1">
                    Mad-lib the scenario <span className="text-fog/60">(optional)</span>
                  </legend>
                  <p className="-mt-0.5 mb-3 text-xs text-fog">
                    Make it ridiculous. The science underneath stays intact —
                    only the flavor is yours.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {template.slots.map((slot) => (
                      <div key={slot.id}>
                        <label htmlFor={`slot-${slot.id}`} className="label">
                          {slot.label}
                        </label>
                        <input
                          id={`slot-${slot.id}`}
                          className="input !py-2.5 text-sm"
                          placeholder={slot.defaultValue}
                          maxLength={slot.maxLen ?? 40}
                          value={slotValues[slot.id] ?? ""}
                          onChange={(e) =>
                            setSlotValues((prev) => ({ ...prev, [slot.id]: e.target.value }))
                          }
                        />
                        {slot.hint && (
                          <p className="mt-1 text-[11px] text-fog/60">{slot.hint}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </fieldset>
              )}

              <fieldset>
                <legend className="label">Tone</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TONE_LIST.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={tone === t.id}
                      onClick={() => setTone(t.id)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all",
                        tone === t.id
                          ? "border-teal/70 bg-teal/10 text-teal"
                          : "border-white/12 bg-white/[0.04] text-fog hover:text-frost"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-fog">{TONE_LIST.find((t) => t.id === tone)?.blurb}</p>
              </fieldset>

              <fieldset>
                <legend className="label">Card style</legend>
                <div className="grid grid-cols-3 gap-2">
                  {THEME_LIST.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={theme === t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all",
                        theme === t.id
                          ? "border-teal/70 bg-teal/10 text-frost"
                          : "border-white/12 bg-white/[0.04] text-fog hover:text-frost"
                      )}
                    >
                      <LabIcon
                        name={t.icon}
                        className={cn("h-5 w-5", theme === t.id ? "text-teal" : "text-fog")}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <span className="label">What they'll see</span>
                <InviteCard
                  creatorName={creatorName}
                  friendName={friendName}
                  trapType={trapType}
                  tone={tone}
                  theme={theme}
                  customMessage={customMessage}
                />
              </div>

              {error && (
                <p className="rounded-xl border border-punch/40 bg-punch/10 px-4 py-3 text-sm text-frost" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={create}
                disabled={creating}
                className="btn-primary w-full text-lg"
              >
                <LabIcon name="bolt" className="h-5 w-5" />
                {creating ? "Arming…" : "Arm this trap"}
              </button>
              <p className="text-center font-mono text-xs text-fog/70">
                the science stays intact — only the flavor is yours
              </p>
            </div>
          </motion.div>
        )}

        {step === "share" && created && (
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="text-center">
              <div className="chip mx-auto">
                <LabIcon name="check" className="h-3.5 w-3.5 text-teal" />
                trap armed · awaiting subject
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight">
                Bait deployed.
              </h1>
              <p className="mt-2 text-fog">
                Send this link to {friendName || "your target"}. Then act
                natural.
              </p>
            </div>

            <div className="mt-6">
              <InviteCard
                creatorName={creatorName}
                friendName={friendName}
                trapType={trapType}
                tone={tone}
                theme={theme}
                customMessage={customMessage}
              />
            </div>

            <div className="glass mt-4 p-4">
              <p className="break-all rounded-lg bg-ink/60 px-3 py-2.5 font-mono text-sm text-teal">
                {created.url}
              </p>
              <div className="mt-3">
                <SharePanel
                  url={created.url}
                  text={created.shareText}
                  copyTextLabel="Copy taunt text"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={created.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Preview what they'll see
                <LabIcon name="externalLink" />
              </a>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setCreated(null);
                  setStep("pick");
                  setCustomMessage("");
                  window.scrollTo({ top: 0 });
                }}
              >
                Arm another trap
              </button>
              <Link href="/stats" className="btn-ghost">
                Watch the stats roll in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
