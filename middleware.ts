import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Use Node.js runtime instead of Edge runtime to support crypto module
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // If no token, redirect to login
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const payload = verifyToken(token);

  if (!payload) {
    console.log('Invalid token, redirecting to login');
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear invalid cookie
    response.cookies.delete('auth-token');
    response.cookies.delete('user-role');
    return response;
  }

  // Get role from cookie (since it's not in the JWT)
  const userRole = request.cookies.get('user-role')?.value;
  console.log('User role from cookie:', userRole);
  console.log('All cookies:', request.cookies.getAll());

  // Check if user has admin role
  if (userRole !== 'ROLE_ADMIN') {
    console.log('User does not have admin role:', userRole);
    return NextResponse.json(
      { error: 'Access denied. Admin role required.' },
      { status: 403 }
    );
  }

  console.log('User authenticated successfully, allowing access to:', pathname);

  // User is authenticated and has admin role
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/upload/:path*'],
};
