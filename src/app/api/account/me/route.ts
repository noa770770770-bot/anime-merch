import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/user=([^;]+)/);
  if (!match) return NextResponse.json({ user: null });
  const userId = match[1];
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
