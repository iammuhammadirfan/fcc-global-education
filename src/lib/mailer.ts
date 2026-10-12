import nodemailer from 'nodemailer';
import { db } from './db';
import { EmailSettings } from './types';

// Default FCC Global Education Branding
const BRAND = {
  companyName: 'FCC Global Education',
  tagline: 'Premier International Education & Visa Advisory',
  londonAddress: 'Berkeley Square House, Mayfair, London W1J 6BD, United Kingdom',
  phone: '+44 (0) 20 7946 0912',
  email: 'admissions@fccglobaleducation.com',
  websiteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://fccglobaleducation.com',
  logoText: 'FCC Global Education',
};

async function getTransporter(overrideSettings?: Partial<EmailSettings>) {
  const currentSettings: EmailSettings = (await db.getTable('emailSettings')) || ({} as any);
  const emailSettings: EmailSettings = { ...currentSettings, ...overrideSettings };

  // 1. If valid SMTP configured in Admin Settings DB, use it
  if (emailSettings.smtpHost && emailSettings.smtpUser) {
    const isPort465 = Number(emailSettings.smtpPort) === 465;
    return {
      transporter: nodemailer.createTransport({
        host: emailSettings.smtpHost.trim(),
        port: Number(emailSettings.smtpPort) || 587,
        secure: isPort465,
        auth: {
          user: emailSettings.smtpUser.trim(),
          pass: emailSettings.smtpPass || '',
        },
        tls: {
          // Essential for GoDaddy / cPanel shared hostings to prevent certificate rejection
          rejectUnauthorized: false,
        },
      }),
      from: `"${emailSettings.senderName || BRAND.companyName}" <${emailSettings.senderEmail || emailSettings.smtpUser || BRAND.email}>`,
      replyTo: emailSettings.replyToEmail || emailSettings.senderEmail || BRAND.email,
    };
  }

  // 2. If SMTP environment variables are configured on live server (.env)
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const isPort465 = Number(process.env.SMTP_PORT) === 465;
    return {
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port: Number(process.env.SMTP_PORT) || 587,
        secure: isPort465,
        auth: {
          user: process.env.SMTP_USER.trim(),
          pass: process.env.SMTP_PASS || '',
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      from: `"${process.env.SMTP_FROM_NAME || BRAND.companyName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM || process.env.SMTP_USER,
    };
  }

  // 3. Fallback / Development transporter
  const fallbackTransporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 587,
    auth: {
      user: 'aura_smtp_user',
      pass: 'aura_smtp_pass',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return {
    transporter: fallbackTransporter,
    from: `"${BRAND.companyName}" <${BRAND.email}>`,
    replyTo: BRAND.email,
  };
}

// Helper: Wrap HTML in FCC Global Education Luxury Email Template
function wrapHtmlEmail({
  previewText,
  badgeText,
  headline,
  bodyHtml,
  ctaText,
  ctaLink,
}: {
  previewText?: string;
  badgeText?: string;
  headline: string;
  bodyHtml: string;
  ctaText?: string;
  ctaLink?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6; }
    .wrapper { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: #0b1528; padding: 36px 32px 30px; text-align: center; border-bottom: 3px solid #f59e0b; }
    .logo-badge { display: inline-block; background: #f59e0b; color: #0b1528; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 36px 32px; background: #ffffff; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
    .headline { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px; line-height: 1.3; }
    .card-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 13px; }
    .card-row:last-child { border-bottom: none; }
    .card-label { color: #64748b; font-weight: 600; }
    .card-value { color: #0f172a; font-weight: 700; text-align: right; }
    .btn { display: inline-block; background: #f59e0b; color: #0b1528; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 10px; text-align: center; margin: 20px 0 10px; box-shadow: 0 4px 14px rgba(245,158,11,0.3); }
    .footer { background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; }
    .footer a { color: #d97706; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="wrapper">
    <div class="header">
      <span class="logo-badge">Official Advisory</span>
      <h1>${BRAND.companyName}</h1>
      <p>${BRAND.tagline}</p>
    </div>
    <div class="content">
      ${badgeText ? `<span class="badge">${badgeText}</span>` : ''}
      <h2 class="headline">${headline}</h2>
      ${bodyHtml}
      ${ctaText && ctaLink ? `
      <div style="text-align: center;">
        <a href="${ctaLink}" class="btn" target="_blank">${ctaText} &rarr;</a>
      </div>` : ''}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px; font-weight: 700; color: #0f172a;">${BRAND.companyName} &bull; International Advisory Directorate</p>
      <p style="margin: 0 0 8px;">${BRAND.londonAddress}</p>
      <p style="margin: 0 0 8px;">Direct Advisory Helpline: <a href="tel:${BRAND.phone.replace(/[^0-9+]/g, '')}">${BRAND.phone}</a> | <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
      <p style="margin: 12px 0 0; font-size: 10px; color: #94a3b8;">&copy; 2026 ${BRAND.companyName}. All rights reserved. Confidential student correspondence under GDPR compliance.</p>
    </div>
  </div>
</body>
</html>
`;
}

// 1. Send Appointment Confirmation Email to Student
export async function sendAppointmentConfirmation({
  fullName,
  email,
  consultationType,
  preferredDate,
  preferredTime,
  targetCountry,
  meetingLink,
  meetingMode,
  format,
}: {
  fullName: string;
  email: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  targetCountry?: string;
  meetingLink?: string;
  meetingMode?: 'video' | 'in_person';
  format?: string;
}) {
  try {
    const { transporter, from, replyTo } = await getTransporter();

    const isOffice = meetingMode === 'in_person';
    const videoLink = meetingLink || 'https://meet.google.com/aur-aglb-edu';

    const bodyHtml = `
      <p style="font-size: 15px; color: #334155;">Dear <strong>${fullName}</strong>,</p>
      <p style="font-size: 14px; color: #475569;">
        Thank you for scheduling your higher education consultation with <strong>FCC Global Education</strong>. We have confirmed your strategy appointment with our senior international admissions counselor.
      </p>

      <div class="card-box">
        <div class="card-row">
          <span class="card-label">Advisory Session</span>
          <span class="card-value">${consultationType}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Consultation Format</span>
          <span class="card-value" style="color: ${isOffice ? '#0284c7' : '#059669'}; font-weight: 800;">
            ${isOffice ? '🏢 In-Person Office Visit' : '📹 1-on-1 Online Video Call'}
          </span>
        </div>
        <div class="card-row">
          <span class="card-label">Scheduled Date</span>
          <span class="card-value">${preferredDate}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Time Window</span>
          <span class="card-value">${preferredTime} (UK / GMT)</span>
        </div>
        <div class="card-row">
          <span class="card-label">Target Destination</span>
          <span class="card-value">${targetCountry || 'Global / Multiple'}</span>
        </div>
        ${isOffice ? `
        <div class="card-row">
          <span class="card-label">Meeting Location</span>
          <span class="card-value">${BRAND.londonAddress}</span>
        </div>` : `
        <div class="card-row">
          <span class="card-label">Virtual Meeting Room</span>
          <span class="card-value"><a href="${videoLink}" style="color:#d97706; font-weight:700;">Google Meet Video Room</a></span>
        </div>`}
      </div>

      <h4 style="font-size: 14px; color: #0f172a; margin: 18px 0 8px;">What to prepare for your session:</h4>
      <ul style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 16px;">
        <li>Provisional academic transcripts & grade sheets (High School / Bachelors).</li>
        <li>English proficiency score report (IELTS / TOEFL / PTE) or medium of instruction certificate.</li>
        <li>List of preferred degree programs and destination queries.</li>
      </ul>
      <p style="font-size: 13px; color: #64748b;">
        If you need to reschedule or have immediate questions, reply directly to this email or contact us via WhatsApp at <strong style="color: #0f172a;">${BRAND.phone}</strong>.
      </p>
    `;

    const html = wrapHtmlEmail({
      previewText: `Confirmed: ${isOffice ? 'In-Office' : 'Video'} Consultation on ${preferredDate} at ${preferredTime}`,
      badgeText: isOffice ? 'In-Person Office Visit' : 'Video Call Confirmed',
      headline: 'Your Strategy Session is Booked',
      bodyHtml,
      ctaText: isOffice ? 'View Office Directions' : 'Join Video Consultation Room',
      ctaLink: isOffice ? 'https://maps.google.com/?q=Berkeley+Square+House+London' : videoLink,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: email,
      subject: `Confirmed: Your FCC Global Education Strategy Call on ${preferredDate} at ${preferredTime}`,
      html,
    });

    console.log(`[Email Sent] Appointment confirmation to ${email} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.warn('[Mailer Warning] Could not send appointment confirmation email:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// 2. Send Lead / Inquiry Reply Email from Admin to Student
export async function sendLeadReplyEmail({
  to,
  studentName,
  subject,
  replyMessage,
  originalMessage,
  counselorName,
}: {
  to: string;
  studentName: string;
  subject: string;
  replyMessage: string;
  originalMessage?: string;
  counselorName?: string;
}) {
  try {
    const { transporter, from, replyTo } = await getTransporter();

    const formattedReply = replyMessage.replace(/\n/g, '<br />');

    const bodyHtml = `
      <p style="font-size: 15px; color: #334155;">Dear <strong>${studentName}</strong>,</p>
      
      <div style="font-size: 14px; color: #1e293b; line-height: 1.7; margin: 18px 0;">
        ${formattedReply}
      </div>

      ${originalMessage ? `
      <div style="background: #f8fafc; border-left: 3px solid #cbd5e1; padding: 12px 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Your Original Inquiry:</span>
        <p style="margin: 6px 0 0; font-size: 13px; color: #64748b; font-style: italic;">
          "${originalMessage}"
        </p>
      </div>` : ''}

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">${counselorName || 'Senior International Admissions Advisor'}</p>
        <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">FCC Global Education Consultants &bull; London & Global Centers</p>
      </div>
    `;

    const html = wrapHtmlEmail({
      previewText: `Response to your inquiry from FCC Global Education`,
      badgeText: 'Official Response',
      headline: subject || 'Response to Your Admissions Inquiry',
      bodyHtml,
      ctaText: 'Schedule a Free 1-on-1 Consultation',
      ctaLink: `${BRAND.websiteUrl}/book-appointment`,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to,
      subject: subject || `Re: Your Inquiry with FCC Global Education`,
      html,
    });

    console.log(`[Email Sent] Lead reply sent to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.warn('[Mailer Warning] Could not send lead reply email:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// 3. Send 1-Click Mass Broadcast Campaign Email to Subscribers
export async function sendBroadcastEmail({
  toEmails,
  subject,
  campaignTitle,
  messageBody,
  ctaText,
  ctaLink,
}: {
  toEmails: string[];
  subject: string;
  campaignTitle: string;
  messageBody: string;
  ctaText?: string;
  ctaLink?: string;
}) {
  try {
    const { transporter, from, replyTo } = await getTransporter();

    const formattedBody = messageBody.replace(/\n/g, '<br />');

    const bodyHtml = `
      <div style="font-size: 14px; color: #1e293b; line-height: 1.7; margin: 18px 0;">
        ${formattedBody}
      </div>
    `;

    const html = wrapHtmlEmail({
      previewText: subject,
      badgeText: 'Special Announcement',
      headline: campaignTitle || subject,
      bodyHtml,
      ctaText: ctaText || 'Explore Opportunities',
      ctaLink: ctaLink || 'http://localhost:3000',
    });

    // Send in batches or BCC to respect privacy
    const results = {
      total: toEmails.length,
      sent: 0,
      failed: 0,
    };

    // Filter valid emails
    const validEmails = toEmails.filter((e) => e && e.includes('@'));

    for (const recipient of validEmails) {
      try {
        await transporter.sendMail({
          from,
          replyTo,
          to: recipient,
          subject,
          html,
        });
        results.sent++;
      } catch (err) {
        console.warn(`[Broadcast Email Failed] To: ${recipient}`, err);
        results.failed++;
      }
    }

    console.log(`[Broadcast Completed] Sent: ${results.sent}/${results.total}`);
    return { success: true, results };
  } catch (err: any) {
    console.error('[Broadcast Error]', err);
    return { success: false, error: err?.message };
  }
}

// 4. Send Newsletter Welcome Email
export async function sendNewsletterWelcomeEmail(toEmail: string) {
  try {
    const { transporter, from, replyTo } = await getTransporter();

    const bodyHtml = `
      <p style="font-size: 15px; color: #334155;">Hello,</p>
      <p style="font-size: 14px; color: #475569;">
        Welcome to the <strong>FCC Global Education Intelligence Digest</strong>! You are now subscribed to receive our bi-weekly updates covering:
      </p>
      <ul style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 16px;">
        <li>Exclusive 2026/2027 university scholarships & tuition fee waivers.</li>
        <li>UK Graduate Route, US STEM OPT, and Canadian PGWP visa policy briefings.</li>
        <li>Deadlines for Russell Group, Ivy League, Group of Eight, and German public universities.</li>
      </ul>
      <p style="font-size: 13px; color: #64748b;">
        Whenever you are ready to evaluate your transcripts or need fast-track offer letter guidance, our senior advisors are ready to assist you.
      </p>
    `;

    const html = wrapHtmlEmail({
      previewText: 'Welcome to FCC Global Education Insights',
      badgeText: 'Subscription Confirmed',
      headline: 'Welcome to Insider Admissions Intelligence',
      bodyHtml,
      ctaText: 'Book Free Profile Evaluation',
      ctaLink: `${BRAND.websiteUrl}/book-appointment`,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: toEmail,
      subject: 'Welcome to FCC Global Education Insights & Scholarship Alerts',
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.warn('[Mailer Warning] Could not send welcome email:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// 5. Send Live Test Email to verify GoDaddy / Custom Domain SMTP Settings
export async function sendTestEmail({
  toEmail,
  settings,
}: {
  toEmail: string;
  settings?: Partial<EmailSettings>;
}) {
  try {
    const { transporter, from, replyTo } = await getTransporter(settings);

    // Verify SMTP connection and credentials first
    await transporter.verify();

    const hostName = settings?.smtpHost || 'Configured Host';
    const portNum = settings?.smtpPort || 587;

    const bodyHtml = `
      <p style="font-size: 15px; color: #1e293b;">Dear Administrator,</p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        Congratulations! Your <strong>GoDaddy / Custom Domain SMTP configuration</strong> is successfully connected and authenticated.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Active SMTP Parameters:</div>
        <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; font-weight: 600;">SMTP Host:</td><td style="color: #0f172a; font-family: monospace;">${hostName}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: 600;">SMTP Port:</td><td style="color: #0f172a; font-family: monospace;">${portNum}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: 600;">Sender From:</td><td style="color: #0f172a;">${from}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: 600;">Test Recipient:</td><td style="color: #0f172a;">${toEmail}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: 600;">Verified At:</td><td style="color: #0f172a;">${new Date().toLocaleString('en-GB')}</td></tr>
        </table>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        All appointment confirmations, consultation reminders, student lead alerts, and mass broadcast campaigns will now be delivered reliably directly from your official custom domain.
      </p>
    `;

    const html = wrapHtmlEmail({
      previewText: '✅ GoDaddy / Custom SMTP Connection Verified',
      badgeText: 'SMTP Test Successful',
      headline: 'Email Server Verified & Ready! 🚀',
      bodyHtml,
      ctaText: 'Open Admin Dashboard',
      ctaLink: `${BRAND.websiteUrl}/admin`,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: toEmail,
      subject: `✅ FCC Global Education — GoDaddy / Custom SMTP Test Successful`,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: `Test email successfully dispatched to ${toEmail}!`,
    };
  } catch (err: any) {
    console.error('[SMTP Test Email Failure]:', err);
    return {
      success: false,
      error: err?.message || 'SMTP Connection Failed. Please double check Host, Port, Username and Password.',
      code: err?.code,
    };
  }
}

