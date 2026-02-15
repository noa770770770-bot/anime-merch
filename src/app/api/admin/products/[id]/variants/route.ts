import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { id } = await context.params;
    const { name, value, stock, priceILS } = body;
    if (!name || !value) return NextResponse.json({ ok: false, error: 'missing' }, { status: 400 });
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    const v = await prisma.productVariant.create({ data: { productId: id, name, value, stock: Number(stock) || 0, priceILS: priceILS ? Number(priceILS) : null } });
    return NextResponse.json({ ok: true, variant: v });
  } catch (e: any) { console.error(e); return NextResponse.json({ ok: false, error: e.message }, { status: 500 }); }
}
