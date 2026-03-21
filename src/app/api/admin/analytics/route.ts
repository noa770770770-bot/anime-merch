import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Revenue over time (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true, totalILS: true }
    });

    const revenueMap = new Map();
    for (const o of orders) {
      const day = o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      revenueMap.set(day, (revenueMap.get(day) || 0) + o.totalILS);
    }
    const revenueData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

    // 2. Top Products
    const items = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { status: 'PAID' } },
      _sum: { qty: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: 5
    });

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
      select: { id: true, name: true }
    });
    
    const topProducts = items.map((item: any) => {
      const prodName = products.find(p => p.id === item.productId)?.name || 'Unknown';
      // Truncate name for charting
      const shortName = prodName.length > 20 ? prodName.substring(0, 20) + '...' : prodName;
      return { name: shortName, sales: item._sum.qty || 0 };
    });

    return NextResponse.json({ ok: true, revenueData, topProducts, ordersCount: orders.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
