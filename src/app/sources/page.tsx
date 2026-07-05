import type { Metadata } from "next";
import { LabIcon } from "@/components/LabIcon";
import { TRAP_LIST } from "@/lib/traps";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Every scientific claim in the Friend Trap Lab, with its citation. Cite or it didn't happen.",
};

const EXTRA_SOURCES = [
  {
    claim:
      "US mortality comparisons in the Danger Ranking Test (asthma vs tornadoes, deer collisions vs sharks, insect stings vs lightning)",
    sources: [
      "CDC National Center for Health Statistics, underlying cause of death data (asthma: ~3,500+ deaths/yr; hornet/wasp/bee stings: ~72 deaths/yr average, 2011–2021).",
      "NOAA National Weather Service natural hazard statistics (tornadoes and lightning fatalities, multi-year averages).",
      "Insurance Institute for Highway Safety / State Farm analyses of animal–vehicle collisions (deer-related crash fatalities, ~150–200/yr).",
      "International Shark Attack File, Florida Museum of Natural History (~1 US shark fatality/yr average).",
    ],
  },
  {
    claim: "Saturn has more confirmed moons than Jupiter (274 vs 95)",
    sources: [
      "International Astronomical Union / NASA moon counts following the March 2025 recognition of 128 additional Saturnian moons.",
    ],
  },
  {
    claim: "Base-rate arithmetic in the Detective Test (a 'Series K' flag is wrong ~65% of the time)",
    sources: [
      "Bayes' theorem applied to the stated fiction: P(K|flag) = (0.12×0.80) / (0.12×0.80 + 0.88×0.20) ≈ 0.35. The mice are fictional; the arithmetic is not.",
    ],
  },
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="chip">
        <LabIcon name="clipboard" className="h-3.5 w-3.5 text-teal" />
        receipts
      </div>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Sources</h1>
      <p className="mt-3 text-fog">
        “Cite or it didn't happen” is the house rule. Every trap teaches a real,
        replicated-or-classic finding from judgment and decision-making
        research. Here is each trap's primary citation, plus the data sources
        behind specific factual claims.
      </p>
      <p className="mt-2 text-sm text-fog/80">
        Honesty note: the jellybean jar, the escaped mouse, Project Hoverboot,
        and the popcorn menu are fictional scenarios built to demonstrate real
        effects. No citation covers the jar. The jar is beyond science.
      </p>

      <h2 className="mt-10 text-2xl font-bold tracking-tight">Trap citations</h2>
      <ul className="mt-4 space-y-4">
        {TRAP_LIST.map((t) => (
          <li key={t.id} className="glass p-5">
            <div className="flex flex-wrap items-center gap-2 font-bold">
              <LabIcon name={t.icon} className="h-5 w-5 text-teal" />
              {t.labName}
              <span className="chip !text-[10px]">{t.principleName}</span>
            </div>
            <p className="mt-2 font-mono text-xs leading-relaxed text-fog">
              {t.citation.url ? (
                <a
                  href={t.citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal hover:underline"
                >
                  {t.citation.text}
                </a>
              ) : (
                t.citation.text
              )}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-bold tracking-tight">
        Specific factual claims
      </h2>
      <ul className="mt-4 space-y-4">
        {EXTRA_SOURCES.map((s) => (
          <li key={s.claim} className="glass p-5">
            <p className="font-semibold">{s.claim}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs leading-relaxed text-fog">
              {s.sources.map((src) => (
                <li key={src}>{src}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="prose-lab mt-10">
        One more disclosure: this game measures nothing about real
        intelligence. Falling for these traps is the default behavior of
        healthy human brains — including the brains of the researchers who
        discovered them. That's the whole point.
      </p>
    </div>
  );
}
