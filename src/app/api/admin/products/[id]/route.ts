import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const form = await req.formData();
    const { id } = await context.params;
    const name = String(form.get('name') || '');
    const slug = String(form.get('slug') || '');
    const description = String(form.get('description') || '');
    const priceILS = Number(form.get('priceILS'));
    const imageUrl = String(form.get('imageUrl') || '');
    const active = form.get('active') !== null;
    if (!name || !slug || !priceILS || priceILS <= 0) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    await prisma.product.update({ where: { id }, data: { name, slug, description, priceILS, imageUrl, active } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
