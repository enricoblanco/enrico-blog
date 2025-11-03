import { NextRequest, NextResponse } from 'next/server';
import { loginWithAPI, setAuthCookie, hasAdminRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call external API for authentication
    const loginResponse = await loginWithAPI(username, password);

    // Check if user has admin role
    if (!hasAdminRole(loginResponse)) {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    // Store the JWT token and role from external API in cookies
    await setAuthCookie(loginResponse.token, loginResponse.role);

    return NextResponse.json({
      success: true,
      username: loginResponse.username,
      email: loginResponse.email,
      role: loginResponse.role
    });
  } catch (error) {
    console.error('Login error:', error);

    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('credentials')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
