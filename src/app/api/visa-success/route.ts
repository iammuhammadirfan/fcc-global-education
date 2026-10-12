import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const items = (await db.getTable('visaSuccess')) || [];
    const published = items.filter((it: any) => it.published !== false);
    return NextResponse.json({ success: true, items: published });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch visa success items' }, { status: 500 });
  }
}
