import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Review } from '@/lib/types';
import { logActivity, getClientActor } from '@/lib/auditLogger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];
    return NextResponse.json({ success: true, reviews: allReviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, country, university, program, comment, status, published, showOnHome } = body;

    if (!name || !comment) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    const newReview: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: email ? String(email).trim().toLowerCase() : '',
      rating: Number(rating) || 5,
      country: country || 'International',
      countrySlug: country ? country.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'international',
      university: university || 'General',
      universitySlug: university ? university.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general',
      program: program || undefined,
      comment: String(comment).trim(),
      status: status || 'approved',
      published: published !== undefined ? Boolean(published) : true,
      showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : true,
      verifiedStudent: true,
      createdAt: new Date().toISOString(),
    };

    const allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];
    allReviews.unshift(newReview);
    await db.updateTable('reviews' as any, allReviews);

    const actor = getClientActor(request);
    await logActivity({
      action: 'create',
      entity: 'Review',
      entityId: newReview.id,
      entityTitle: `${newReview.name} (${newReview.university}, ${newReview.country})`,
      details: `New student review created with rating ${newReview.rating}/5`,
      userEmail: actor.userEmail,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create review' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];
    const index = allReviews.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const updated = {
      ...allReviews[index],
      ...body,
      countrySlug: body.country ? body.country.toLowerCase().replace(/[^a-z0-9]+/g, '-') : allReviews[index].countrySlug,
      universitySlug: body.university ? body.university.toLowerCase().replace(/[^a-z0-9]+/g, '-') : allReviews[index].universitySlug,
    };

    allReviews[index] = updated;
    await db.updateTable('reviews' as any, allReviews);

    const actor = getClientActor(request);
    await logActivity({
      action: 'update',
      entity: 'Review',
      entityId: updated.id,
      entityTitle: `${updated.name} (${updated.university})`,
      details: `Updated review status: ${updated.status}, homepage: ${updated.showOnHome}`,
      userEmail: actor.userEmail,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    let allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];
    const target = allReviews.find((r) => r.id === id);
    allReviews = allReviews.filter((r) => r.id !== id);
    await db.updateTable('reviews' as any, allReviews);

    const actor = getClientActor(request);
    await logActivity({
      action: 'delete',
      entity: 'Review',
      entityId: id,
      entityTitle: target ? `${target.name} (${target.university})` : id,
      details: `Deleted student review`,
      userEmail: actor.userEmail,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete review' }, { status: 500 });
  }
}
