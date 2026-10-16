import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const generalSettings = await db.getTable('generalSettings');
    const socialLinks = await db.getTable('socialLinks');
    const emailSettings = await db.getTable('emailSettings');
    const appointmentSettings = await db.getTable('appointmentSettings');
    const seoSettings = await db.getTable('seoSettings');
    const navigationSettings = await db.getTable('navigationSettings');

    if (type === 'navigation') {
      return NextResponse.json({
        success: true,
        navigation: navigationSettings,
        settings: { navigation: navigationSettings },
      });
    }

    if (type === 'seo') {
      return NextResponse.json({
        success: true,
        seo: seoSettings,
        settings: { seo: seoSettings },
      });
    }

    if (type === 'general') {
      return NextResponse.json({
        success: true,
        general: generalSettings,
        settings: { general: generalSettings },
      });
    }

    if (type === 'social') {
      return NextResponse.json({
        success: true,
        social: socialLinks,
        settings: { social: socialLinks },
      });
    }

    if (type === 'email') {
      return NextResponse.json({
        success: true,
        email: emailSettings,
        settings: { email: emailSettings },
      });
    }

    if (type === 'appointments') {
      return NextResponse.json({
        success: true,
        appointments: appointmentSettings,
        settings: { appointments: appointmentSettings },
      });
    }

    // Default / type=all
    return NextResponse.json({
      success: true,
      general: generalSettings,
      social: socialLinks,
      email: emailSettings,
      appointments: appointmentSettings,
      seo: seoSettings,
      navigation: navigationSettings,
      settings: {
        general: generalSettings,
        social: socialLinks,
        email: emailSettings,
        appointments: appointmentSettings,
        seo: seoSettings,
        navigation: navigationSettings,
      },
    });
  } catch (err: any) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

async function handleSaveSettings(request: Request) {
  try {
    const body = await request.json();
    const section = body.section || body.type;
    const data = body.data || body[section];

    if (!section || !data) {
      return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
    }

    if (section === 'general') {
      const current = await db.getTable('generalSettings');
      let mapUrl = (data.googleMapsUrl || '').trim();
      if (!mapUrl || mapUrl.includes('Berkeley') || mapUrl.includes('30+St+Mary+Axe') || mapUrl === 'https://maps.google.com' || mapUrl === 'https://maps.google.com/') {
        const addr = (data.address || current?.address || '').trim();
        if (addr) {
          mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
        }
      }
      await db.updateTable('generalSettings', {
        ...current,
        ...data,
        googleMapsUrl: mapUrl || data.googleMapsUrl || current?.googleMapsUrl,
      });
    } else if (section === 'navigation') {
      const current = await db.getTable('navigationSettings');
      await db.updateTable('navigationSettings', { ...current, ...data });
    } else if (section === 'social') {
      const current = await db.getTable('socialLinks');
      await db.updateTable('socialLinks', { ...current, ...data });
    } else if (section === 'email') {
      const current = await db.getTable('emailSettings');
      await db.updateTable('emailSettings', { ...current, ...data });
    } else if (section === 'appointments') {
      const current = await db.getTable('appointmentSettings');
      await db.updateTable('appointmentSettings', { ...current, ...data });
    } else if (section === 'seo') {
      const current = await db.getTable('seoSettings');
      await db.updateTable('seoSettings', { ...current, ...data });
    } else {
      return NextResponse.json({ error: 'Unknown settings section' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (err: any) {
    console.error('Settings save error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return handleSaveSettings(request);
}

export async function PUT(request: Request) {
  return handleSaveSettings(request);
}
