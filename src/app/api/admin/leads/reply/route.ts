import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendLeadReplyEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, email, studentName, subject, replyMessage, counselorName } = body;

    if (!email || !replyMessage) {
      return NextResponse.json(
        { error: 'Email and reply message are required.' },
        { status: 400 }
      );
    }

    const leads = (await db.getTable('leads')) || [];
    const leadIndex = leads.findIndex((l) => l.id === leadId || l.email.toLowerCase() === email.toLowerCase());

    const originalMessage = leadIndex !== -1 ? leads[leadIndex].message : undefined;

    // Send official branded reply email from FCC Global Education
    const mailResult = await sendLeadReplyEmail({
      to: email,
      studentName: studentName || 'Student',
      subject: subject || 'Re: Your Study Abroad Inquiry with FCC Global Education',
      replyMessage,
      originalMessage,
      counselorName: counselorName || 'Senior International Admissions Advisor',
    });

    if (!mailResult.success) {
      return NextResponse.json(
        { error: mailResult.error || 'Failed to dispatch email reply.' },
        { status: 500 }
      );
    }

    // Update lead record with notes and status 'contacted'
    if (leadIndex !== -1) {
      const currentNotes = leads[leadIndex].notes || '';
      const timestamp = new Date().toLocaleString('en-GB');
      const updatedNotes = currentNotes
        ? `${currentNotes}\n\n[Email Reply Sent - ${timestamp} by ${counselorName || 'Admin'}]:\n${replyMessage}`
        : `[Email Reply Sent - ${timestamp} by ${counselorName || 'Admin'}]:\n${replyMessage}`;

      leads[leadIndex].status = 'contacted';
      leads[leadIndex].notes = updatedNotes;
      leads[leadIndex].updatedAt = new Date().toISOString();

      await db.updateTable('leads', leads);
    }

    return NextResponse.json({
      success: true,
      message: `Official reply successfully sent to ${email}.`,
      updatedLead: leadIndex !== -1 ? leads[leadIndex] : null,
    });
  } catch (error: any) {
    console.error('[Lead Reply API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send reply.' },
      { status: 500 }
    );
  }
}
