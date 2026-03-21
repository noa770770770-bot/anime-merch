import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - list all products (for admin)
export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, include: { variants: true } });
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST - create product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, priceILS, imageUrl, active, categoryId } = body;
    if (!name || !slug || !priceILS) return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
    if (Number(priceILS) <= 0) return NextResponse.json({ ok: false, error: 'invalid_price' }, { status: 400 });
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ ok: false, error: 'slug_taken' }, { status: 400 });
    const prod = await prisma.product.create({ data: { name, slug, description: description || null, priceILS: Number(priceILS), imageUrl: imageUrl || null, active: Boolean(active), categoryId: categoryId || null } });
    return NextResponse.json({ ok: true, id: prod.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
