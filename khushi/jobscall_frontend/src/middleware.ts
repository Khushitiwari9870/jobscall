import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Redirect all /api/* requests to your Django backend
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (backendUrl) {
      const url = new URL(request.nextUrl.pathname.replace(/^\/api/, ''), backendUrl);
      url.search = request.nextUrl.search;
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
