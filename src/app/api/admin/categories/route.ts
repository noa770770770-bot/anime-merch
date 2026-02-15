import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();
    if (!name || !slug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const exists = await prisma.category.findUnique({ where: { slug } });
    if (exists) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    const category = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json({ category });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
