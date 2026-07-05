"use client";

import { useCallback, useEffect, useState } from "react";
import { LabIcon } from "@/components/LabIcon";
import { TRAPS } from "@/lib/traps";
import type { AdminStats } from "@/lib/stats";

interface Health {
  status: string;
  redis: string;
  beehiivConfigured: boolean;
  adminConfigured: boolean;
  timestamp: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState("");

  const load = useCallback(async (key: string) => {
    setBusy(true);
    setError("");
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch("/api/admin", { headers: { "x-admin-secret": key } }),
        fetch("/api/health"),
      ]);
      if (statsRes.status === 401) throw new Error("Wrong lab keycard.");
      if (!statsRes.ok) throw new Error("Stats unavailable (storage unreachable?).");
      const data = (await statsRes.json()) as { stats: AdminStats };
      setStats(data.stats);
      if (healthRes.ok || healthRes.status === 503) {
        setHealth((await healthRes.json()) as Health);
      }
      setAuthed(true);
      try {
        window.sessionStorage.setItem("ftl-admin", key);
      } catch {
        // sessionStorage unavailable — fine, they'll retype
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something jammed.");
      setAuthed(false);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("ftl-admin");
      if (saved) {
        setSecret(saved);
        load(saved);
      }
    } catch {
      // ignore
    }
  }, [load]);

  async function download(format: "csv" | "json") {
    const res = await fetch(`/api/admin?format=${format}`, {
      headers: { "x-admin-secret": secret },
    });
    if (!res.ok) {
      setError("Export failed.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `friend-trap-lab-attempts.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function purgeTest() {
    if (!window.confirm("Delete all records flagged as test data? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "x-admin-secret": secret, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purge-test" }),
      });
      const data = (await res.json()) as { purged?: { traps: number; attempts: number }; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Purge failed.");
      setPurgeMsg(`Purged ${data.purged?.traps ?? 0} test traps and ${data.purged?.attempts ?? 0} test attempts.`);
      await load(secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purge failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <h1 className="text-2xl font-bold">Lab access</h1>
        <p className="mt-1 text-sm text-fog">Staff only. Keycard required.</p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            load(secret);
          }}
        >
          <label htmlFor="admin-secret" className="sr-only">
            Admin secret
          </label>
          <input
            id="admin-secret"
            type="password"
            className="input"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="current-password"
          />
          <button className="btn-primary w-full" disabled={busy || !secret}>
            {busy ? "Checking…" : "Open the lab"}
          </button>
          {error && (
            <p className="text-sm text-punch" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  if (!stats) return null;
  const p = stats.public;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <div className="flex gap-2">
          <button className="btn-ghost !min-h-9 !px-3 !text-xs" onClick={() => download("csv")}>
            Export CSV
          </button>
          <button className="btn-ghost !min-h-9 !px-3 !text-xs" onClick={() => download("json")}>
            Export JSON
          </button>
          <button className="btn-ghost !min-h-9 !px-3 !text-xs" onClick={() => load(secret)} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {health && (
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
          <span className={`chip ${health.redis === "ok" ? "!border-teal/50 !text-teal" : "!border-punch/50 !text-punch"}`}>
            redis: {health.redis}
          </span>
          <span className={`chip ${health.beehiivConfigured ? "!border-teal/50 !text-teal" : "!border-punch/50 !text-punch"}`}>
            beehiiv: {health.beehiivConfigured ? "configured" : "missing"}
          </span>
          <span className="chip">as of {new Date(health.timestamp).toLocaleTimeString()}</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {[
          ["Traps", p.trapsCreated],
          ["Attempts", p.attempts],
          ["Trapped", p.trapped],
          ["Escaped", p.escaped],
          ["Revenge traps", p.revengeTraps],
          ["Email signups", p.emailSignups],
        ].map(([label, value]) => (
          <div key={label as string} className="glass p-4">
            <div className="text-2xl font-bold tabular-nums">{(value as number).toLocaleString()}</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-fog">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-fog">
        <span className="chip">
          test data: {stats.testCounts.traps} traps · {stats.testCounts.attempts} attempts
        </span>
        <button className="btn-ghost !min-h-8 !px-3 !text-xs" onClick={purgeTest} disabled={busy}>
          Purge test data
        </button>
        {purgeMsg && <span className="text-teal">{purgeMsg}</span>}
        {error && <span className="text-punch">{error}</span>}
      </div>

      <h2 className="mt-8 text-xl font-bold">Trap type performance</h2>
      <div className="glass mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-fog">
              <th className="px-4 py-2.5 font-medium">Trap</th>
              <th className="px-4 py-2.5 font-medium">Attempts</th>
              <th className="px-4 py-2.5 font-medium">Trapped</th>
              <th className="px-4 py-2.5 font-medium">Rate</th>
            </tr>
          </thead>
          <tbody>
            {p.byType.map((t) => (
              <tr key={t.trapType} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2"><LabIcon name={TRAPS[t.trapType].icon} className="h-4 w-4 text-teal" />{TRAPS[t.trapType].labName}</span>
                </td>
                <td className="px-4 py-2.5 tabular-nums">{t.attempts}</td>
                <td className="px-4 py-2.5 tabular-nums">{t.trapped}</td>
                <td className="px-4 py-2.5 tabular-nums">
                  {t.attempts > 0 ? `${Math.round((t.trapped / t.attempts) * 100)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-xl font-bold">Last 7 days</h2>
      <div className="glass mt-3 overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-fog">
              <th className="px-4 py-2.5 font-medium">Day</th>
              <th className="px-4 py-2.5 font-medium">Traps</th>
              <th className="px-4 py-2.5 font-medium">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {stats.daily.map((d) => (
              <tr key={d.day} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-2.5 font-mono text-xs">{d.day}</td>
                <td className="px-4 py-2.5 tabular-nums">{d.traps}</td>
                <td className="px-4 py-2.5 tabular-nums">{d.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Recent traps</h2>
          <div className="glass mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-fog">
                  <th className="px-3 py-2 font-medium">id</th>
                  <th className="px-3 py-2 font-medium">type</th>
                  <th className="px-3 py-2 font-medium">names</th>
                  <th className="px-3 py-2 font-medium">src</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTraps.map((t) => (
                  <tr key={t.trapId} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-2 font-mono">
                      <a className="hover:text-teal" href={`/t/${t.trapId}`} target="_blank" rel="noreferrer">
                        {t.trapId}
                      </a>
                      {t.isTest && <span className="ml-1 text-punch">T</span>}
                    </td>
                    <td className="px-3 py-2"><LabIcon name={TRAPS[t.trapType].icon} className="h-4 w-4 text-fog" /></td>
                    <td className="px-3 py-2">
                      {t.creatorName || "—"} → {t.friendName || "—"}
                    </td>
                    <td className="px-3 py-2 font-mono">{t.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Recent attempts</h2>
          <div className="glass mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-fog">
                  <th className="px-3 py-2 font-medium">id</th>
                  <th className="px-3 py-2 font-medium">type</th>
                  <th className="px-3 py-2 font-medium">result</th>
                  <th className="px-3 py-2 font-medium">ua</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttempts.map((a) => (
                  <tr key={a.attemptId} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-2 font-mono">
                      <a className="hover:text-teal" href={`/r/${a.attemptId}`} target="_blank" rel="noreferrer">
                        {a.attemptId.slice(0, 8)}
                      </a>
                      {a.isTest && <span className="ml-1 text-punch">T</span>}
                    </td>
                    <td className="px-3 py-2"><LabIcon name={TRAPS[a.trapType].icon} className="h-4 w-4 text-fog" /></td>
                    <td className="px-3 py-2">
                      <span className={a.isTrapped ? "text-punch" : "text-teal"}>{a.resultType}</span>
                    </td>
                    <td className="px-3 py-2 font-mono">{a.userAgentCategory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold">Content review — citations</h2>
      <div className="glass mt-3 divide-y divide-white/5">
        {stats.contentReview.map((c) => (
          <div key={c.trapType} className="flex items-start justify-between gap-4 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">{c.labName}</div>
              <div className="mt-0.5 font-mono text-xs text-fog">{c.citation}</div>
            </div>
            <span className={`chip shrink-0 ${c.needsReview ? "!border-punch/60 !text-punch" : "!border-teal/40 !text-teal"}`}>
              {c.needsReview ? "review" : "ok"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
