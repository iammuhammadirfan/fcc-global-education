import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const homepage = await db.getTable('homepageSettings');
  return NextResponse.json({ success: true, homepage });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('homepageSettings', body);
    return NextResponse.json({ success: true, homepage: body });
  } catch {
    return NextResponse.json({ error: 'Failed to update homepage settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('homepageSettings', body);
    return NextResponse.json({ success: true, homepage: body });
  } catch {
    return NextResponse.json({ error: 'Failed to update homepage settings' }, { status: 500 });
  }
}
