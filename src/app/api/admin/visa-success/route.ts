import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VisaSuccessItem } from '@/lib/types';

export async function GET() {
  try {
    const items = (await db.getTable('visaSuccess')) || [];
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch visa success items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.studentName || !body.country || !body.visaLetterImage) {
      return NextResponse.json(
        { error: 'Student name, country, and visa letter image are required' },
        { status: 400 }
      );
    }

    const items: VisaSuccessItem[] = (await db.getTable('visaSuccess')) || [];
    const showOnHome = body.showOnHomepage !== undefined ? Boolean(body.showOnHomepage) : false;

    if (showOnHome) {
      const currentHome = items.filter((it: VisaSuccessItem) => it.showOnHomepage === true);
      if (currentHome.length >= 10) {
        const oldest = currentHome[currentHome.length - 1];
        if (oldest) {
          oldest.showOnHomepage = false;
        }
      }
    }

    const newItem: VisaSuccessItem = {
      id: `visa_${Date.now()}`,
      studentName: body.studentName,
      studentPhoto: body.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      visaLetterImage: body.visaLetterImage,
      country: body.country,
      countryCode: body.countryCode || body.country.slice(0, 2).toUpperCase(),
      countrySlug: body.countrySlug || body.country.toLowerCase().replace(/\s+/g, '-'),
      university: body.university || 'Global University',
      program: body.program || 'Academic Degree Program',
      intake: body.intake || 'Fall 2026',
      visaType: body.visaType || `${body.country} Student Visa`,
      approvalDays: body.approvalDays || 'Approved in 7 Days',
      grantDate: body.grantDate || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      testimonial: body.testimonial || 'Visa granted smoothly with 100% precision!',
      featured: body.featured !== undefined ? body.featured : true,
      published: body.published !== undefined ? body.published : true,
      showOnHomepage: showOnHome,
      order: body.order !== undefined ? body.order : items.length + 1,
      createdAt: new Date().toISOString(),
    };

    items.unshift(newItem);
    await db.updateTable('visaSuccess', items);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create visa success record' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    const items: VisaSuccessItem[] = (await db.getTable('visaSuccess')) || [];
    const index = items.findIndex((it) => it.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Visa success record not found' }, { status: 404 });
    }

    // If enabling showOnHomepage and already 10, remove least recent
    if (updates.showOnHomepage === true) {
      const currentHome = items.filter((it) => it.id !== id && it.showOnHomepage === true);
      if (currentHome.length >= 10) {
        const oldest = currentHome[currentHome.length - 1];
        if (oldest) {
          oldest.showOnHomepage = false;
        }
      }
    }

    items[index] = {
      ...items[index],
      ...updates,
    };

    await db.updateTable('visaSuccess', items);

    return NextResponse.json({ success: true, item: items[index] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update visa success record' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    let items: VisaSuccessItem[] = (await db.getTable('visaSuccess')) || [];
    items = items.filter((it) => it.id !== id);

    await db.updateTable('visaSuccess', items);

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete record' }, { status: 500 });
  }
}
