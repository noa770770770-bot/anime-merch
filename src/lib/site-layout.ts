import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LAYOUT_PATH = path.join(process.cwd(), 'config', 'site_layout.json');

export async function GET() {
  try {
    const data = await fs.readFile(LAYOUT_PATH, 'utf8');
    return NextResponse.json({ layout: JSON.parse(data) });
  } catch {
    return NextResponse.json({ layout: null });
  }
}

export async function POST(req: Request) {
  try {
    const { layout } = await req.json();
    await fs.writeFile(LAYOUT_PATH, JSON.stringify(layout, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

