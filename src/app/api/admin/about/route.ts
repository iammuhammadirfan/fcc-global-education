import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = (await db.getTable('aboutPageSettings')) || {};
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch about settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('aboutPageSettings', body);
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save about settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('aboutPageSettings', body);
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update about settings' }, { status: 500 });
  }
}
