import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = (await db.getTable('visaSuccessPageSettings')) || {};
    if (!settings.homepageRows) {
      const hp = (await db.getTable('homepageSettings')) || {};
      if (hp?.visaSuccessRows) {
        settings.homepageRows = hp.visaSuccessRows;
      }
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('visaSuccessPageSettings', body);
    if (body.homepageRows) {
      const hp = (await db.getTable('homepageSettings')) || {};
      hp.visaSuccessRows = body.homepageRows;
      await db.updateTable('homepageSettings', hp);
    }
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await db.updateTable('visaSuccessPageSettings', body);
    if (body.homepageRows) {
      const hp = (await db.getTable('homepageSettings')) || {};
      hp.visaSuccessRows = body.homepageRows;
      await db.updateTable('homepageSettings', hp);
    }
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save settings' }, { status: 500 });
  }
}
