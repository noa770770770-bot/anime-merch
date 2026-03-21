import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();
    if (!name || !slug) return NextResponse.json({ ok: false, error: 'Name and slug are required' }, { status: 400 });

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ ok: false, error: 'Slug must be unique' }, { status: 400 });

    const category = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json({ ok: true, category });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
