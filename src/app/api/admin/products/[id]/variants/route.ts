import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - create variant
export async function POST(req: NextRequest, context: any) {
  try {
    const body = await req.json();
    const { id } = await context.params;
    const { name, value, stock, priceILS } = body;
    if (!name || !value) return NextResponse.json({ ok: false, error: 'Name and value are required' }, { status: 400 });
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 });
    const v = await prisma.productVariant.create({
      data: { productId: id, name, value, stock: Number(stock) || 0, priceILS: priceILS != null && priceILS !== '' ? Number(priceILS) : null },
    });
    return NextResponse.json({ ok: true, variant: v });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
