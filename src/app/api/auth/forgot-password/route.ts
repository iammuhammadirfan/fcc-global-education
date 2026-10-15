import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mailer';
import { logActivity } from '@/lib/auditLogger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = body.email;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();
    const users: any[] = (await db.getTable('users')) || [];
    const user = users.find((u) => u.email?.toLowerCase().trim() === email);

    // If no user found, return positive response to avoid user enumeration, but don't send email
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an administrator account exists for this email, a reset link has been sent.',
      });
    }

    // Generate secure 1-hour HMAC-signed token
    const token = signPasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    // Determine host URL
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${proto}://${host}`;
    const resetLink = `${origin}/admin/reset-password?token=${encodeURIComponent(token)}`;

    // Dispatch email
    const emailResult = await sendPasswordResetEmail({
      toEmail: user.email,
      userName: user.name || 'Administrator',
      resetLink,
    });

    // Audit log
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const clientUa = request.headers.get('user-agent') || 'Browser';
    await logActivity({
      action: 'UPDATE',
      entity: 'Auth',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      details: `Password reset link requested for ${user.email}`,
      ip: clientIp,
      userAgent: clientUa,
    }).catch(() => null);

    // Log for server and development audit
    console.log('\n=============================================');
    console.log('🔐 [ADMIN PASSWORD RESET LINK]:');
    console.log(resetLink);
    console.log('=============================================\n');

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been dispatched to your email address. Please check your inbox.',
      emailSent: emailResult.success,
      resetUrl: process.env.NODE_ENV !== 'production' ? resetLink : undefined,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
