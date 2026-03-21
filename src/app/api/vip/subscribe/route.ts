import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

    // Mock Subscription Logic for the Portfolio Showcase
    // In production, this would redirect to Stripe Checkout and update via Webhook.
    await prisma.user.update({
      where: { id: user.id },
      data: { isVIP: true }
    });

    return NextResponse.json({ ok: true, message: 'Welcome to the Otaku Club!' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
