import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { paypalOrderId } = await req.json();
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const captureRes = await fetch(`https://api-m.sandbox-paypal.com/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    });
    const text = await captureRes.text();
    console.log('PAYPAL CAPTURE STATUS:', captureRes.status);
    console.log('PAYPAL CAPTURE BODY:', text);
    if (!captureRes.ok) {
      return NextResponse.json({ ok: false, stage: 'capture', status: captureRes.status, body: text }, { status: 500 });
    }

    const captureJson = JSON.parse(text);
    await prisma.order.update({ where: { paypalOrderId }, data: { status: 'PAID' } });
    return NextResponse.json({ ok: true, capture: captureJson });
  } catch (e: any) {
    console.error('capture-order error', e);
    return NextResponse.json({ ok: false, stage: 'server', error: e.message }, { status: 500 });
  }
}
