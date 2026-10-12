import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { verifyUserCredentialsMySQL } from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Direct secure MySQL database authentication
    const authenticatedUser = await verifyUserCredentialsMySQL(email, password);

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Invalid email or password. Access denied.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        avatar: authenticatedUser.avatar,
      },
    });

    // Set as pure Session Cookie (expires on browser/tab close)
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
