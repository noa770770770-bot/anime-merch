import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env: Record<string, string | undefined> = {};
  Object.keys(process.env).forEach(key => {
    if (key.includes('NEXTAUTH') || key.includes('VERCEL') || key.includes('URL')) {
      env[key] = process.env[key];
    }
  });

  return NextResponse.json({
    env,
    NODE_ENV: process.env.NODE_ENV,
  });
}
