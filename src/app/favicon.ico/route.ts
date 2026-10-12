import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const generalSettings = (await db.getTable('generalSettings')) || {};
    const logoUrl = generalSettings.faviconUrl || generalSettings.logoUrl;
    if (logoUrl && logoUrl.trim() !== '') {
      // If relative URL, resolve against host
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const target = logoUrl.startsWith('http') ? logoUrl : `${protocol}://${host}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
      return NextResponse.redirect(target, 307);
    }
  } catch (e) {
    console.error('Favicon route error:', e);
  }
  return new NextResponse(null, { status: 404 });
}
