import { Suspense } from "react";
import type { Metadata } from "next";
import { TrapCreator } from "@/components/TrapCreator";

export const metadata: Metadata = {
  title: "Arm a trap",
  description:
    "Pick a science-backed brain trap, personalize the bait, and send it to a friend in under 30 seconds.",
  openGraph: {
    title: "Arm a brain trap",
    description: "Pick a trap. Personalize the bait. Send.",
    images: [{ url: "/api/og/home", width: 1200, height: 630 }],
  },
};

export default function MakePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center font-mono text-sm text-fog">
          opening the armory…
        </div>
      }
    >
      <TrapCreator />
    </Suspense>
  );
}
