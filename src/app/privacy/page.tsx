import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What the Friend Trap Lab collects, what it doesn't, and why.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="chip">🔏 plain english</div>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Privacy</h1>
      <p className="mt-3 text-fog">
        This is a playful game, so here's the deal in actual sentences instead
        of forty pages of fog.
      </p>

      <div className="prose-lab mt-8 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-frost">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <span className="text-frost">Trap data:</span> the display names
              and optional message a creator types, the trap type, tone, and
              card style. These are stored because the game literally cannot
              work without them — and they're visible to anyone who has the
              trap or result link.
            </li>
            <li>
              <span className="text-frost">Attempt data:</span> the answer
              given, the outcome, rough time-to-answer, and whether the device
              was mobile or desktop. This feeds the anonymous aggregate stats.
            </li>
            <li>
              <span className="text-frost">A random local id:</span> stored in
              your own browser so revenge chains can be counted. It is not tied
              to your identity.
            </li>
            <li>
              <span className="text-frost">Email — only if you volunteer it</span>{" "}
              via the newsletter form. It goes to Beehiiv (our newsletter
              provider) and nowhere else.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-frost">What we don't collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>No accounts, no passwords.</li>
            <li>Your friend's email is never requested, ever.</li>
            <li>No raw IP addresses are intentionally stored. (A hashed, non-reversible fingerprint briefly rate-limits the signup form, then expires.)</li>
            <li>No ad trackers, no third-party analytics scripts, no cookies used for tracking.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-frost">How aggregate data is used</h2>
          <p className="mt-2">
            Anonymous totals — like “68% of subjects fell for the Anchor Drop”
            — may appear on the public stats page and in future Distilled
            Science content or newsletters. Nothing in those aggregates can
            identify you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-frost">Email & unsubscribing</h2>
          <p className="mt-2">
            The newsletter runs on Beehiiv. Every email includes an unsubscribe
            link that works instantly. Signing up is never required to create,
            take, or share a trap.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-frost">Be kind clause</h2>
          <p className="mt-2">
            Display names and messages are lightly filtered for abusive
            language. Traps exist to roast your friends gently, not to hurt
            anyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-frost">Contact</h2>
          <p className="mt-2">
            Questions, deletion requests, or complaints about the jellybean
            count: reach Distilled Science via the contact links at{" "}
            <a
              href="https://www.youtube.com/@DistilledScience"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:underline"
            >
              youtube.com/@DistilledScience
            </a>{" "}
            and we'll sort it out.
          </p>
        </section>
      </div>
    </div>
  );
}
