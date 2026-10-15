import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPasswordResetToken } from '@/lib/auth';
import { getPool } from '@/lib/mysql';
import { logActivity } from '@/lib/auditLogger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Valid reset token is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim().length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verifyPasswordResetToken(token.trim());
    if (!decoded) {
      return NextResponse.json(
        { error: 'Password reset link is invalid or has expired. Please request a new link.' },
        { status: 400 }
      );
    }

    const cleanPassword = password.trim();
    const newPasswordHash = hashPassword(cleanPassword);

    // 1. Update in Local / Fallback DB
    const users: any[] = (await db.getTable('users')) || [];
    const userIndex = users.findIndex(
      (u) => u.id === decoded.userId || u.email?.toLowerCase().trim() === decoded.email.toLowerCase().trim()
    );

    if (userIndex !== -1) {
      users[userIndex].passwordHash = newPasswordHash;
      await db.updateTable('users', users);
    }

    // 2. Direct update in MySQL users table for instant sync
    try {
      const p = getPool();
      await p.execute(
        'UPDATE users SET password_hash = ? WHERE id = ? OR LOWER(email) = LOWER(?)',
        [newPasswordHash, decoded.userId, decoded.email.trim()]
      );
    } catch (mysqlErr: any) {
      console.warn('[MySQL Direct Update Warning]:', mysqlErr?.message || mysqlErr);
    }

    // 3. Log security activity
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const clientUa = request.headers.get('user-agent') || 'Browser';
    await logActivity({
      action: 'UPDATE',
      entity: 'Auth',
      userId: decoded.userId,
      userEmail: decoded.email,
      details: `Password successfully reset via email token for ${decoded.email}`,
      ip: clientIp,
      userAgent: clientUa,
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new credentials.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
