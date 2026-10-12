import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { getUserByIdMySQL } from '@/lib/mysql';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Direct MySQL user query
    const user = await getUserByIdMySQL(decoded.userId);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
