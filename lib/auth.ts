import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8080';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// JWT_SECRET is Base64 encoded - we'll decode it for verification

export interface JWTPayload {
  sub?: string;        // Subject (username) from external API
  username?: string;   // Alternative username field
  role?: string;
  id?: number;
  email?: string;
  iat?: number;
  exp?: number;
}

// User type from external API
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Login response from external API
export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

/**
 * Login with external API
 */
export async function loginWithAPI(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${EXTERNAL_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || 'Invalid credentials');
  }

  return await response.json();
}

/**
 * Logout with external API
 */
export async function logoutWithAPI(token: string): Promise<void> {
  try {
    await fetch(`${EXTERNAL_API_URL}/api/user/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Don't throw on error - we'll clear the cookie anyway
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue - we'll clear the cookie anyway
  }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return null;
    }

    // Decode the Base64 encoded secret (Spring Boot JWT secrets are typically Base64 encoded)
    const base64DecodedSecret = Buffer.from(JWT_SECRET.trim(), 'base64');

    // Verify the JWT signature using the decoded secret
    return jwt.verify(token, base64DecodedSecret) as JWTPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function setAuthCookie(token: string, role?: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Store role separately since it's not in the JWT
  if (role) {
    cookieStore.set('user-role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.delete('user-role');
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  // Check role from cookie (since it's not in the JWT)
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;

  return userRole === 'ROLE_ADMIN';
}

/**
 * Check if a user object has admin role
 */
export function hasAdminRole(user: JWTPayload | User | null): boolean {
  return user?.role === 'ROLE_ADMIN';
}
