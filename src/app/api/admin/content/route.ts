import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const content = await prisma.siteContent.findMany();
    const contentMap = content.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    return NextResponse.json(contentMap);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Basic admin check - in this project, admin is the user with email 'admin@otakumerch.com' or similar
  // Adjust based on your Auth implementation
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) return NextResponse.json({ error: 'Key is required' }, { status: 400 });

    const updated = await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
