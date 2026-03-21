import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const { productId, rating, title, body } = await req.json();
    if (!productId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: 'invalid_data' }, { status: 400 });
    }

    // Verify the user actually purchased this product
    const out = await prisma.order.findFirst({
      where: {
        email: session.user.email,
        items: {
          some: { productId }
        }
      }
    });

    if (!out) {
      return NextResponse.json({ ok: false, error: 'not_purchased', message: 'You can only review products you have purchased.' }, { status: 403 });
    }

    // Find user ID from session mapped to DB
    const user = await prisma.user.findUnique({ where: { email: session.user.email }});
    
    // Check if user already reviewed
    const existing = await prisma.review.findFirst({
      where: { productId, userId: user?.id }
    });

    if (existing) {
      return NextResponse.json({ ok: false, error: 'already_reviewed', message: 'You have already reviewed this product.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user?.id,
        rating,
        title: title?.trim() || null,
        body: body?.trim() || null
      }
    });

    return NextResponse.json({ ok: true, review });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
