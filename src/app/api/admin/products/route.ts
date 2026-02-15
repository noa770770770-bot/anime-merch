import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request){
  try{
    const body = await req.json();
    const { name, slug, description, priceILS, imageUrl, active } = body;
    if(!name || !slug || !priceILS) return NextResponse.json({ ok:false, error:'missing_fields' }, { status:400 });
    if(Number(priceILS) <= 0) return NextResponse.json({ ok:false, error:'invalid_price' }, { status:400 });
    const prod = await prisma.product.create({ data: { name, slug, description, priceILS: Number(priceILS), imageUrl, active: Boolean(active) } });
    return NextResponse.json({ ok:true, id: prod.id });
  }catch(e:any){ console.error(e); return NextResponse.json({ ok:false, error: e.message }, { status:500 }); }
}
