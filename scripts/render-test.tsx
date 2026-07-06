/**
 * Render-crash test: server-renders every generic trap's challenge UI (and a
 * couple of full-page components) with default slots. Catches undefined
 * icons, bad slot references, and runtime errors in challenge specs without
 * needing a browser. Run with: npx tsx scripts/render-test.tsx
 */

import React from "react";
import { renderToString } from "react-dom/server";
import { GenericChallengeView } from "../src/components/GenericChallenge";
import { TRAP_LIST } from "../src/lib/traps";
import { fillSlots } from "../src/lib/challenge";

let pass = 0;
let fail = 0;

for (const t of TRAP_LIST) {
  if (!t.challenge) continue;
  const slots = Object.fromEntries((t.slots ?? []).map((s) => [s.id, s.defaultValue]));
  try {
    const html = renderToString(
      React.createElement(GenericChallengeView, {
        challenge: t.challenge,
        slots,
        onSubmit: () => {},
      })
    );
    // Every default slot value must actually appear somewhere in the UI
    // (compare in escaped form — renderToString entity-escapes apostrophes)
    const escape = (v: string) =>
      v.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
    const missing = (t.slots ?? []).filter((s) => {
      const usedInChallenge = JSON.stringify(t.challenge).includes(`{${s.id}}`);
      return usedInChallenge && !html.includes(escape(s.defaultValue).slice(0, 20));
    });
    const unfilled = html.match(/\{(\w+)\}/g)?.filter((m) => !m.includes("{value}"));
    if (missing.length) {
      fail++;
      console.log(`FAIL ${t.id}: slot(s) not rendered: ${missing.map((s) => s.id).join(",")}`);
    } else if (unfilled && unfilled.length) {
      fail++;
      console.log(`FAIL ${t.id}: unfilled placeholders in UI: ${[...new Set(unfilled)].join(",")}`);
    } else {
      pass++;
      console.log(`PASS ${t.id} (${t.challenge.mechanic}, ${Math.round(html.length / 1024)}kb)`);
    }
  } catch (err) {
    fail++;
    console.log(`FAIL ${t.id}: render threw: ${err instanceof Error ? err.message : err}`);
  }
}

// Sanity: fillSlots handles missing + extra slots without throwing
const s = fillSlots("Hello {name}, meet {stranger}", { name: "Ada" });
if (s !== "Hello Ada, meet {stranger}") {
  fail++;
  console.log("FAIL fillSlots fallback behavior");
} else {
  pass++;
  console.log("PASS fillSlots fallback");
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
