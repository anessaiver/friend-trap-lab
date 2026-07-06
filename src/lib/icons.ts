import { ICON_DATA, type LabIconData } from "@/lib/icon-data.generated";

/**
 * Central icon registry — one Iconify icon per concept, used everywhere
 * (UI components, OG images). Same icon for the same concept, always.
 *
 * The map below documents each concept's source icon on
 * https://icon-sets.iconify.design/ and is the input for
 * scripts/gen-icons.mjs, which bakes the icon data into
 * icon-data.generated.ts (SSR-safe, satori-safe, no runtime fetching).
 */
export const iconMap = {
  // core concepts
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
  // trap types
  anchor: "tabler:anchor",
  exchange: "tabler:arrows-exchange",
  detective: "tabler:zoom-question",
  binary: "tabler:binary",
  news: "tabler:news",
  quicksand: "game-icons:quicksand",
  duck: "game-icons:duck",
  speakerphone: "tabler:speakerphone",
  // result states
  suspicious: "tabler:eye-question",
  confetti: "tabler:confetti",
  spy: "tabler:spy",
  trophy: "tabler:trophy",
  // card themes
  pin: "tabler:pin",
  masksTheater: "tabler:masks-theater",
  slotMachine: "mdi:slot-machine",
  urgent: "tabler:urgent",
  // challenge content
  planet: "tabler:planet",
  popcorn: "mdi:popcorn",
  rodent: "mdi:rodent",
  snowflake: "tabler:snowflake",
  server: "tabler:server",
  tornado: "tabler:tornado",
  lungs: "tabler:lungs",
  sharkFin: "mdi:shark-fin",
  deer: "game-icons:deer-head",
  bee: "mdi:bee",
  // general UI
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
  skull: "tabler:skull",
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
} as const;

export type IconName = keyof typeof ICON_DATA;

export { ICON_DATA };
export type { LabIconData };
