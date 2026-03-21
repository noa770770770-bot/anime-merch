import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const promos = await (prisma as any).promoCode.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ promos });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountPercentage, active, usageLimit, expiresAt } = body;
    if (!code || !discountPercentage) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
    }
    const pc = await (prisma as any).promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountPercentage: Number(discountPercentage),
        active: Boolean(active),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });
    return NextResponse.json({ ok: true, promo: pc });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
