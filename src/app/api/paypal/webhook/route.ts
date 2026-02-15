import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('PAYPAL WEBHOOK RECEIVED', JSON.stringify(body));

    const event = body.event_type || body.eventType || body.type;
    const resource = body.resource || body.data || {};
    const paypalOrderId = resource.id || resource.order_id || resource.purchase_units?.[0]?.reference_id || resource.supplementary_data?.related_ids?.order_id;

    if (!event) return NextResponse.json({ ok: false, error: 'no_event' }, { status: 400 });
    if (!paypalOrderId) return NextResponse.json({ ok: false, error: 'no_order_id', resource }, { status: 400 });

    if (event === 'PAYMENT.CAPTURE.COMPLETED' || event === 'PAYMENT.CAPTURE.COMPLETED') {
      await prisma.order.updateMany({ where: { paypalOrderId }, data: { status: 'PAID' } });
      console.log('Order marked PAID', paypalOrderId);
    } else if (event === 'PAYMENT.CAPTURE.DENIED' || event === 'PAYMENT.CAPTURE.DENIED') {
      await prisma.order.updateMany({ where: { paypalOrderId }, data: { status: 'DENIED' } });
      console.log('Order marked DENIED', paypalOrderId);
    } else {
      console.log('Unhandled webhook event', event);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('webhook error', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
