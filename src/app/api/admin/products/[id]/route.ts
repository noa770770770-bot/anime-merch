import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single product with variants
export async function GET(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({ where: { id }, include: { variants: true } });
    if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT - update product (JSON)
export async function PUT(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, slug, description, priceILS, imageUrl, active, categoryId } = body;
    if (!name || !slug || !priceILS || Number(priceILS) <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid fields' }, { status: 400 });
    }
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    await prisma.product.update({
      where: { id },
      data: { name, slug, description: description || null, priceILS: Number(priceILS), imageUrl: imageUrl || null, active: Boolean(active), categoryId: categoryId || null },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// POST - also support for legacy form submissions
export async function POST(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, slug, description, priceILS, imageUrl, active, categoryId } = body;
    if (!name || !slug || !priceILS || Number(priceILS) <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid fields' }, { status: 400 });
    }
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    await prisma.product.update({
      where: { id },
      data: { name, slug, description: description || null, priceILS: Number(priceILS), imageUrl: imageUrl || null, active: Boolean(active), categoryId: categoryId || null },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// DELETE - delete product
export async function DELETE(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    // Delete variants first, then product
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
