import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const productsCount = await prisma.product.count();
    return NextResponse.json({ 
      ok: true, 
      productsCount, 
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
        TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? 'PRESENT' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, stack: e.stack });
  }
}
