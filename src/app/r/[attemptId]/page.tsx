import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmailCTA } from "@/components/EmailCTA";
import { ResultReveal } from "@/components/ResultReveal";
import { hasRedisConfig, siteUrl } from "@/lib/env";
import {
  getAnchorAggregates,
  getAttempt,
  getTrapAggregate,
} from "@/lib/stats";
import { RESULT_META, TRAPS } from "@/lib/traps";
import type { AttemptRecord } from "@/types";

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

  const [aggregate, anchorAgg] = await Promise.all([
    getTrapAggregate(attempt.trapId).catch(() => ({ attempts: 0, trapped: 0 })),
    attempt.trapType === "anchor"
      ? getAnchorAggregates().catch(() => null)
      : Promise.resolve(null),
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
        shareUrl={`${siteUrl()}/r/${attempt.attemptId}`}
        isDemo={attempt.trapId.startsWith("demo")}
      />
      <div className="mx-auto max-w-xl px-4 pb-16">
        <EmailCTA source="result-page" showTransparency />
      </div>
    </>
  );
}
