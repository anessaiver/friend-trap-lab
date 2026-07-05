import type { Metadata } from "next";
import Link from "next/link";
import { EmailCTA } from "@/components/EmailCTA";
import { hasRedisConfig } from "@/lib/env";
import { getPublicStats } from "@/lib/stats";
import { getTrapOfTheDay, TRAPS } from "@/lib/traps";
import type { PublicStats } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab stats",
  description:
    "Live, anonymous aggregate data from the Friend Trap Lab: which traps catch the most brains, escape rates, and today's featured menace.",
};

export default async function StatsPage() {
  let stats: PublicStats | null = null;
  if (hasRedisConfig()) {
    try {
      stats = await getPublicStats();
    } catch {
      stats = null;
    }
  }
  const featured = getTrapOfTheDay();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="chip">📊 anonymous · aggregate · live</div>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Lab stats</h1>
      <p className="mt-2 text-fog">
        Every number below is real, counted from actual trap attempts. No
        names, no individuals — just brains versus science.
      </p>

      {!stats ? (
        <div className="glass mt-8 p-8 text-center">
          <p className="text-lg font-semibold">The stats board is warming up.</p>
          <p className="mt-2 text-sm text-fog">
            Either the lab just opened or the database is having a moment. Try
            again shortly.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Traps armed", value: stats.trapsCreated },
              { label: "Lab subjects", value: stats.attempts },
              { label: "Trapped", value: stats.trapped },
              { label: "Escaped", value: stats.escaped },
            ].map((s) => (
              <div key={s.label} className="glass p-5">
                <div className="text-3xl font-bold tabular-nums">
                  {s.value.toLocaleString()}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="glass p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                Global trap rate
              </div>
              <div className="mt-1 text-2xl font-bold text-punch">
                {stats.attempts >= 10
                  ? `${Math.round((stats.trapped / Math.max(1, stats.attempts)) * 100)}%`
                  : "—"}
              </div>
              {stats.attempts < 10 && (
                <p className="text-xs text-fog">needs ≥10 subjects</p>
              )}
            </div>
            <div className="glass p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                Revenge traps armed
              </div>
              <div className="mt-1 text-2xl font-bold text-grape">
                {stats.revengeTraps.toLocaleString()}
              </div>
            </div>
            <div className="glass p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                Median vibe today
              </div>
              <div className="mt-1 text-2xl font-bold">
                {stats.todayAttempts > 0 ? "🧠💥" : "🧪"}
              </div>
              <p className="text-xs text-fog">
                {stats.todayTraps} traps · {stats.todayAttempts} attempts today
              </p>
            </div>
          </div>

          {stats.smallSample && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
              ⚠️ The sample size is currently tiny. A statistician is watching
              us with one eyebrow raised. Percentages unlock as subjects
              accumulate.
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {stats.mostDangerous && (
              <div className="glass flex-1 border-punch/30 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-punch">
                  ☠️ most dangerous trap
                </div>
                <div className="mt-1 font-bold">
                  {TRAPS[stats.mostDangerous.trapType].emoji}{" "}
                  {TRAPS[stats.mostDangerous.trapType].labName}
                </div>
                <p className="text-sm text-fog">
                  {Math.round(
                    (stats.mostDangerous.trapped / Math.max(1, stats.mostDangerous.attempts)) * 100
                  )}
                  % of subjects walked in
                </p>
              </div>
            )}
            {stats.mostEscaped && (
              <div className="glass flex-1 border-teal/30 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-teal">
                  🔓 most escaped trap
                </div>
                <div className="mt-1 font-bold">
                  {TRAPS[stats.mostEscaped.trapType].emoji}{" "}
                  {TRAPS[stats.mostEscaped.trapType].labName}
                </div>
                <p className="text-sm text-fog">
                  humans keep beating this one
                </p>
              </div>
            )}
          </div>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Trap-by-trap record
          </h2>
          <div className="glass mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                  <th className="px-4 py-3 font-medium">Trap</th>
                  <th className="px-4 py-3 font-medium">Subjects</th>
                  <th className="px-4 py-3 font-medium">Trapped</th>
                  <th className="px-4 py-3 font-medium">Trap rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.byType.map((t) => (
                  <tr key={t.trapType} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      {TRAPS[t.trapType].emoji} {TRAPS[t.trapType].labName}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{t.attempts}</td>
                    <td className="px-4 py-3 tabular-nums">{t.trapped}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {t.trappedRate !== null ? (
                        <span className="text-punch">{t.trappedRate}%</span>
                      ) : (
                        <span className="text-fog/60">collecting…</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {stats.avgAnswerSeconds !== null && (
            <p className="mt-3 font-mono text-xs text-fog/70">
              average time to answer: {stats.avgAnswerSeconds}s · lab notes
              stolen by email: {stats.emailSignups.toLocaleString()}
            </p>
          )}
        </>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-teal/10 via-grape/10 to-punch/10 p-6">
        <div>
          <div className="font-bold">
            Today's featured menace: {featured.emoji} {featured.labName}
          </div>
          <p className="text-sm text-fog">Add a data point. Trap somebody.</p>
        </div>
        <Link href={`/make?type=${featured.id}`} className="btn-primary">
          Arm it
        </Link>
      </div>

      <div className="mt-10">
        <EmailCTA source="stats-page" compact />
      </div>
    </div>
  );
}
