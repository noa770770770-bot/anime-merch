import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    
    if (!q || q.trim().length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: q } },
          { description: { contains: q } }
        ]
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        priceILS: true,
        imageUrl: true,
        category: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
