import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 });

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    return NextResponse.json({ ok: true, wishlist });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ ok: false, error: 'missing_product_id' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 });

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existing) {
      // Toggle off
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ ok: true, action: 'removed' });
    } else {
      // Toggle on
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          productId
        }
      });
      return NextResponse.json({ ok: true, action: 'added' });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
