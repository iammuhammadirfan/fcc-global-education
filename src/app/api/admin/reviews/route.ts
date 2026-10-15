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

const COUNTRY_SLUG_MAP: Record<string, string> = {
  'united kingdom': 'uk',
  'uk': 'uk',
  'great britain': 'uk',
  'england': 'uk',
  'united-kingdom': 'uk',
  'united states': 'usa',
  'united states of america': 'usa',
  'usa': 'usa',
  'us': 'usa',
  'united-states': 'usa',
  'canada': 'canada',
  'australia': 'australia',
  'germany': 'germany',
  'ireland': 'ireland',
  'malaysia': 'malaysia',
  'turkey': 'turkey',
  'cyprus': 'cyprus',
  'uae': 'uae',
  'united arab emirates': 'uae',
  'china': 'china',
  'italy': 'italy',
  'france': 'france',
  'new zealand': 'new-zealand',
};

function resolveCountrySlug(country?: string): string {
  if (!country) return 'uk';
  const key = country.toLowerCase().trim();
  if (COUNTRY_SLUG_MAP[key]) return COUNTRY_SLUG_MAP[key];
  return key.replace(/[^a-z0-9]+/g, '-') || 'uk';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, country, university, program, comment, status, published, showOnHome, gender, avatar, intake } = body;

    if (!name || !comment) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    const isWoman = gender === 'woman' || gender === 'female';
    const defaultAvatar = isWoman
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

    const newReview: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: email ? String(email).trim().toLowerCase() : '',
      rating: Number(rating) || 5,
      country: country || 'United Kingdom',
      countrySlug: resolveCountrySlug(country),
      university: university || 'General',
      universitySlug: university ? university.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general',
      program: program || undefined,
      comment: String(comment).trim(),
      status: status || 'approved',
      published: published !== undefined ? Boolean(published) : true,
      showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : true,
      gender: gender || 'man',
      avatar: avatar && String(avatar).trim() ? String(avatar).trim() : defaultAvatar,
      intake: intake && String(intake).trim() ? String(intake).trim() : 'Fall 2025',
      verifiedStudent: true,
      createdAt: new Date().toISOString(),
    };

    const allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];
    allReviews.unshift(newReview);
    await db.updateTable('reviews' as any, allReviews);

    const actor = await getClientActor(request);
    await logActivity({
      action: 'CREATE',
      entity: 'Review',
      entityId: newReview.id,
      details: `New student review created by ${newReview.name} (${newReview.university}, ${newReview.country}) with rating ${newReview.rating}/5`,
      userId: actor.userId,
      userName: actor.userName,
      userEmail: actor.userEmail,
      userRole: actor.userRole,
      ip: actor.ip,
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

    const isWoman = body.gender === 'woman' || body.gender === 'female';
    const defaultAvatar = isWoman
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

    const updated = {
      ...allReviews[index],
      ...body,
      gender: body.gender || allReviews[index].gender || 'man',
      avatar: body.avatar && String(body.avatar).trim() ? String(body.avatar).trim() : (allReviews[index].avatar || defaultAvatar),
      intake: body.intake && String(body.intake).trim() ? String(body.intake).trim() : (allReviews[index].intake || 'Fall 2025'),
      countrySlug: body.country ? resolveCountrySlug(body.country) : allReviews[index].countrySlug,
      universitySlug: body.university ? body.university.toLowerCase().replace(/[^a-z0-9]+/g, '-') : allReviews[index].universitySlug,
    };

    allReviews[index] = updated;
    await db.updateTable('reviews' as any, allReviews);

    const actor = await getClientActor(request);
    await logActivity({
      action: 'UPDATE',
      entity: 'Review',
      entityId: updated.id,
      details: `Updated review for ${updated.name} (${updated.university}). Status: ${updated.status}, homepage: ${updated.showOnHome}`,
      userId: actor.userId,
      userName: actor.userName,
      userEmail: actor.userEmail,
      userRole: actor.userRole,
      ip: actor.ip,
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

    const actor = await getClientActor(request);
    await logActivity({
      action: 'DELETE',
      entity: 'Review',
      entityId: id,
      details: `Deleted student review by ${target ? target.name : id}`,
      userId: actor.userId,
      userName: actor.userName,
      userEmail: actor.userEmail,
      userRole: actor.userRole,
      ip: actor.ip,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete review' }, { status: 500 });
  }
}
