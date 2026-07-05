/* Shared building blocks for the dynamic OG images (1200×630, satori-safe). */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  ink: "#0B1020",
  teal: "#18D4D0",
  grape: "#8E4DFF",
  punch: "#F72585",
  frost: "#F8FAFC",
  fog: "#94A3B8",
};

export function OgFrame({
  children,
  accents = [OG_COLORS.teal, OG_COLORS.grape],
}: {
  children: React.ReactNode;
  accents?: [string, string];
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: OG_COLORS.ink,
        backgroundImage: `radial-gradient(circle at 12% 8%, ${accents[0]}33 0%, transparent 45%), radial-gradient(circle at 90% 92%, ${accents[1]}33 0%, transparent 45%)`,
        padding: "56px 64px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1200px",
          height: "10px",
          display: "flex",
          backgroundImage: `linear-gradient(90deg, ${accents[0]}, ${accents[1]}, ${OG_COLORS.punch})`,
        }}
      />
      {children}
    </div>
  );
}

export function OgBadge({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color,
        fontSize: "26px",
        letterSpacing: "6px",
        fontWeight: 700,
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "999px",
          backgroundColor: color,
          display: "flex",
        }}
      />
      FRIEND TRAP LAB
    </div>
  );
}

export function OgFooter() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        color: OG_COLORS.fog,
        fontSize: "24px",
      }}
    >
      <div style={{ display: "flex" }}>distilledai.org</div>
      <div style={{ display: "flex" }}>a Distilled Science experiment 🧪</div>
    </div>
  );
}
