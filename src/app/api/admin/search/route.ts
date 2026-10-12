import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    if (!q) {
      return NextResponse.json({ success: true, results: [] });
    }

    const leads = await db.getTable('leads');
    const appointments = await db.getTable('appointments');
    const countries = await db.getTable('countries');
    const universities = await db.getTable('universities');
    const stories = await db.getTable('successStories');

    const results: Array<{
      type: string;
      title: string;
      subtitle: string;
      url: string;
    }> = [];

    // Search Leads
    (leads || [])
      .filter((l) => (l.fullName || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.targetCountry || '').toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((l) => {
        results.push({
          type: 'Lead',
          title: l.fullName || 'Lead',
          subtitle: `${l.email || ''} • Target: ${l.targetCountry || 'General'}`,
          url: '/admin/leads',
        });
      });

    // Search Appointments
    (appointments || [])
      .filter((a) => (a.fullName || a.studentName || '').toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((a) => {
        results.push({
          type: 'Appointment',
          title: a.fullName || a.studentName || 'Student',
          subtitle: `${a.preferredDate || a.date || 'Upcoming'} (${a.status})`,
          url: '/admin/appointments',
        });
      });

    // Search Countries
    (countries || [])
      .filter((c) => (c.name || '').toLowerCase().includes(q) || (c.region && c.region.toLowerCase().includes(q)))
      .slice(0, 3)
      .forEach((c) => {
        results.push({
          type: 'Country',
          title: `${c.flag || '🌍'} ${c.name}`,
          subtitle: `Study in ${c.name}`,
          url: '/admin/countries',
        });
      });

    // Search Universities
    (universities || [])
      .filter((u) => (u.name || '').toLowerCase().includes(q) || (u.city || '').toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((u) => {
        results.push({
          type: 'University',
          title: u.name,
          subtitle: `${u.city || ''}, ${u.country || ''}`,
          url: '/admin/universities',
        });
      });

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('Search error:', err);
    return NextResponse.json({ error: err?.message || 'Search failed' }, { status: 500 });
  }
}
