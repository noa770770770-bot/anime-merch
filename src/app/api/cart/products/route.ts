import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ products: {} });
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const map: any = {};
    for (const p of products) map[p.id] = p;
    return NextResponse.json({ products: map });
  } catch (e: any) {
    return NextResponse.json({ products: {}, error: e.message }, { status: 500 });
  }
}