import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    const { name, image } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, image }
    });

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
