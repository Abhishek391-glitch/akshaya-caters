import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and /admin/api/auth
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const isAuthApi = pathname.startsWith('/api/admin/login');
    const sessionCookie = request.cookies.get('akshaya_admin_session')?.value;

    // Basic validity check of token structure (payload.signature)
    const hasValidToken = Boolean(sessionCookie && sessionCookie.includes('.'));

    if (!hasValidToken && !isLoginPage && !isAuthApi) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (hasValidToken && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
