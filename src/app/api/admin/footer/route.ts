import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const footer = await db.getTable('footerSettings');
  return NextResponse.json({ success: true, footer });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('footerSettings', body);
    return NextResponse.json({ success: true, footer: body });
  } catch {
    return NextResponse.json({ error: 'Failed to update footer' }, { status: 500 });
  }
}
