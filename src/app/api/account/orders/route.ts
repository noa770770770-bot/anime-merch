import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/user=([^;]+)/);
  if (!match) return NextResponse.json({ orders: [] });
  const userId = match[1];
  const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ orders });
}
