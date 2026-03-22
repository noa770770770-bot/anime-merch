import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      take: 5,
      include: { reviews: true, variants: true }
    });
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    
    return NextResponse.json({ 
      ok: true, 
      productsCount: products.length,
      categoriesCount: categories.length,
      firstProduct: products[0] ? { id: products[0].id, name: products[0].name } : null
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, stack: e.stack });
  }
}
