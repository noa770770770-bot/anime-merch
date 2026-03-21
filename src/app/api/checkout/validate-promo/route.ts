import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'Please enter a promo code' }, { status: 400 });

    const promo = await (prisma as any).promoCode.findUnique({
      where: { code: String(code).toUpperCase() }
    });

    if (!promo || !promo.active) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 });
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ error: 'This promo code has reached its usage limit' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      id: promo.id,
      code: promo.code,
      discountPercentage: promo.discountPercentage
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
