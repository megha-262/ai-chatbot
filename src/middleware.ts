import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only these routes require authentication. Everything else (home, /login,
// /signup, public pages, static assets) is left untouched. Health Tools
// (symptom checker + medicine info) also requires login — it calls the paid
// Gemini API, so gating it behind auth (like /chat already is) avoids
// unauthenticated abuse. The old /symptom-checker and /medicine-info routes
// are kept in the matcher too since they still redirect into Health Tools.
export const config = {
  matcher: [
    '/chat', '/chat/:path*',
    '/dashboard', '/dashboard/:path*',
    '/profile', '/profile/:path*',
    '/health-tools', '/health-tools/:path*',
    '/symptom-checker', '/symptom-checker/:path*',
    '/medicine-info', '/medicine-info/:path*',
  ],
};
