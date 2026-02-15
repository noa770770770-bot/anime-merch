import { NextResponse } from "next/server";
import { draftStore, publishedStore } from "../store";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const url = new URL(req.url);
    const version = url.searchParams.get("version");
    const { id } = await context.params;

    const model = version === "draft" ? draftStore[id] : publishedStore[id];
    return NextResponse.json({ ok: true, model: model ?? null });
  } catch (err) {
    console.error("API GET /api/pages/[id] ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
