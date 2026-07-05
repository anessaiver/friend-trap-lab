import { LabIcon } from "@/components/LabIcon";
import { THEMES, TONES, TRAPS } from "@/lib/traps";
import { fillTemplate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Theme, Tone, TrapType } from "@/types";

interface InviteCardProps {
  creatorName: string;
  friendName: string;
  trapType: TrapType;
  tone: Tone;
  theme: Theme;
  customMessage?: string;
  className?: string;
}

/**
 * The shareable invite card — shown in the creator preview and at the top of
 * the trap-taking page. Pre-reveal safe: never names the principle.
 */
export function InviteCard({
  creatorName,
  friendName,
  trapType,
  tone,
  theme,
  customMessage,
  className,
}: InviteCardProps) {
  const template = TRAPS[trapType];
  const themeCfg = THEMES[theme];
  const toneCfg = TONES[tone];
  const creator = creatorName || "Someone suspiciously confident";
  const friend = friendName || "you";

  return (
    <div className={cn("glass relative overflow-hidden border p-6", themeCfg.cardClass, className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="chip">
          <LabIcon name={themeCfg.icon} className={cn("h-3.5 w-3.5", themeCfg.accentClass)} />
          trap armed
        </span>
        <span className={cn("font-mono text-xs tracking-widest", themeCfg.accentClass)}>
          #{template.id.toUpperCase()}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-bold leading-snug tracking-tight">
        {fillTemplate(toneCfg.introLine, { creator })}
      </h2>
      <p className="mt-2 text-sm text-fog">
        <span className="inline-flex items-center gap-1.5 align-middle">
          <LabIcon name={template.icon} className={cn("h-4 w-4", themeCfg.accentClass)} />
          {template.publicTitle}
        </span>{" "}
        · ~{template.estimatedTimeSeconds}s · addressed to{" "}
        <span className="text-frost">{friend}</span>
      </p>
      {customMessage ? (
        <blockquote className="mt-4 rounded-xl border border-white/10 bg-ink/50 px-4 py-3 text-[15px] italic text-frost">
          “{customMessage}”
          <footer className="mt-1 not-italic">
            <span className="font-mono text-[11px] uppercase tracking-widest text-fog">
              — {creator}
            </span>
          </footer>
        </blockquote>
      ) : (
        <blockquote className="mt-4 rounded-xl border border-white/10 bg-ink/50 px-4 py-3 text-[15px] italic text-fog">
          “{toneCfg.defaultTaunt}”
        </blockquote>
      )}
    </div>
  );
}
