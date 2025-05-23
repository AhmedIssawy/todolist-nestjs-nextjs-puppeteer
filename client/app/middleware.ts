import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the JWT token from cookies
  const token = request.cookies.get('jwt')?.value;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard'];
  // Define public routes that redirect to dashboard if authenticated
  const publicRoutes = ['/login', '/register'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Validate token format (basic JWT structure check)
  const isValidTokenFormat = token && token.split('.').length === 3;
  
  // If accessing a protected route without a valid token, redirect to login
  if (isProtectedRoute && (!token || !isValidTokenFormat)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    // Clear invalid token cookie if present
    const response = NextResponse.redirect(loginUrl);
    if (token && !isValidTokenFormat) {
      response.cookies.delete('jwt');
    }
    return response;
  }
  
  // If accessing public routes with a valid token, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect root path to appropriate destination
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
}
