import { TRAP_TYPES, TRAPS } from "@/lib/traps";
import type { TrapRecord, TrapType } from "@/types";

function defaultSlots(trapType: TrapType): Record<string, string> {
  return Object.fromEntries(
    (TRAPS[trapType].slots ?? []).map((s) => [s.id, s.defaultValue])
  );
}

/**
 * The homepage "try a random trap" flow uses a virtual trap owned by The Lab.
 * It has no stored record; we synthesize one so attempts still work and count.
 * Demo trap ids look like `demo-<trapType>`.
 */

export function isDemoTrapId(trapId: string): boolean {
  return trapId.startsWith("demo");
}

export function demoTrapTypeFromId(trapId: string): TrapType | null {
  const suffix = trapId.replace(/^demo-?/, "");
  return (TRAP_TYPES as string[]).includes(suffix) ? (suffix as TrapType) : null;
}

export function randomDemoType(): TrapType {
  return TRAP_TYPES[Math.floor(Math.random() * TRAP_TYPES.length)];
}

export function synthesizeDemoTrap(trapId: string, trapType: TrapType): TrapRecord {
  return {
    trapId,
    createdAt: Date.now(),
    creatorName: "The Lab",
    friendName: "",
    trapType,
    tone: "goblin",
    theme: "clean-lab",
    customMessage: "",
    slots: defaultSlots(trapType),
    shareSlug: trapId,
    creatorSessionId: "",
    source: "demo",
    utm: {},
    isTest: false,
  };
}
