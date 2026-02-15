import { NextResponse } from "next/server";

import { draftStore, publishedStore } from "../../store";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // Debug logging for store keys
  console.log("PUBLISH id=", id, "draft keys=", Object.keys(draftStore));
  if (!draftStore[id]) {
    return NextResponse.json({ ok: false, error: "No draft" }, { status: 404 });
  }
  publishedStore[id] = draftStore[id];
  return NextResponse.json({ ok: true });
}
