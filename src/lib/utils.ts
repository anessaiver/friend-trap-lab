import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fill {creator}/{friend}/{trap} placeholders in copy templates. */
export function fillTemplate(
  template: string,
  vars: { creator?: string; friend?: string; trap?: string }
): string {
  return template
    .replaceAll("{creator}", vars.creator ?? "Your friend")
    .replaceAll("{friend}", vars.friend ?? "you")
    .replaceAll("{trap}", vars.trap ?? "a brain trap");
}

export function pickFrom<T>(arr: readonly T[], seed?: number): T {
  const i =
    seed !== undefined
      ? Math.abs(seed) % arr.length
      : Math.floor(Math.random() * arr.length);
  return arr[i];
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}
