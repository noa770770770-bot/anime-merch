import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_MqXBzCMy_E3fZFintGwgS4qhdboYAYHNU');

// POST - update order status (JSON)
export async function POST(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;
    if (!status) return NextResponse.json({ ok: false, error: 'Status required' }, { status: 400 });
    
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
    
    await prisma.order.update({ where: { id }, data: { status } });

    // Triggers the automated order tracking email when admin ships it
    if (status === 'SHIPPED' && order.status !== 'SHIPPED' && order.email) {
      try {
        await resend.emails.send({
          from: 'Anime Merch <onboarding@resend.dev>',
          to: order.email,
          subject: `Your AnimeMerch Order has Shipped! 🚚`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 12px; background: #0f0f13; color: white;">
              <h1 style="color: #7c5bf5; text-align: center;">Great news, ${order.shippingName || 'Otaku'}!</h1>
              <p style="text-align: center; color: #a1a1aa; font-size: 16px;">
                Your order <strong>#${order.id.split('-')[0].toUpperCase()}</strong> has left our facility and is on its way to you.
              </p>
              
              <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="http://localhost:3000/account/tracking/${order.id}" style="background: #d4af37; color: #0d2b5e; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 900; display: inline-block;">
                  Track Your Package 📡
                </a>
              </div>
            </div>
          `
        });
      } catch (err) {
        console.error('Failed to send tracking email', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
