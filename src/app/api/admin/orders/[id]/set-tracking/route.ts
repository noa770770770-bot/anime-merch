import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const form = await req.formData();
    const { id } = await context.params;
    const trackingNumber = String(form.get('trackingNumber'));
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    await prisma.order.update({ where: { id }, data: { trackingNumber, status: 'SHIPPED' } });
    return NextResponse.redirect(`/admin/orders/${id}`);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
