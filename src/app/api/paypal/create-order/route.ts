import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('CREATE ORDER BODY:', JSON.stringify(body));
    const { items, promoCodeId } = body;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Empty cart' }, { status: 400 });
    }
    // validate client items
    for (const i of items) {
      if (typeof i.qty !== 'number' || i.qty <= 0) {
        return NextResponse.json({ ok: false, error: 'Invalid qty', item: i }, { status: 400 });
      }
      if (!i.productId) {
        return NextResponse.json({ ok: false, error: 'Missing productId', item: i }, { status: 400 });
      }
    }

    // Auth & VIP check
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    let isVIP = false;
    let userRecord = null;
    if (session?.user?.email) {
      userRecord = await prisma.user.findUnique({ where: { email: session.user.email } });
      if ((userRecord as any)?.isVIP) isVIP = true;
    }

    // compute total from DB prices
    const ids = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const priceMap = new Map(products.map((p: any) => [p.id, p.priceILS]));
    
    let totalILS = items.reduce((sum: number, i: any) => {
      const price = priceMap.get(i.productId) ?? 0;
      return sum + price * i.qty;
    }, 0);

    // Apply VIP 15% permanent discount
    if (isVIP) {
      totalILS = Math.max(0, totalILS - Math.round(totalILS * 0.15));
    }

    // Apply specific Promo Codes ON TOP of VIP
    if (promoCodeId) {
       const promo = await (prisma as any).promoCode.findUnique({ where: { id: promoCodeId } });
       if (promo && promo.active && (!promo.usageLimit || promo.usageCount < promo.usageLimit) && (!promo.expiresAt || promo.expiresAt > new Date())) {
           totalILS = Math.max(0, totalILS - Math.round(totalILS * (promo.discountPercentage / 100)));
       }
    }

    if (totalILS <= 0) {
      return NextResponse.json({ ok: false, error: 'Computed totalILS <= 0', items, products }, { status: 400 });
    }

    const order = await prisma.order.create({ 
      data: { 
        totalILS,
        ...(userRecord ? { userId: userRecord.id, email: userRecord.email } : {})
      } 
    });

    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const paypalRes = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'USD', value: Number((totalILS / 3.7).toFixed(2)).toString() } }] }),
    });

    const text = await paypalRes.text();
    console.log('PAYPAL CREATE STATUS:', paypalRes.status);
    console.log('PAYPAL CREATE BODY:', text);
    if (!paypalRes.ok) {
      return NextResponse.json({ ok: false, stage: 'create', status: paypalRes.status, body: text }, { status: 500 });
    }

    const paypal = JSON.parse(text);
    if (!paypal || !paypal.id) {
      return NextResponse.json({ ok: false, stage: 'create', status: paypalRes.status, body: text }, { status: 500 });
    }

    await prisma.order.update({ where: { id: order.id }, data: { paypalOrderId: paypal.id } });
    return NextResponse.json({ ok: true, paypalOrderId: paypal.id, totalILS, totalUSD: Number((totalILS / 3.7).toFixed(2)).toString() });
  } catch (e: any) {
    console.error('create-order error', e);
    return NextResponse.json({ ok: false, stage: 'server', error: e.message }, { status: 500 });
  }
}
