import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const isAdmin = /admin=1/.test(cookie);
  return NextResponse.json({ isAdmin });
}
