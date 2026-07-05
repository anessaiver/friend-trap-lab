"use client";

import { useState } from "react";

interface EmailCTAProps {
  source: string;
  compact?: boolean;
  showTransparency?: boolean;
}

export function EmailCTA({ source, compact = false, showTransparency = false }: EmailCTAProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, labNotes: "" }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setState("done");
        setMessage(data.message ?? "Check your inbox. The lab notes are on their way.");
      } else {
        setState("error");
        setMessage(data.error ?? "The signup machine hiccuped. Try again?");
      }
    } catch {
      setState("error");
      setMessage("The signup machine hiccuped. Try again?");
    }
  }

  return (
    <section className="glass overflow-hidden p-6 sm:p-8" aria-label="Get the lab notes by email">
      {!compact && (
        <>
          <div className="chip">📋 The honest bribe</div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            Steal this entire experiment.
          </h2>
          <div className="prose-lab mt-3 space-y-2">
            <p>
              Avisha challenged the AI to design the most effective email signup
              it could, because email is the only channel he actually controls.
              The AI decided to do two things: make fun of him, and prove it
              could help.
            </p>
            <p className="text-frost">
              So here's the most honest bribe on the internet — join the
              Distilled Science list and get:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>The complete prompt that built this entire site</li>
              <li>The exact pre-setup steps Avisha did before pressing go</li>
              <li>The “10 Brain Traps” mini-deck</li>
              <li>The 3-day dataset of which traps fooled people most</li>
              <li>Occasional emails on emerging science, sharper thinking, and practical AI</li>
            </ul>
          </div>
        </>
      )}
      {compact && (
        <h2 className="text-xl font-bold tracking-tight">
          Want the prompt that built this site?
        </h2>
      )}

      {state === "done" ? (
        <p className="mt-5 rounded-xl border border-teal/40 bg-teal/10 px-4 py-3 text-teal" role="status">
          {message}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor={`email-${source}`}>
            Email address
          </label>
          <input
            id={`email-${source}`}
            type="email"
            required
            autoComplete="email"
            placeholder="you@curious.org"
            className="input sm:flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "sending"}
          />
          {/* Honeypot — humans never see this */}
          <input
            type="text"
            name="labNotes"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            onChange={() => {}}
            value=""
          />
          <button type="submit" className="btn-primary" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send me the prompt"}
          </button>
        </form>
      )}
      {state === "error" && (
        <p className="mt-3 text-sm text-punch" role="alert">
          {message}
        </p>
      )}

      {showTransparency && (
        <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-fog/70">
          “Cite or it didn't happen” applies to us too: the app was built from
          one prompt, but Avisha preconfigured the boring plumbing first —
          domain, GitHub/Vercel auth, Beehiiv credentials, and a tiny database.
          The exact setup steps are included in the email. Unsubscribe anytime.
        </p>
      )}
    </section>
  );
}
