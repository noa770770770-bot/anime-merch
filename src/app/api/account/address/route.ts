import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email },
      select: {
        addressLine1: true,
        city: true,
        zipCode: true,
        phoneNumber: true
      }
    });

    return NextResponse.json({ ok: true, address: user });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    const { addressLine1, city, zipCode, phoneNumber } = await req.json();

    await prisma.user.update({
      where: { email: session.user.email },
      data: { addressLine1, city, zipCode, phoneNumber }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
