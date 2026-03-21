import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend('re_MqXBzCMy_E3fZFintGwgS4qhdboYAYHNU');

export async function POST(req: Request){
  try{
    const body = await req.json();
    const { items, email, shippingName, shippingPhone, shippingAddress1, shippingAddress2, shippingCity, shippingZip, shippingCountry, promoCodeId } = body;
    if(!Array.isArray(items) || items.length===0) return NextResponse.json({ ok:false, error:'empty_cart' }, { status:400 });

    // validate and compute totals from DB
    const ids = items.map((i:any)=> i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: ids } }, include: { variants: true } });
    const productMap = new Map(products.map((p: any) => [p.id, p]));

    let totalILS = 0;
    const orderItemsData:any[] = [];
    const variantChecks: { variantId: string, qty: number }[] = [];

    for(const it of items){
      const prod = productMap.get(it.productId) as any;
      if(!prod) return NextResponse.json({ ok:false, error:'product_not_found', item: it }, { status:400 });
      let price = prod.priceILS;
      let variantId = null;
      if(it.variantId){
        const variant = prod.variants.find((v:any)=> v.id === it.variantId);
        if(!variant) return NextResponse.json({ ok:false, error:'variant_not_found', item: it }, { status:400 });
        variantId = variant.id;
        if(typeof variant.priceILS === 'number') price = variant.priceILS;
        // collect stock checks
        variantChecks.push({ variantId: variant.id, qty: Number(it.qty || 1) });
      }
      const qty = Number(it.qty || 1);
      if(qty <= 0) return NextResponse.json({ ok:false, error:'invalid_qty', item: it }, { status:400 });
      totalILS += price * qty;
      orderItemsData.push({ productId: prod.id, variantId, qty, priceILS: price });
    }

    // Apply Promo Code discounts securely server-side
    if (promoCodeId) {
       const promo = await (prisma as any).promoCode.findUnique({ where: { id: promoCodeId } });
       if (!promo || !promo.active || (promo.usageLimit && promo.usageCount >= promo.usageLimit) || (promo.expiresAt && promo.expiresAt < new Date())) {
           return NextResponse.json({ ok: false, error: 'Promo invalid or expired' }, { status: 400 });
       }
       const discountAmount = Math.round(totalILS * (promo.discountPercentage / 100));
       totalILS = totalILS - discountAmount;
    }

    // perform atomic transaction: check stocks, create order + items, decrement stocks
    const result = await prisma.$transaction(async (tx)=>{
      // check variant stocks
      for(const vc of variantChecks){
        const varRow = await tx.productVariant.findUnique({ where: { id: vc.variantId } });
        if(!varRow) throw new Error('variant_not_found_tx:' + vc.variantId);
        if((varRow.stock ?? 0) < vc.qty){
          // return structured error by throwing an object we can catch
          const err:any = new Error('OUT_OF_STOCK');
          (err as any).code = 'OUT_OF_STOCK';
          (err as any).productId = null;
          (err as any).variantId = vc.variantId;
          (err as any).available = varRow.stock ?? 0;
          throw err;
        }
      }

      const order = await tx.order.create({ data: { email, shippingName, shippingPhone, shippingAddress1, shippingAddress2, shippingCity, shippingZip, shippingCountry, totalILS, status: 'CREATED', promoCodeId: promoCodeId || null } as any });
      
      if (promoCodeId) {
         await (tx as any).promoCode.update({ where: { id: promoCodeId }, data: { usageCount: { increment: 1 } } });
      }

      for(const oi of orderItemsData){
        await tx.orderItem.create({ data: { orderId: order.id, productId: oi.productId, variantId: oi.variantId, qty: oi.qty, priceILS: oi.priceILS } });
        if(oi.variantId){
          await tx.productVariant.update({ where: { id: oi.variantId }, data: { stock: { decrement: oi.qty } as any } as any });
        }
      }

      return { orderId: order.id };
    });

    // Send automated email receipt via Resend
    try {
      let itemsListHtml = '';
      for (const oi of orderItemsData) {
        const p = productMap.get(oi.productId) as any;
        itemsListHtml += `<li><strong>${p?.name || oi.productId}</strong> (Qty <strong>${oi.qty}</strong>) - ${oi.priceILS * oi.qty} ₪</li>`;
      }
      const orderHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #6366f1; text-align: center;">Order Confirmed! 🎉</h1>
          <p>Hi ${shippingName},</p>
          <p>Thank you for purchasing from AnimeMerch. Your order <strong>#${result.orderId}</strong> was received and is being prepared.</p>
          <h3 style="border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Summary</h3>
          <ul style="list-style: none; padding: 0;">
            ${itemsListHtml}
          </ul>
          <div style="font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right;">
            Total Paid: <span style="color: #ef4444;">${totalILS} ₪</span>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: 'Anime Merch <onboarding@resend.dev>',
        to: email,
        subject: `AnimeMerch: Order #${result.orderId} Confirmed`,
        html: orderHtml
      });
      console.log('Receipt email sent to', email);
    } catch (emailErr) {
      console.error('Failed to send receipt email', emailErr);
    }

    return NextResponse.json({ ok: true, orderId: result.orderId });
  }catch(e:any){
    console.error('create order error', e);
    if(e.code === 'OUT_OF_STOCK' || (e as any).code === 'OUT_OF_STOCK'){
      const err:any = e;
      return NextResponse.json({ ok:false, error:'OUT_OF_STOCK', variantId: err.variantId, available: err.available }, { status:400 });
    }
    return NextResponse.json({ ok:false, error: e.message }, { status:500 });
  }
}
