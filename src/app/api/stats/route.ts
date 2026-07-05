import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getPublicStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("Stats read failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Stats are temporarily unavailable." }, { status: 503 });
  }
}
