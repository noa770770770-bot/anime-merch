import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BANNER_PATH = path.join(process.cwd(), 'config', 'site_banner.json');

export async function GET() {
  try {
    const data = await fs.readFile(BANNER_PATH, 'utf8');
    return NextResponse.json({ message: JSON.parse(data).message });
  } catch {
    return NextResponse.json({ message: null });
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    await fs.writeFile(BANNER_PATH, JSON.stringify({ message }, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
