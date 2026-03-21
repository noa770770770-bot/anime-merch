import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - set tracking number (JSON)
export async function POST(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { trackingNumber } = body;
    if (!trackingNumber) return NextResponse.json({ ok: false, error: 'Tracking number required' }, { status: 400 });
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
    await prisma.order.update({ where: { id }, data: { trackingNumber, status: 'SHIPPED' } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
