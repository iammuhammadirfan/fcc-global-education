import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'leads';
    const format = searchParams.get('format') || 'csv';

    if (type === 'leads') {
      const leads = await db.getTable('leads');
      if (format === 'json') {
        return NextResponse.json(leads);
      }
      // CSV format
      const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Target Country', 'Study Level', 'Status', 'Date'];
      const rows = leads.map((l) => [
        `"${l.id}"`,
        `"${l.fullName.replace(/"/g, '""')}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${l.targetCountry}"`,
        `"${l.studyLevel}"`,
        `"${l.status}"`,
        `"${l.createdAt}"`,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads_export_${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'appointments') {
      const appointments = await db.getTable('appointments');
      if (format === 'json') {
        return NextResponse.json(appointments);
      }
      const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Destination', 'Type', 'Date', 'Time', 'Status'];
      const rows = appointments.map((a) => [
        `"${a.id}"`,
        `"${a.fullName.replace(/"/g, '""')}"`,
        `"${a.email}"`,
        `"${a.phone}"`,
        `"${a.targetCountry}"`,
        `"${a.consultationType}"`,
        `"${a.preferredDate}"`,
        `"${a.preferredTime}"`,
        `"${a.status}"`,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="appointments_export_${Date.now()}.csv"`,
        },
      });
    }

    // Full system JSON backup
    const fullDb = db.getDb();
    return NextResponse.json(fullDb);
  } catch {
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}
