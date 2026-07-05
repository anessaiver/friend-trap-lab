import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getTrap } from "@/lib/stats";
import { TRAPS, THEMES } from "@/lib/traps";
import { demoTrapTypeFromId, isDemoTrapId } from "@/lib/demo";
import { OG_COLORS, OG_SIZE, OgBadge, OgFooter, OgFrame, OgIcon } from "@/lib/og-helpers";
import type { TrapRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  let trap: TrapRecord | null = null;
  if (id && !isDemoTrapId(id)) {
    try {
      trap = await getTrap(id);
    } catch {
      trap = null; // render the generic card
    }
  } else if (id && isDemoTrapId(id)) {
    const t = demoTrapTypeFromId(id);
    if (t) {
      trap = { creatorName: "The Lab", friendName: "", trapType: t, theme: "clean-lab" } as TrapRecord;
    }
  }

  const creator = trap?.creatorName || "Someone suspiciously confident";
  const friend = trap?.friendName || "you";
  const template = trap ? TRAPS[trap.trapType] : null;
  const theme = THEMES[trap?.theme ?? "clean-lab"];

  return new ImageResponse(
    (
      <OgFrame accents={theme.ogAccent}>
        <OgBadge text="FRIEND TRAP LAB" color={theme.ogAccent[0]} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "64px",
            gap: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: OG_COLORS.frost,
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "1000px",
            }}
          >
            {creator} thinks they can trap your brain.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              fontSize: "34px",
              color: OG_COLORS.fog,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 24px",
                borderRadius: "999px",
                border: `2px solid ${theme.ogAccent[0]}`,
                color: theme.ogAccent[0],
              }}
            >
              <OgIcon
                name={template ? template.icon : "flask"}
                size={34}
                color={theme.ogAccent[0]}
              />
              {template ? template.publicTitle : "A tiny brain trap"}
            </div>
            <div style={{ display: "flex" }}>
              Can {friend} escape?
            </div>
          </div>
        </div>
        <OgFooter />
      </OgFrame>
    ),
    OG_SIZE
  );
}
