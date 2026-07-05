import { ImageResponse } from "next/og";
import { OG_COLORS, OG_SIZE, OgBadge, OgFooter, OgFrame, OgIcon } from "@/lib/og-helpers";

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
              alignItems: "flex-start",
              gap: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                color: OG_COLORS.frost,
                fontSize: "76px",
                fontWeight: 700,
                lineHeight: 1.08,
                maxWidth: "900px",
              }}
            >
              Send your friend a tiny brain trap.
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "150px",
                borderRadius: "28px",
                border: `2px solid ${OG_COLORS.punch}66`,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <OgIcon name="trap" size={96} color={OG_COLORS.punch} />
            </div>
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
