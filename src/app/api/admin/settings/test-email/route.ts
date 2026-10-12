import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const toEmail = body.toEmail?.trim();
    const settings = body.settings;

    if (!toEmail || !toEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid recipient email address is required for testing.' },
        { status: 400 }
      );
    }

    const result = await sendTestEmail({
      toEmail,
      settings,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to authenticate or send email through SMTP server.',
          code: result.code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully dispatched to ${toEmail}. Please check your inbox or spam folder!`,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('[API Test Email Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unexpected server error while testing SMTP connection.',
      },
      { status: 500 }
    );
  }
}
