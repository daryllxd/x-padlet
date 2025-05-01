import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Handle root path redirect
  if (path === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Later you can add auth logic here
  // const session = await getSession()
  // if (!session && path !== '/login') {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
