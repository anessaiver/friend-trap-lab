"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TRAPS } from "@/lib/traps";
import type { PublicStats } from "@/types";

export function StatsPreview() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { stats: PublicStats }) => setStats(d.stats))
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  const items = [
    { label: "Traps armed", value: stats ? stats.trapsCreated.toLocaleString() : "···" },
    { label: "Lab subjects", value: stats ? stats.attempts.toLocaleString() : "···" },
    {
      label: "Walked into it",
      value: stats
        ? stats.attempts >= 10
          ? `${Math.round((stats.trapped / Math.max(1, stats.attempts)) * 100)}%`
          : stats.trapped.toLocaleString()
        : "···",
    },
    {
      label: "Most dangerous",
      value: stats?.mostDangerous
        ? TRAPS[stats.mostDangerous.trapType].emoji
        : "🔬",
      detail: stats?.mostDangerous
        ? TRAPS[stats.mostDangerous.trapType].labName
        : "collecting data…",
    },
  ];

  return (
    <Link
      href="/stats"
      className="glass grid grid-cols-2 gap-4 p-5 transition-colors hover:border-white/20 sm:grid-cols-4"
      aria-label="Live lab stats — see all"
    >
      {items.map((item) => (
        <div key={item.label}>
          <div className="text-2xl font-bold tabular-nums">{item.value}</div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
            {item.label}
          </div>
          {"detail" in item && item.detail && (
            <div className="text-xs text-fog/80">{item.detail}</div>
          )}
        </div>
      ))}
    </Link>
  );
}
