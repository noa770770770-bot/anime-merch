import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ users: [], error: e.message }, { status: 500 });
  }
}
