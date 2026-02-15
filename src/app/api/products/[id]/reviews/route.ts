import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json({ reviews: [] });
  const reviews = await prisma.review.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  try {
    const { productId, rating, title, body } = await req.json();
    if (!productId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const review = await prisma.review.create({ data: { productId, rating, title, body } });
    return NextResponse.json({ review });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
