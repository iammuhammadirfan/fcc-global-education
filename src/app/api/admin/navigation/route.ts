import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const navigation = (await db.getTable('navigationSettings')) || {};
    return NextResponse.json({ success: true, navigation });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = (await db.getTable('navigationSettings')) || {};
    const updated = { ...current, ...body };
    await db.updateTable('navigationSettings', updated);
    return NextResponse.json({ success: true, navigation: updated });
  } catch (error) {
    console.error('Error updating navigation:', error);
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = (await db.getTable('navigationSettings')) || {};
    const updated = { ...current, ...body };
    await db.updateTable('navigationSettings', updated);
    return NextResponse.json({ success: true, navigation: updated });
  } catch (error) {
    console.error('Error updating navigation:', error);
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 });
  }
}
