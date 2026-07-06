import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmailCTA } from "@/components/EmailCTA";
import { ResultReveal } from "@/components/ResultReveal";
import { hasRedisConfig, siteUrl } from "@/lib/env";
import {
  getAnchorAggregates,
  getAttempt,
  getTrapAggregate,
  getVariantAggregates,
} from "@/lib/stats";
import { RESULT_META, TRAPS } from "@/lib/traps";
import type { AttemptRecord } from "@/types";

/** Build the live A/B comparison block for generic variant traps. */
async function loadVariantCompare(attempt: AttemptRecord) {
  const challenge = TRAPS[attempt.trapType].challenge;
  if (!challenge) return null;
  if (challenge.mechanic !== "numeric" && challenge.mechanic !== "scale") return null;
  if (!challenge.compare || !challenge.variants) return null;
  try {
    const variants = Object.keys(challenge.variants);
    const aggs = await getVariantAggregates(attempt.trapType, variants);
    const entries = variants
      .filter((v) => aggs[v]?.mean !== null)
      .map((v) => ({
        label: challenge.compare!.labels[v] ?? v,
        value: `${challenge.compare!.unit === "$" ? "$" : ""}${aggs[v].mean!.toLocaleString()}${
          challenge.compare!.unit && challenge.compare!.unit !== "$" ? challenge.compare!.unit : ""
        }`,
      }));
    if (entries.length < 2) return null;
    return { title: challenge.compare.title, entries };
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

async function loadAttempt(attemptId: string): Promise<AttemptRecord | null> {
  if (!hasRedisConfig()) return null;
  try {
    return await getAttempt(attemptId);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { attemptId } = await params;
  const attempt = await loadAttempt(attemptId);
  if (!attempt) return { title: "Result not found" };
  const meta = RESULT_META[attempt.resultType];
  const template = TRAPS[attempt.trapType];
  const friend = attempt.friendName || "The subject";
  const creator = attempt.creatorName || "a friend";
  const title = `${meta.title} — ${friend} vs ${creator}`;
  const description = meta.escaped
    ? `${friend} escaped ${template.labName}. ${template.principleName} has been defeated. This time.`
    : `${friend} walked into ${template.labName}. ${template.principleName}: still undefeated.`;
  const ogImage = `/api/og/result?id=${attempt.attemptId}`;
  return {
    title,
    description,
    robots: { index: false },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { attemptId } = await params;
  const attempt = await loadAttempt(attemptId);
  if (!attempt) notFound();

  const [aggregate, anchorAgg, variantCompare] = await Promise.all([
    getTrapAggregate(attempt.trapId).catch(() => ({ attempts: 0, trapped: 0 })),
    attempt.trapType === "anchor"
      ? getAnchorAggregates().catch(() => null)
      : Promise.resolve(null),
    loadVariantCompare(attempt),
  ]);

  return (
    <>
      <ResultReveal
        attemptId={attempt.attemptId}
        trapType={attempt.trapType}
        resultType={attempt.resultType}
        creatorName={attempt.creatorName}
        friendName={attempt.friendName}
        roastLine={attempt.roastLine}
        detailLine={attempt.detailLine}
        aggregate={aggregate}
        anchorAgg={anchorAgg}
        variantCompare={variantCompare}
        shareUrl={`${siteUrl()}/r/${attempt.attemptId}`}
        isDemo={attempt.trapId.startsWith("demo")}
      />
      <div className="mx-auto max-w-xl px-4 pb-16">
        <EmailCTA source="result-page" showTransparency />
      </div>
    </>
  );
}
