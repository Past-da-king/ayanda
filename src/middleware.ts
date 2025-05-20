import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests for NextAuth session & provider, API routes, static files, and public pages
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/landing' ||
    pathname.startsWith('/api/ai') || // Assuming AI endpoint is public or handles its own auth
    pathname.startsWith('/api/events') || // Assuming these are fine or have their own auth
    pathname.startsWith('/api/goals') ||
    pathname.startsWith('/api/notes') ||
    pathname.startsWith('/api/projects') ||
    pathname.startsWith('/api/tasks')
  ) {
    return NextResponse.next();
  }

  // If no token and trying to access a protected route (e.g., dashboard at root)
  if (!token && pathname === '/') {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Pass current URL as callback
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token, or it's a public path not yet handled, allow access
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     * - landing, login, register (public pages)
     *
     * This will apply middleware to `/` (dashboard) and other potential protected routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|landing|login|register).*)',
  ],
};

