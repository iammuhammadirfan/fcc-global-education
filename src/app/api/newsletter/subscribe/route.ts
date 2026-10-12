import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/db';
import { sendNewsletterWelcomeEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // Record unique email in subscribers list (1 email 1 time)
    const subscriber = await addSubscriber(email, undefined, 'newsletter');

    // Send welcome email asynchronously
    sendNewsletterWelcomeEmail(email).catch((err) =>
      console.warn('[Newsletter Welcome Email Warning]:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to FCC Global Education Intelligence.',
      subscriber,
    });
  } catch (error: any) {
    console.error('[Newsletter Subscribe Error]:', error);
    return NextResponse.json(
      { error: 'Failed to process newsletter subscription.' },
      { status: 500 }
    );
  }
}
