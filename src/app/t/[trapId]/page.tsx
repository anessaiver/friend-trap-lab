import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrapRunner } from "@/components/TrapRunner";
import { demoTrapTypeFromId, isDemoTrapId, randomDemoType, synthesizeDemoTrap } from "@/lib/demo";
import { hasRedisConfig } from "@/lib/env";
import { getTrap } from "@/lib/stats";
import { TRAPS } from "@/lib/traps";
import type { PublicTrap, TrapRecord } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ trapId: string }>;
}

async function loadTrap(trapId: string): Promise<TrapRecord | null> {
  if (isDemoTrapId(trapId)) {
    const type = demoTrapTypeFromId(trapId) ?? randomDemoType();
    return synthesizeDemoTrap(`demo-${type}`, type);
  }
  if (!hasRedisConfig()) return null;
  try {
    return await getTrap(trapId);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trapId } = await params;
  const trap = await loadTrap(trapId);
  if (!trap) return { title: "Trap not found" };
  const creator = trap.creatorName || "Someone";
  const template = TRAPS[trap.trapType];
  const title = `${creator} thinks they can trap your brain`;
  const description = `${template.publicTitle} — ~${template.estimatedTimeSeconds} seconds, no signup. Prove them wrong.`;
  const ogImage = `/api/og/trap?id=${trap.trapId}`;
  return {
    title,
    description,
    robots: isDemoTrapId(trapId) ? undefined : { index: false },
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

export default async function TrapPage({ params }: PageProps) {
  const { trapId } = await params;
  const trap = await loadTrap(trapId);
  if (!trap) notFound();

  const publicTrap: PublicTrap = {
    trapId: trap.trapId,
    createdAt: trap.createdAt,
    creatorName: trap.creatorName,
    friendName: trap.friendName,
    trapType: trap.trapType,
    tone: trap.tone,
    theme: trap.theme,
    customMessage: trap.customMessage,
    slots: trap.slots ?? {},
  };

  return <TrapRunner trap={publicTrap} />;
}
