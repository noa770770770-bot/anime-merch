import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    // allow login page and any subpaths under it
    if (pathname.startsWith('/admin/login')) return NextResponse.next();
    const adminCookie = req.cookies.get('admin')?.value;
    if (adminCookie === '1') return NextResponse.next();
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
