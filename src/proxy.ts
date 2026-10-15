import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

const AUTH_COOKIE_NAME = 'fccglobal_admin_session';
const SESSION_SECRET = process.env.AUTH_SECRET || process.env.ADMIN_SESSION_SECRET || 'fccglobal-super-secret-production-key-2026';

function isValidAdminSession(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [data, signature] = parts;
    if (!data || !signature) return false;

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (signature !== expectedSignature) return false;

    // Decode and verify expiration
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (!payload.userId || !payload.role) return false;
    if (payload.exp && Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const isPublicAdminPage = pathname === '/admin/login' || pathname === '/admin/reset-password';
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const hasValidSession = isValidAdminSession(sessionCookie);

    // If NOT logged in and trying to access any admin page (except public login/reset pages)
    if (!hasValidSession && !isPublicAdminPage) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }

    // If already logged in and visiting /admin/login -> redirect to dashboard
    if (hasValidSession && isLoginPage) {
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Protect all Admin API routes (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const hasValidSession = isValidAdminSession(sessionCookie);

    if (!hasValidSession) {
      return NextResponse.json(
        { error: 'Unauthorized. Valid admin session is required to perform this action.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
