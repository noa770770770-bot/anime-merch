import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Count all users in the database
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ count });
  } catch (e) {
    return NextResponse.json({ count: 0, error: "Failed to fetch user count" }, { status: 500 });
  }
}
