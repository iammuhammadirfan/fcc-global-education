import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Review } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const university = searchParams.get('university');
    const home = searchParams.get('home');
    const country = searchParams.get('country');

    const allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];
    
    // Only return approved and published reviews to the public
    let filtered = allReviews.filter(
      (r) => r.status === 'approved' && r.published !== false
    );

    if (home === 'true') {
      filtered = filtered.filter((r) => r.showOnHome === true);
    }

    if (university) {
      const uLower = university.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.universitySlug?.toLowerCase() === uLower ||
          r.university?.toLowerCase() === uLower ||
          r.university?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === uLower
      );
    }

    if (country) {
      const cLower = country.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.countrySlug?.toLowerCase() === cLower ||
          r.country?.toLowerCase() === cLower ||
          r.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cLower
      );
    }

    return NextResponse.json({ success: true, reviews: filtered });
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
    const { name, email, rating, country, university, program, comment, gender, avatar, intake } = body;

    if (!name || !email || !rating || !comment) {
      return NextResponse.json(
        { error: 'Name, email, rating, and feedback comment are required.' },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const emailLower = String(email).trim().toLowerCase();
    const allReviews: Review[] = ((await db.getTable('reviews' as any)) as any) || [];

    // Check if a review already exists with this email (1 review per email rule)
    const existingReview = allReviews.find(
      (r) => r.email && r.email.toLowerCase().trim() === emailLower
    );
    if (existingReview) {
      return NextResponse.json(
        {
          error:
            'A review has already been submitted with this email address. Each student can only submit one review.',
        },
        { status: 400 }
      );
    }

    const isWoman = gender === 'woman' || gender === 'female';
    const defaultAvatar = isWoman
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

    const newReview: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: emailLower,
      rating: numericRating,
      country: country ? String(country).trim() : 'United Kingdom',
      countrySlug: resolveCountrySlug(country),
      university: university ? String(university).trim() : 'General Consultation',
      universitySlug: university ? String(university).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general',
      program: program ? String(program).trim() : undefined,
      comment: String(comment).trim(),
      gender: gender || 'man',
      avatar: avatar && String(avatar).trim() ? String(avatar).trim() : defaultAvatar,
      intake: intake && String(intake).trim() ? String(intake).trim() : 'Fall 2025',
      status: 'pending',
      published: false,
      showOnHome: false,
      verifiedStudent: false,
      createdAt: new Date().toISOString(),
    };

    allReviews.unshift(newReview);
    await db.updateTable('reviews' as any, allReviews);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully. It will be visible once approved by our administrators.',
      review: newReview,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit review' }, { status: 500 });
  }
}
