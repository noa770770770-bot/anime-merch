import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT_SET",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || "NO",
  });
}
