import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - delete variant
export async function DELETE(req: NextRequest, context: any) {
  try {
    const { vid } = await context.params;
    const variant = await prisma.productVariant.findUnique({ where: { id: vid } });
    if (!variant) return NextResponse.json({ ok: false, error: 'Variant not found' }, { status: 404 });
    await prisma.productVariant.delete({ where: { id: vid } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// PUT - update variant
export async function PUT(req: NextRequest, context: any) {
  try {
    const { vid } = await context.params;
    const body = await req.json();
    const { name, value, stock, priceILS } = body;
    await prisma.productVariant.update({
      where: { id: vid },
      data: { name, value, stock: Number(stock) || 0, priceILS: priceILS != null ? Number(priceILS) : null },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
