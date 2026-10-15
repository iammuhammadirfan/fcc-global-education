import { NextResponse } from 'next/server';
import { db, addSubscriber } from '@/lib/db';
import { Subscriber, BroadcastCampaign } from '@/lib/types';
import { sendBroadcastEmail } from '@/lib/mailer';

// Auto-sync existing leads and appointments into subscribers on GET (skipping deleted ones)
async function syncExistingContacts(subscribers: Subscriber[]) {
  const subscriberMap = new Map<string, Subscriber>();
  subscribers.forEach((s) => subscriberMap.set(s.email.toLowerCase(), s));
  let hasChanges = false;

  try {
    const deletedList: string[] = ((await db.getTable('deletedSubscribers')) || []).map((e: string) =>
      e.toLowerCase()
    );

    // 1. Sync from appointments
    const appointments = (await db.getTable('appointments')) || [];
    for (const apt of appointments) {
      const cleanEmail = apt.email?.trim().toLowerCase();
      if (cleanEmail && cleanEmail.includes('@') && !deletedList.includes(cleanEmail)) {
        const phone = apt.phone || apt.whatsapp || undefined;
        const name = apt.fullName || apt.studentName || undefined;

        if (!subscriberMap.has(cleanEmail)) {
          const newSub: Subscriber = {
            id: `sub_apt_${apt.id || Date.now()}`,
            email: cleanEmail,
            name,
            phone,
            source: 'appointment',
            status: 'active',
            subscribedAt: apt.createdAt || new Date().toISOString(),
          };
          subscriberMap.set(cleanEmail, newSub);
          subscribers.push(newSub);
          hasChanges = true;
        } else {
          const existing = subscriberMap.get(cleanEmail)!;
          if (phone && !existing.phone) {
            existing.phone = phone;
            hasChanges = true;
          }
          if (name && !existing.name) {
            existing.name = name;
            hasChanges = true;
          }
        }
      }
    }

    // 2. Sync from leads
    const leads = (await db.getTable('leads')) || [];
    for (const lead of leads) {
      const cleanEmail = lead.email?.trim().toLowerCase();
      if (cleanEmail && cleanEmail.includes('@') && !deletedList.includes(cleanEmail)) {
        const phone = lead.phone || undefined;
        const name = lead.fullName || undefined;

        if (!subscriberMap.has(cleanEmail)) {
          const newSub: Subscriber = {
            id: `sub_lead_${lead.id || Date.now()}`,
            email: cleanEmail,
            name,
            phone,
            source: 'contact',
            status: 'active',
            subscribedAt: lead.createdAt || new Date().toISOString(),
          };
          subscriberMap.set(cleanEmail, newSub);
          subscribers.push(newSub);
          hasChanges = true;
        } else {
          const existing = subscriberMap.get(cleanEmail)!;
          if (phone && !existing.phone) {
            existing.phone = phone;
            hasChanges = true;
          }
          if (name && !existing.name) {
            existing.name = name;
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      await db.updateTable('subscribers', subscribers);
    }
  } catch (err) {
    console.warn('[Sync Contacts Warning]:', err);
  }

  return subscribers;
}

// GET all subscribers & broadcast campaigns
export async function GET(request: Request) {
  try {
    let subscribers: Subscriber[] = (await db.getTable('subscribers')) || [];
    subscribers = await syncExistingContacts(subscribers);

    const campaigns: BroadcastCampaign[] = (await db.getTable('broadcastCampaigns')) || [];

    const stats = {
      total: subscribers.length,
      newsletter: subscribers.filter((s) => s.source === 'newsletter').length,
      appointment: subscribers.filter((s) => s.source === 'appointment').length,
      contact: subscribers.filter((s) => s.source === 'contact').length,
      manual: subscribers.filter((s) => s.source === 'manual').length,
    };

    const draft = (await db.getTable('broadcastDraft')) || null;

    return NextResponse.json({
      success: true,
      subscribers,
      campaigns,
      stats,
      draft,
    });
  } catch (error: any) {
    console.error('[Admin Broadcast GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch broadcast data.' }, { status: 500 });
  }
}

// POST: Add subscriber manually, save draft, OR send broadcast
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'send_broadcast';

    // Action 0: Save Campaign Composer Draft / Content
    if (action === 'save_draft') {
      const { subject, campaignTitle, messageBody, ctaText, ctaLink } = body;
      const draft = {
        subject: subject ?? '',
        campaignTitle: campaignTitle ?? '',
        messageBody: messageBody ?? '',
        ctaText: ctaText ?? '',
        ctaLink: ctaLink ?? '',
        updatedAt: new Date().toISOString(),
      };
      await db.updateTable('broadcastDraft', draft);
      return NextResponse.json({
        success: true,
        message: 'Broadcast draft and links saved successfully.',
        draft,
      });
    }

    // Action 1: Add subscriber manually
    if (action === 'add_subscriber') {
      const email = body.email?.trim().toLowerCase();
      const name = body.name?.trim();
      const phone = body.phone?.trim();

      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
      }

      const subscriber = await addSubscriber(email, name, 'manual', phone);
      return NextResponse.json({
        success: true,
        message: 'Subscriber added to audience.',
        subscriber,
      });
    }

    // Action 2: 1-Click Mass Broadcast Campaign
    if (action === 'send_broadcast') {
      const { subject, campaignTitle, messageBody, ctaText, ctaLink, testEmail } = body;

      if (!subject || !messageBody) {
        return NextResponse.json(
          { error: 'Email subject and message body are required.' },
          { status: 400 }
        );
      }

      // Auto-save the draft content whenever a broadcast is sent
      try {
        const draft = {
          subject,
          campaignTitle: campaignTitle || subject,
          messageBody,
          ctaText: ctaText || '',
          ctaLink: ctaLink || '',
          updatedAt: new Date().toISOString(),
        };
        await db.updateTable('broadcastDraft', draft);
      } catch (e) {
        console.warn('[Auto Save Draft Warning]:', e);
      }

      let recipients: string[] = [];

      if (testEmail && testEmail.includes('@')) {
        recipients = [testEmail.trim().toLowerCase()];
      } else {
        const subscribers: Subscriber[] = (await db.getTable('subscribers')) || [];
        recipients = Array.from(
          new Set(
            subscribers
              .filter((s) => s.status === 'active' && s.email && s.email.includes('@'))
              .map((s) => s.email.trim().toLowerCase())
          )
        );
      }

      if (recipients.length === 0) {
        return NextResponse.json(
          { error: 'No active subscribers found in the audience list.' },
          { status: 400 }
        );
      }

      // Send broadcast
      const sendResult = await sendBroadcastEmail({
        toEmails: recipients,
        subject,
        campaignTitle: campaignTitle || subject,
        messageBody,
        ctaText: ctaText || 'Explore Opportunities',
        ctaLink: ctaLink || 'https://fccglobaleducation.com',
      });

      // Record campaign if sent to audience
      let newCampaign: BroadcastCampaign | null = null;
      if (!testEmail) {
        const campaigns: BroadcastCampaign[] = (await db.getTable('broadcastCampaigns')) || [];
        newCampaign = {
          id: `camp_${Date.now()}`,
          subject,
          campaignTitle: campaignTitle || subject,
          messageBody,
          ctaText: ctaText || '',
          ctaLink: ctaLink || '',
          recipientCount: recipients.length,
          sentAt: new Date().toISOString(),
        };
        campaigns.unshift(newCampaign);
        await db.updateTable('broadcastCampaigns', campaigns);
      }

      return NextResponse.json({
        success: true,
        message: `Broadcast successfully dispatched to ${recipients.length} subscriber(s).`,
        result: sendResult,
        campaign: newCampaign,
      });
    }

    return NextResponse.json({ error: 'Invalid action requested.' }, { status: 400 });
  } catch (error: any) {
    console.error('[Admin Broadcast POST Error]:', error);
    return NextResponse.json({ error: error?.message || 'Operation failed.' }, { status: 500 });
  }
}

// DELETE: Remove subscriber(s) or campaign(s)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'subscriber';
    const id = searchParams.get('id');
    const idsParam = searchParams.get('ids');
    const all = searchParams.get('all') === 'true';

    // Parse JSON body if present
    let bodyIds: string[] | undefined;
    let bodyType: string | undefined;
    let bodyAll = false;
    try {
      const body = await request.json();
      if (body) {
        if (Array.isArray(body.ids)) bodyIds = body.ids;
        if (body.id) bodyIds = [body.id];
        if (body.type) bodyType = body.type;
        if (body.all) bodyAll = true;
      }
    } catch {}

    const targetType = bodyType || type;
    const isAll = all || bodyAll;

    // A. Handle Campaign Deletion
    if (targetType === 'campaign') {
      let campaigns: BroadcastCampaign[] = (await db.getTable('broadcastCampaigns')) || [];
      if (isAll) {
        campaigns = [];
      } else {
        const toDeleteIds: string[] = bodyIds || (idsParam ? idsParam.split(',').map(s => s.trim()) : (id ? [id] : []));
        if (toDeleteIds.length === 0) {
          return NextResponse.json({ error: 'Campaign ID or IDs required.' }, { status: 400 });
        }
        campaigns = campaigns.filter((c) => !toDeleteIds.includes(c.id));
      }
      await db.updateTable('broadcastCampaigns', campaigns);
      return NextResponse.json({ success: true, message: 'Campaign history updated.' });
    }

    // B. Handle Subscriber Deletion (Single or Bulk)
    let subscribers: Subscriber[] = (await db.getTable('subscribers')) || [];
    let toDeleteIds: string[] = bodyIds || (idsParam ? idsParam.split(',').map(s => s.trim()) : (id ? [id] : []));

    if (isAll) {
      toDeleteIds = subscribers.map((s) => s.id);
    }

    if (toDeleteIds.length === 0) {
      return NextResponse.json({ error: 'Subscriber ID(s) required.' }, { status: 400 });
    }

    // Find emails of deleted subscribers so we blacklist them from auto-sync
    const deletedEmails: string[] = subscribers
      .filter((s) => toDeleteIds.includes(s.id))
      .map((s) => s.email.trim().toLowerCase())
      .filter(Boolean);

    // Save into deletedSubscribers
    if (deletedEmails.length > 0) {
      const existingDeleted: string[] = (await db.getTable('deletedSubscribers')) || [];
      const updatedDeleted = Array.from(new Set([...existingDeleted, ...deletedEmails]));
      await db.updateTable('deletedSubscribers', updatedDeleted);
    }

    subscribers = subscribers.filter((s) => !toDeleteIds.includes(s.id));
    await db.updateTable('subscribers', subscribers);

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${toDeleteIds.length} subscriber(s).`,
      remaining: subscribers.length,
    });
  } catch (error: any) {
    console.error('[Admin Broadcast DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete record.' }, { status: 500 });
  }
}
