import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass) return NextResponse.json({ error: 'server_misconfigured: ADMIN_PASSWORD not set' }, { status: 500 });
    if (password !== adminPass) return NextResponse.json({ error: 'invalid' }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    // set cookie for admin session
    res.cookies.set('admin', '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
