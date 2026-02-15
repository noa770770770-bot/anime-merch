
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string, vid: string }> }) {
  try {
    const form = await req.formData();
    const { id, vid } = await context.params;
    const name = String(form.get('name') || '');
    const value = String(form.get('value') || '');
    const stock = Number(form.get('stock'));
    const price = form.get('priceILS');
    if (!name || !value) return NextResponse.json({ ok: false, error: 'missing' }, { status: 400 });
    if (stock < 0) return NextResponse.json({ ok: false, error: 'invalid_stock' }, { status: 400 });
    const data: any = { name, value, stock };
    if (price !== null) { const p = Number(price); if (p <= 0) return NextResponse.json({ ok: false, error: 'invalid_price' }, { status: 400 }); data.priceILS = p; }
    const v = await prisma.productVariant.update({ where: { id: vid }, data });
    return NextResponse.json({ ok: true, variant: v });
  } catch (e: any) { console.error(e); return NextResponse.json({ ok: false, error: e.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string, vid: string }> }) {
  try{
    const { vid } = await context.params;
    await prisma.productVariant.delete({ where: { id: vid } });
    return NextResponse.json({ ok:true });
  }catch(e:any){ console.error(e); return NextResponse.json({ ok:false, error:e.message }, { status:500 }); }
}
