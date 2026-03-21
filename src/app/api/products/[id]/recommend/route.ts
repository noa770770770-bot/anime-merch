import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Context) {
  try {
    const { id } = await params;
    // Support both id and slug lookup
    const product = await prisma.product.findFirst({ 
      where: { OR: [{ id }, { slug: id }] } 
    });
    if (!product) return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 });
    const prod = product as any;

    // 1. Find all OrderItem rows for this product
    const soldItems = await prisma.orderItem.findMany({
      where: { productId: product.id },
      select: { orderId: true }
    });
    
    const orderIds = soldItems.map((i: any) => i.orderId);

    // 2. If no orders exist, fallback to category siblings
    if (orderIds.length === 0) {
      if (!prod.categoryId) return NextResponse.json({ ok: true, recommendations: [] });
      const fallback = await prisma.product.findMany({
        where: { categoryId: prod.categoryId, id: { not: product.id }, active: true } as any,
        take: 4,
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ ok: true, recommendations: fallback });
    }

    // 3. Find OTHER items in those same orders
    const otherItems = await prisma.orderItem.findMany({
      where: {
        orderId: { in: orderIds },
        productId: { not: product.id }
      },
      include: { product: true }
    });

    // 4. Map frequency
    const freqMap = new Map();
    for (const item of otherItems) {
      if (!item.product || !item.product.active) continue;
      freqMap.set(item.productId, { product: item.product, count: (freqMap.get(item.productId)?.count || 0) + 1 });
    }

    const sortedRaw = Array.from(freqMap.values()).sort((a: any, b: any) => b.count - a.count).map((entry: any) => entry.product).slice(0, 4);

    // 5. Pad with category siblings if needed
    let finalRecs = sortedRaw;
    if (finalRecs.length < 4 && prod.categoryId) {
      const existingIds = [product.id, ...finalRecs.map((r: any) => r.id)];
      const fillers = await prisma.product.findMany({
        where: { categoryId: prod.categoryId, id: { notIn: existingIds }, active: true } as any,
        take: 4 - finalRecs.length,
        orderBy: { createdAt: 'desc' }
      });
      finalRecs = [...finalRecs, ...fillers];
    }

    return NextResponse.json({ ok: true, recommendations: finalRecs });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
