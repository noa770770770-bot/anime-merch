import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

// Provide a safeguard key just in case, though it should explicitly be defined
const resend = new Resend('re_MqXBzCMy_E3fZFintGwgS4qhdboYAYHNU');

export async function GET(req: Request) {
  // Ideally this would be protected via an Authorization header or Vercel Cron Secret.
  // We'll allow GET for cron scheduling systems to simply ping it.
  
  try {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    // Find all uncompleted orders older than 2 hours that haven't been emailed yet
    const abandonedOrders = await prisma.order.findMany({
      where: {
        status: 'CREATED',
        createdAt: { lt: twoHoursAgo }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    if (abandonedOrders.length === 0) {
      return NextResponse.json({ ok: true, message: 'No abandoned carts to process.' });
    }

    let processedCount = 0;

    for (const order of abandonedOrders) {
      // Must have an email address to send to!
      if (!order.email) continue;

      let itemsHtml = '';
      for (const item of order.items) {
        itemsHtml += `<li><strong>${item.product?.name || 'Item'}</strong> (Qty: ${item.qty})</li>`;
      }

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="color: #6366f1; text-align: center;">Did you forget something? 🛒</h1>
          <p>Hi ${order.shippingName || 'Anime Fan'},</p>
          <p>We noticed you left some awesome merch behind in your checkout cart! Don't worry, we've saved your items for you.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${itemsHtml}
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/cart" style="background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Return to Cart</a>
          </div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">You are receiving this because you initiated a checkout on AnimeMerch.</p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: 'Anime Merch <onboarding@resend.dev>',
          to: order.email, // In Sandbox, Resend only permits sending back to the registered dev address, but in prod this works for any!
          subject: 'Your AnimeMerch Cart is Waiting! ⚔️',
          html: emailHtml
        });

        // Mark as emailed so we don't spam them every hour
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'ABANDONED_EMAILED' }
        });

        processedCount++;
      } catch (err) {
        console.error('Failed to send abandoned email to', order.email, err);
      }
    }

    return NextResponse.json({ ok: true, message: `Processed ${processedCount} abandoned carts successfully.` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
