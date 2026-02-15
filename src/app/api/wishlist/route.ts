import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // For demo: wishlist stored in localStorage on client, not server
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: Request) {
  // For demo: no server-side storage, handled client-side
  return NextResponse.json({ status: 'ok' });
}
