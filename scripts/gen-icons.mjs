/**
 * Fetch the exact Iconify icons the app uses and generate a compact,
 * SSR-safe TypeScript module (parsed path data, no innerHTML needed —
 * also renderable by satori for OG images).
 */
const ICON_MAP = {
  brain: "tabler:brain",
  trap: "game-icons:box-trap",
  flask: "tabler:flask",
  escape: "tabler:door-exit",
  warning: "tabler:alert-triangle",
  share: "tabler:share-3",
  copy: "tabler:copy",
  link: "tabler:link",
  check: "tabler:check",
  stats: "tabler:chart-bar",
  lock: "tabler:lock",
  arrowLeft: "tabler:arrow-left",
  refresh: "tabler:refresh",
  download: "tabler:download",
  send: "tabler:send",
  bolt: "tabler:bolt",
  flame: "tabler:flame",
  star: "tabler:star",
  ghost: "tabler:ghost",
  tool: "tabler:tool",
  microscope: "tabler:microscope",
  telescope: "tabler:telescope",
  clipboard: "tabler:clipboard-text",
  radar: "tabler:radar-2",
  briefcase: "tabler:briefcase",
  pin: "tabler:pin",
  planet: "tabler:planet",
  popcorn: "mdi:popcorn",
  rodent: "mdi:rodent",
  snowflake: "tabler:snowflake",
  server: "tabler:server",
  news: "tabler:news",
  skull: "tabler:skull",
  trophy: "tabler:trophy",
  spy: "tabler:spy",
  confetti: "tabler:confetti",
  suspicious: "tabler:eye-question",
  anchor: "tabler:anchor",
  exchange: "tabler:arrows-exchange",
  detective: "tabler:zoom-question",
  binary: "tabler:binary",
  quicksand: "game-icons:quicksand",
  duck: "game-icons:duck",
  speakerphone: "tabler:speakerphone",
  urgent: "tabler:urgent",
  slotMachine: "mdi:slot-machine",
  masksTheater: "tabler:masks-theater",
  tornado: "tabler:tornado",
  lungs: "tabler:lungs",
  sharkFin: "mdi:shark-fin",
  deer: "game-icons:deer-head",
  bee: "mdi:bee",
  externalLink: "tabler:external-link",
  mail: "tabler:mail",
  // 30-trap expansion
  stack: "tabler:stack-2",
  door: "tabler:door",
  coins: "tabler:coins",
  mug: "tabler:mug",
  bowl: "tabler:bowl",
  calculator: "tabler:calculator",
  trendingUp: "tabler:trending-up",
  plane: "tabler:plane",
  robot: "tabler:robot",
  cash: "tabler:cash",
  letterR: "tabler:letter-r",
  usersGroup: "tabler:users-group",
  sun: "tabler:sun",
  shirt: "tabler:shirt",
  ticket: "tabler:ticket",
  dice: "tabler:dice",
  hourglass: "tabler:hourglass",
  swapBag: "game-icons:swap-bag",
  crystalBall: "tabler:crystal-ball",
  calendarTime: "tabler:calendar-time",
  hamburger: "mdi:hamburger",
  clover: "mdi:clover",
};

const byPrefix = {};
for (const [concept, full] of Object.entries(ICON_MAP)) {
  const [prefix, name] = full.split(":");
  (byPrefix[prefix] ??= []).push({ concept, name });
}

const out = {};
const missing = [];
const nonPath = [];

for (const [prefix, items] of Object.entries(byPrefix)) {
  const names = items.map((i) => i.name).join(",");
  const res = await fetch(`https://api.iconify.design/${prefix}.json?icons=${names}`);
  if (!res.ok) throw new Error(`API ${prefix}: ${res.status}`);
  const data = await res.json();
  for (const { concept, name } of items) {
    const icon = data.icons?.[name];
    if (!icon) {
      missing.push(`${prefix}:${name} (${concept})`);
      continue;
    }
    const width = icon.width ?? data.width ?? 16;
    const height = icon.height ?? data.height ?? 16;
    const body = icon.body;
    const mode = body.includes('stroke="currentColor"') ? "stroke" : "fill";
    const paths = [...body.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
    const stripped = body.replace(/<\/?(g|path)\b[^>]*>/g, "").trim();
    if (stripped.length > 0) nonPath.push(`${prefix}:${name} (${concept}): leftover ${stripped.slice(0, 80)}`);
    if (paths.length === 0) nonPath.push(`${prefix}:${name} (${concept}): NO PATHS`);
    out[concept] = { viewBox: `0 0 ${width} ${height}`, mode, paths };
  }
}

if (missing.length) console.log("MISSING:", missing.join(" | "));
if (nonPath.length) console.log("NON-PATH CONTENT:", nonPath.join(" | "));

const ts = `/**
 * AUTO-GENERATED from the Iconify API (https://icon-sets.iconify.design/).
 * Icon sets: Tabler Icons (MIT), Material Design Icons (Apache 2.0),
 * Game Icons (CC BY 3.0). Regenerate with scripts in the session notes.
 * Parsed to raw path data so icons render identically in server components,
 * client components, and @vercel/og (satori) without runtime fetching.
 */

export interface LabIconData {
  viewBox: string;
  mode: "stroke" | "fill";
  paths: string[];
}

export const ICON_DATA = ${JSON.stringify(out, null, 2)} as const satisfies Record<string, LabIconData>;
`;

const fs = await import("node:fs");
fs.writeFileSync(process.argv[2] ?? "icon-data.generated.ts", ts);
console.log("WROTE", Object.keys(out).length, "icons");
