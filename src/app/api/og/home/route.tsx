import { ImageResponse } from "next/og";
import { OG_COLORS, OG_SIZE, OgBadge, OgFooter, OgFrame } from "@/lib/og-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  return new ImageResponse(
    (
      <OgFrame accents={[OG_COLORS.teal, OG_COLORS.punch]}>
        <OgBadge text="FRIEND TRAP LAB" color={OG_COLORS.teal} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "70px",
            gap: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: OG_COLORS.frost,
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: "1020px",
            }}
          >
            Send your friend a tiny brain trap. 🪤
          </div>
          <div
            style={{
              display: "flex",
              color: OG_COLORS.fog,
              fontSize: "36px",
              maxWidth: "950px",
              lineHeight: 1.35,
            }}
          >
            If they fall for it, science gets a point. If they escape, they get revenge.
          </div>
        </div>
        <OgFooter />
      </OgFrame>
    ),
    OG_SIZE
  );
}
