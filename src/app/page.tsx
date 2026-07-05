import Link from "next/link";
import { DangerMeter } from "@/components/DangerMeter";
import { EmailCTA } from "@/components/EmailCTA";
import { InviteCard } from "@/components/InviteCard";
import { LabIcon } from "@/components/LabIcon";
import { StatsPreview } from "@/components/StatsPreview";
import { getTrapOfTheDay, TRAP_LIST } from "@/lib/traps";
import type { IconName } from "@/lib/icons";

const STEPS: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "trap",
    title: "Arm it",
    text: "Pick a science-backed brain trap, add your name, their name, and a taunt.",
  },
  {
    icon: "send",
    title: "Send it",
    text: "One link. They tap it, take a 20-second challenge, no signup.",
  },
  {
    icon: "microscope",
    title: "The reveal",
    text: "Trapped or escaped — plus the real science, a citation, and a roast.",
  },
  {
    icon: "flame",
    title: "The revenge",
    text: "They trap you back. Science wins either way.",
  },
];

export default function HomePage() {
  const featured = getTrapOfTheDay();

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <div className="chip">
            <LabIcon name="flask" className="h-3.5 w-3.5 text-teal" />a
            Distilled Science experiment
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Send your friend a{" "}
            <span className="bg-gradient-to-r from-teal via-grape to-punch bg-clip-text text-transparent">
              tiny brain trap
            </span>
            .
          </h1>
          <p className="mt-5 max-w-md text-lg text-fog">
            If they fall for it, science gets a point. If they escape, they get
            revenge. Either way, somebody learns how their brain actually
            works.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/make" className="btn-primary text-lg sm:flex-none">
              <LabIcon name="trap" className="h-5 w-5" />
              Arm a trap
            </Link>
            <Link href="/t/demo" className="btn-ghost text-lg sm:flex-none">
              Try one on yourself
            </Link>
          </div>
          <p className="mt-4 font-mono text-xs text-fog/70">
            no accounts · no downloads · takes 30 seconds
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-teal/10 via-grape/10 to-punch/10 blur-2xl" />
          <div className="animate-float">
            <InviteCard
              creatorName="Avisha"
              friendName="you"
              trapType="anchor"
              tone="spicy"
              theme="neon-trap"
              customMessage="You watch three science channels. Surely YOU can't be fooled by one suspicious number."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10" aria-labelledby="how-title">
        <h2 id="how-title" className="text-2xl font-bold tracking-tight">
          How the loop works
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="glass p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-ink/60 text-teal">
                  <LabIcon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-fog/60">0{i + 1}</span>
              </div>
              <h3 className="mt-3 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-snug text-fog">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trap menu */}
      <section className="py-10" aria-labelledby="menu-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="menu-title" className="text-2xl font-bold tracking-tight">
            The trap menu
          </h2>
          <span className="chip">
            <LabIcon name="star" className="h-3.5 w-3.5 text-punch" />
            today's featured menace: {featured.labName}
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {TRAP_LIST.map((t) => (
            <Link
              key={t.id}
              href={`/make?type=${t.id}`}
              className="glass group flex items-start gap-4 p-5 transition-all hover:border-teal/50 hover:bg-white/[0.07]"
            >
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink/60 text-teal">
                <LabIcon name={t.icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold group-hover:text-teal">{t.labName}</span>
                  <DangerMeter level={t.difficulty} />
                </span>
                <span className="mt-1 block text-sm leading-snug text-fog">
                  {t.shortDescription}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Live stats */}
      <section className="py-10" aria-labelledby="stats-title">
        <h2 id="stats-title" className="text-2xl font-bold tracking-tight">
          The lab, live
        </h2>
        <div className="mt-6">
          <StatsPreview />
        </div>
      </section>

      {/* Email */}
      <section className="py-10" id="lab-notes">
        <EmailCTA source="homepage" showTransparency />
      </section>
    </div>
  );
}
