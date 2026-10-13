import nodemailer from 'nodemailer';
import { db } from './db';
import { EmailSettings } from './types';

// Default Fallback FCC Global Education Branding
const BRAND = {
  companyName: 'FCC Global Education',
  tagline: 'Premier International Education & Visa Advisory',
  londonAddress: 'Berkeley Square House, Mayfair, London W1J 6BD, United Kingdom',
  phone: '+44 (0) 20 7946 0912',
  email: 'admissions@fccglobaleducation.com',
  websiteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://fccglobaleducation.com',
};

// Dynamically fetch general settings from Database (CMS)
export async function getBrandSettings() {
  try {
    const generalSettings: any = (await db.getTable('generalSettings')) || {};
    const websiteUrl =
      (generalSettings.websiteUrl || '').trim() ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://fccglobaleducation.com';

    const defaultLogo = `${websiteUrl.replace(/\/$/, '')}/uploads/FCC_Global_Education_Logo__1__1791178438060.png`;
    let logoUrl = (generalSettings.logoUrl || '').trim();
    if (logoUrl) {
      if (logoUrl.startsWith('/')) {
        // Relative URL -> convert to absolute URL so email clients like Gmail can load it
        logoUrl = `${websiteUrl.replace(/\/$/, '')}${logoUrl}`;
      }
    } else {
      logoUrl = defaultLogo;
    }

    const address = (generalSettings.address || '').trim() || BRAND.londonAddress;
    const googleMapsUrl =
      (generalSettings.googleMapsUrl || '').trim() ||
      (generalSettings.mapsUrl || '').trim() ||
      (address
        ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
        : 'https://maps.google.com/?q=Berkeley+Square+House+London');

    return {
      companyName: (generalSettings.companyName || '').trim() || BRAND.companyName,
      tagline: (generalSettings.tagline || '').trim() || BRAND.tagline,
      address,
      phone: (generalSettings.phone || '').trim() || BRAND.phone,
      whatsapp: (generalSettings.whatsapp || '').trim() || BRAND.phone,
      email: (generalSettings.email || '').trim() || BRAND.email,
      websiteUrl,
      logoUrl,
      googleMapsUrl,
    };
  } catch {
    return {
      companyName: BRAND.companyName,
      tagline: BRAND.tagline,
      address: BRAND.londonAddress,
      phone: BRAND.phone,
      whatsapp: BRAND.phone,
      email: BRAND.email,
      websiteUrl: BRAND.websiteUrl,
      logoUrl: `${BRAND.websiteUrl}/uploads/FCC_Global_Education_Logo__1__1791178438060.png`,
      googleMapsUrl: 'https://maps.google.com/?q=Berkeley+Square+House+London',
    };
  }
}

async function getTransporter(overrideSettings?: Partial<EmailSettings>) {
  const currentSettings: EmailSettings = (await db.getTable('emailSettings')) || ({} as any);
  const emailSettings: EmailSettings = { ...currentSettings, ...overrideSettings };
  const brand = await getBrandSettings();

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
          rejectUnauthorized: false,
        },
      }),
      from: `"${emailSettings.senderName || brand.companyName}" <${emailSettings.senderEmail || emailSettings.smtpUser || brand.email}>`,
      replyTo: emailSettings.replyToEmail || emailSettings.senderEmail || brand.email,
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
      from: `"${process.env.SMTP_FROM_NAME || brand.companyName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
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
    from: `"${brand.companyName}" <${brand.email}>`,
    replyTo: brand.email,
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
  ctaIcon = '📍',
  brand,
}: {
  previewText?: string;
  badgeText?: string;
  headline: string;
  bodyHtml: string;
  ctaText?: string;
  ctaLink?: string;
  ctaIcon?: string;
  brand?: {
    companyName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl: string;
    logoUrl?: string;
    googleMapsUrl?: string;
  };
}) {
  const company = brand?.companyName || BRAND.companyName;
  const tagline = brand?.tagline || BRAND.tagline;
  const address = brand?.address || BRAND.londonAddress;
  const phone = brand?.phone || BRAND.phone;
  const email = brand?.email || BRAND.email;
  const logo = brand?.logoUrl || '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${headline}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6; }
    .wrapper { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: #faf6ed; padding: 30px 28px 24px; text-align: center; border-bottom: 2px solid #e6d7ba; }
    .logo-badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border: 1px solid #fde68a; }
    .content { padding: 36px 32px; background: #ffffff; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; border: 1px solid #fde68a; }
    .headline { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px; line-height: 1.3; }
    .footer { background: #f8fafc; padding: 26px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6; }
    .footer a { color: #d97706; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  ${previewText ? `<div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <div class="wrapper" style="max-width: 620px; width: 100%; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; text-align: left;">
          
          <div class="header" style="background-color: #faf6ed; padding: 30px 28px 24px; text-align: center; border-bottom: 2px solid #e6d7ba;">
            ${logo ? `
              <div style="margin-bottom: 12px; text-align: center;">
                <img src="${logo}" alt="${company}" style="max-height: 56px; max-width: 260px; height: auto; width: auto; display: inline-block; border: 0; outline: none; text-decoration: none;" />
              </div>
            ` : `
              <div style="margin-bottom: 10px;">
                <span class="logo-badge" style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; border: 1px solid #fde68a;">Official Advisory</span>
              </div>
            `}
            <h1 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25;">${company}</h1>
            <p style="margin: 5px 0 0; color: #92400e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">${tagline}</p>
          </div>

          <div class="content" style="padding: 36px 32px; background: #ffffff;">
            ${badgeText ? `
              <div style="margin-bottom: 14px;">
                <span class="badge" style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #fde68a;">${badgeText}</span>
              </div>
            ` : ''}
            <h2 class="headline" style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px; line-height: 1.3;">${headline}</h2>
            ${bodyHtml}
            ${ctaText && ctaLink ? `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 28px auto 14px; text-align: center;">
              <tr>
                <td align="center" style="border-radius: 12px; background: #0b1528; border: 1.5px solid #f59e0b; box-shadow: 0 6px 18px rgba(11,21,40,0.25);">
                  <a href="${ctaLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; color: #ffffff !important; text-decoration: none !important; border-radius: 12px; letter-spacing: 0.3px;">
                    <span style="color: #f59e0b; margin-right: 8px; font-size: 16px;">${ctaIcon}</span><span style="color: #ffffff !important; text-decoration: none !important;">${ctaText}</span><span style="color: #f59e0b; margin-left: 8px; font-size: 16px;">&rarr;</span>
                  </a>
                </td>
              </tr>
            </table>` : ''}
          </div>

          <div class="footer" style="background: #f8fafc; padding: 26px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
            <p style="margin: 0 0 6px; font-weight: 800; color: #0f172a; font-size: 13px;">${company} &bull; International Advisory Directorate</p>
            <p style="margin: 0 0 8px; color: #475569;">📍 ${address}</p>
            <p style="margin: 0 0 8px;">Direct Advisory Helpline: <a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color: #d97706; text-decoration: none; font-weight: 700;">${phone}</a> | <a href="mailto:${email}" style="color: #d97706; text-decoration: none; font-weight: 700;">${email}</a></p>
            <p style="margin: 14px 0 0; font-size: 11px; color: #94a3b8;">&copy; 2026 ${company}. All rights reserved. Confidential student correspondence under GDPR compliance.</p>
          </div>

        </div>
      </td>
    </tr>
  </table>
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
    const brand = await getBrandSettings();

    const isOffice = meetingMode === 'in_person';
    const videoLink = meetingLink || 'https://meet.google.com/aur-aglb-edu';

    const bodyHtml = `
      <p style="font-size: 15px; color: #334155; margin: 0 0 12px;">Dear <strong>${fullName}</strong>,</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px;">
        Thank you for scheduling your higher education consultation with <strong>${brand.companyName}</strong>. We have confirmed your strategy appointment with our senior international admissions counselor.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; margin: 20px 0; overflow: hidden;">
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; width: 40%; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Advisory Session
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; width: 60%; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${consultationType}
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Consultation Format
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: ${isOffice ? '#0284c7' : '#059669'}; font-weight: 800; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${isOffice ? '🏢 In-Person Office Visit' : '📹 1-on-1 Online Video Call'}
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Scheduled Date
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${preferredDate}
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Time Window
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${preferredTime} (UK / GMT)
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Target Destination
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${targetCountry || 'Global / Multiple'}
          </td>
        </tr>
        ${isOffice ? `
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: top;">
            Meeting Location
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; line-height: 1.5; vertical-align: top;">
            ${brand.address}
          </td>
        </tr>` : `
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: middle;">
            Virtual Meeting Room
          </td>
          <td style="padding: 13px 18px; font-size: 13px; text-align: right; vertical-align: middle;">
            <a href="${videoLink}" target="_blank" style="color: #d97706 !important; font-weight: 700; text-decoration: underline !important;">Join Google Meet Room</a>
          </td>
        </tr>`}
      </table>

      <h4 style="font-size: 14px; color: #0f172a; margin: 22px 0 8px; font-weight: 700;">What to prepare for your session:</h4>
      <ul style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 16px; line-height: 1.6;">
        <li>Provisional academic transcripts & grade sheets (High School / Bachelors).</li>
        <li>English proficiency score report (IELTS / TOEFL / PTE) or medium of instruction certificate.</li>
        <li>List of preferred degree programs and destination queries.</li>
      </ul>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        If you need to reschedule or have immediate questions, reply directly to this email or contact us via WhatsApp at <strong style="color: #0f172a;">${brand.phone}</strong>.
      </p>
    `;

    const html = wrapHtmlEmail({
      previewText: `Confirmed: ${isOffice ? 'In-Office' : 'Video'} Consultation on ${preferredDate} at ${preferredTime}`,
      badgeText: isOffice ? 'In-Person Office Visit' : 'Video Call Confirmed',
      headline: 'Your Strategy Session is Booked',
      bodyHtml,
      ctaText: isOffice ? 'View Office Directions on Google Maps' : 'Join Video Consultation Room',
      ctaLink: isOffice ? brand.googleMapsUrl : videoLink,
      ctaIcon: isOffice ? '📍' : '🎥',
      brand,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: email,
      subject: `Confirmed: Your ${brand.companyName} Strategy Call on ${preferredDate} at ${preferredTime}`,
      html,
    });

    console.log(`[Email Sent] Appointment confirmation to ${email} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.warn('[Mailer Warning] Could not send appointment confirmation email:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// 1b. Send Appointment Rescheduled Email to Student
export async function sendAppointmentRescheduledEmail({
  fullName,
  email,
  consultationType,
  oldDate,
  oldTime,
  newDate,
  newTime,
  targetCountry,
  meetingLink,
  meetingMode,
  rescheduleReason,
}: {
  fullName: string;
  email: string;
  consultationType: string;
  oldDate?: string;
  oldTime?: string;
  newDate: string;
  newTime: string;
  targetCountry?: string;
  meetingLink?: string;
  meetingMode?: 'video' | 'in_person';
  rescheduleReason?: string;
}) {
  try {
    const { transporter, from, replyTo } = await getTransporter();
    const brand = await getBrandSettings();

    const isOffice = meetingMode === 'in_person';
    const videoLink = meetingLink || 'https://meet.google.com/aur-aglb-edu';

    const bodyHtml = `
      <p style="font-size: 15px; color: #334155; margin: 0 0 12px;">Dear <strong>${fullName}</strong>,</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px;">
        Please note that your higher education admissions strategy consultation with <strong>${brand.companyName}</strong> has been <strong>rescheduled to a new time slot</strong>.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 18px; background-color: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 14px 18px;">
        <tr>
          <td>
            <div style="font-size: 12px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">
              🔄 Appointment Reschedule Notice
            </div>
            <div style="font-size: 13px; color: #1e3a8a; margin-top: 4px; line-height: 1.5;">
              Your consultation has been shifted to: <strong style="color: #0b1528;">${newDate} at ${newTime} (UK / GMT)</strong>.
            </div>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; margin: 18px 0; overflow: hidden;">
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; width: 40%; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Advisory Session
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; width: 60%; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${consultationType}
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            New Rescheduled Date
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #059669; font-weight: 800; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${newDate}
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            New Time Slot
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #059669; font-weight: 800; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${newTime} (UK / GMT)
          </td>
        </tr>
        ${oldDate ? `
        <tr>
          <td style="padding: 13px 18px; font-size: 12px; color: #94a3b8; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Previous Slot
          </td>
          <td style="padding: 13px 18px; font-size: 12px; color: #94a3b8; text-decoration: line-through; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${oldDate} ${oldTime ? `at ${oldTime}` : ''}
          </td>
        </tr>` : ''}
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Consultation Format
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: ${isOffice ? '#0284c7' : '#059669'}; font-weight: 800; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${isOffice ? '🏢 In-Person Office Visit' : '📹 1-on-1 Online Video Call'}
          </td>
        </tr>
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            Target Destination
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            ${targetCountry || 'Global / Multiple'}
          </td>
        </tr>
        ${isOffice ? `
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: top;">
            Meeting Location
          </td>
          <td style="padding: 13px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; line-height: 1.5; vertical-align: top;">
            ${brand.address}
          </td>
        </tr>` : `
        <tr>
          <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: middle;">
            Virtual Meeting Room
          </td>
          <td style="padding: 13px 18px; font-size: 13px; text-align: right; vertical-align: middle;">
            <a href="${videoLink}" target="_blank" style="color: #d97706 !important; font-weight: 700; text-decoration: underline !important;">Join Google Meet Room</a>
          </td>
        </tr>`}
      </table>

      ${rescheduleReason ? `
      <div style="background-color: #f8fafc; border-left: 3px solid #f59e0b; padding: 12px 16px; margin: 18px 0; border-radius: 0 8px 8px 0;">
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Note from Counselor:</span>
        <p style="margin: 6px 0 0; font-size: 13px; color: #334155; font-style: italic;">
          "${rescheduleReason}"
        </p>
      </div>` : ''}

      <p style="font-size: 13px; color: #64748b; margin: 18px 0 0; line-height: 1.6;">
        If this updated time slot does not suit you or if you need to choose an alternative date, please reply directly to this email or contact us via WhatsApp at <strong style="color: #0f172a;">${brand.phone}</strong>.
      </p>
    `;

    const html = wrapHtmlEmail({
      previewText: `Rescheduled: Your consultation is now on ${newDate} at ${newTime}`,
      badgeText: 'Slot Rescheduled',
      headline: 'Your Consultation Has Been Rescheduled',
      bodyHtml,
      ctaText: isOffice ? 'View Office Directions on Google Maps' : 'Join Video Consultation Room',
      ctaLink: isOffice ? brand.googleMapsUrl : videoLink,
      ctaIcon: isOffice ? '📍' : '🎥',
      brand,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: email,
      subject: `Rescheduled: Your ${brand.companyName} Strategy Call is now on ${newDate} at ${newTime}`,
      html,
    });

    console.log(`[Email Sent] Appointment reschedule notification to ${email} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.warn('[Mailer Warning] Could not send appointment rescheduled email:', err?.message || err);
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
    const brand = await getBrandSettings();

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
        <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">${brand.companyName.replace(/\s*Consultants\s*$/i, '')} Consultants &bull; Global Directorate</p>
      </div>
    `;

    const html = wrapHtmlEmail({
      previewText: `Response to your inquiry from ${brand.companyName}`,
      badgeText: 'Official Response',
      headline: subject || 'Response to Your Admissions Inquiry',
      bodyHtml,
      ctaText: 'Schedule a Free 1-on-1 Consultation',
      ctaLink: `${brand.websiteUrl}/book-appointment`,
      ctaIcon: '📅',
      brand,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to,
      subject: subject || `Re: Your Inquiry with ${brand.companyName}`,
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
    const brand = await getBrandSettings();

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
      ctaLink: ctaLink || brand.websiteUrl,
      ctaIcon: '🚀',
      brand,
    });

    const results = {
      total: toEmails.length,
      sent: 0,
      failed: 0,
    };

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
    const brand = await getBrandSettings();

    const bodyHtml = `
      <p style="font-size: 15px; color: #334155;">Hello,</p>
      <p style="font-size: 14px; color: #475569;">
        Welcome to the <strong>${brand.companyName} Intelligence Digest</strong>! You are now subscribed to receive our updates covering:
      </p>
      <ul style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 16px; line-height: 1.6;">
        <li>Exclusive 2026/2027 university scholarships & tuition fee waivers.</li>
        <li>UK Graduate Route, US STEM OPT, and Canadian PGWP visa policy briefings.</li>
        <li>Deadlines for Russell Group, Ivy League, Group of Eight, and European public universities.</li>
      </ul>
      <p style="font-size: 13px; color: #64748b;">
        Whenever you are ready to evaluate your transcripts or need fast-track offer letter guidance, our senior advisors are ready to assist you.
      </p>
    `;

    const html = wrapHtmlEmail({
      previewText: `Welcome to ${brand.companyName} Insights`,
      badgeText: 'Subscription Confirmed',
      headline: 'Welcome to Insider Admissions Intelligence',
      bodyHtml,
      ctaText: 'Book Free Profile Evaluation',
      ctaLink: `${brand.websiteUrl}/book-appointment`,
      ctaIcon: '🎓',
      brand,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: toEmail,
      subject: `Welcome to ${brand.companyName} Insights & Scholarship Alerts`,
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
    const brand = await getBrandSettings();

    // Verify SMTP connection and credentials first
    await transporter.verify();

    const hostName = settings?.smtpHost || 'Configured Host';
    const portNum = settings?.smtpPort || 587;

    const bodyHtml = `
      <p style="font-size: 15px; color: #1e293b;">Dear Administrator,</p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        Congratulations! Your <strong>GoDaddy / Custom Domain SMTP configuration</strong> is successfully connected and authenticated.
      </p>
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Active SMTP Parameters:</div>
        <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
          <tr><td style="padding: 5px 0; font-weight: 600;">SMTP Host:</td><td style="color: #0f172a; font-family: monospace;">${hostName}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: 600;">SMTP Port:</td><td style="color: #0f172a; font-family: monospace;">${portNum}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: 600;">Sender From:</td><td style="color: #0f172a;">${from}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: 600;">Test Recipient:</td><td style="color: #0f172a;">${toEmail}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: 600;">Verified At:</td><td style="color: #0f172a;">${new Date().toLocaleString('en-GB')}</td></tr>
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
      ctaLink: `${brand.websiteUrl}/admin`,
      ctaIcon: '⚡',
      brand,
    });

    const info = await transporter.sendMail({
      from,
      replyTo,
      to: toEmail,
      subject: `✅ ${brand.companyName} — GoDaddy / Custom SMTP Test Successful`,
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
