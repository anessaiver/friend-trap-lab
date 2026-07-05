import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getAttempt } from "@/lib/stats";
import { RESULT_META, THEMES, TRAPS } from "@/lib/traps";
import { OG_COLORS, OG_SIZE, OgBadge, OgFooter, OgFrame } from "@/lib/og-helpers";
import type { AttemptRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  let attempt: AttemptRecord | null = null;
  if (id) {
    try {
      attempt = await getAttempt(id);
    } catch {
      attempt = null;
    }
  }

  if (!attempt) {
    return new ImageResponse(
      (
        <OgFrame>
          <OgBadge text="FRIEND TRAP LAB" color={OG_COLORS.teal} />
          <div
            style={{
              display: "flex",
              marginTop: "90px",
              color: OG_COLORS.frost,
              fontSize: "72px",
              fontWeight: 700,
            }}
          >
            A brain trap was sprung.
          </div>
          <OgFooter />
        </OgFrame>
      ),
      OG_SIZE
    );
  }

  const meta = RESULT_META[attempt.resultType];
  const template = TRAPS[attempt.trapType];
  const theme = THEMES[attempt.theme] ?? THEMES["clean-lab"];
  const escaped = meta.escaped;
  const stampColor = escaped ? OG_COLORS.teal : OG_COLORS.punch;
  const friend = attempt.friendName || "The subject";
  const creator = attempt.creatorName || "a friend";

  return new ImageResponse(
    (
      <OgFrame accents={theme.ogAccent}>
        <OgBadge text="FRIEND TRAP LAB" color={theme.ogAccent[0]} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "48px",
            gap: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "14px 34px",
              border: `5px solid ${stampColor}`,
              borderRadius: "18px",
              color: stampColor,
              fontSize: "62px",
              fontWeight: 700,
              letterSpacing: "4px",
              transform: "rotate(-3deg)",
            }}
          >
            {meta.title}
          </div>
          <div
            style={{
              display: "flex",
              color: OG_COLORS.frost,
              fontSize: "44px",
              fontWeight: 700,
              maxWidth: "1050px",
              lineHeight: 1.2,
            }}
          >
            {friend} {escaped ? "escaped" : "walked into"} {template.labName} — armed by {creator}.
          </div>
          <div style={{ display: "flex", fontSize: "44px" }}>{meta.grid} {template.emoji}</div>
        </div>
        <OgFooter />
      </OgFrame>
    ),
    OG_SIZE
  );
}
