import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, logoutWithAPI } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie to call external logout
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    // Call external API logout if token exists
    if (token) {
      await logoutWithAPI(token);
    }

    // Clear the cookie regardless of external API response
    await clearAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the cookie even if there's an error
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  }
}
