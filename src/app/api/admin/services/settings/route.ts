import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = (await db.getTable('servicesPageSettings')) || {};
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch services settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('servicesPageSettings', body);
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save services settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('servicesPageSettings', body);
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update services settings' }, { status: 500 });
  }
}
