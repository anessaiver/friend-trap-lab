import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/env";
import { exportAttempts, getAdminStats, purgeTestData } from "@/lib/stats";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Wrong lab keycard." }, { status: 401 });
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req.headers.get("x-admin-secret"))) return unauthorized();

  const format = req.nextUrl.searchParams.get("format");
  try {
    if (format === "csv" || format === "json") {
      const rows = await exportAttempts();
      if (format === "csv") {
        return new NextResponse(toCsv(rows as unknown as Record<string, unknown>[]), {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="friend-trap-lab-attempts.csv"`,
          },
        });
      }
      return NextResponse.json({ attempts: rows });
    }
    const stats = await getAdminStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("Admin stats failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Storage unreachable." }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req.headers.get("x-admin-secret"))) return unauthorized();

  let body: { action?: string } = {};
  try {
    body = await req.json();
  } catch {
    // fall through to unknown action
  }

  if (body.action === "purge-test") {
    try {
      const purged = await purgeTestData();
      return NextResponse.json({ ok: true, purged });
    } catch (err) {
      console.error("Purge failed:", err instanceof Error ? err.message : err);
      return NextResponse.json({ error: "Purge failed." }, { status: 503 });
    }
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
