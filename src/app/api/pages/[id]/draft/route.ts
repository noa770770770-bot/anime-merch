// API route to save draft page model
import { NextRequest } from "next/server";
import { PageModel } from "@/editor/page-model";
import { draftStore, publishedStore } from "../../store";

export async function PUT(req: NextRequest, context: any) {
  const params = context?.params || (await context);
  const id = params.id;
  const body = await req.json();
  draftStore[id] = body.model;
  // Auto-publish for home and products (dev only, comment out for production)
  if (id === "home" || id === "products") {
    publishedStore[id] = body.model;
  }
  return Response.json({ ok: true });
}
