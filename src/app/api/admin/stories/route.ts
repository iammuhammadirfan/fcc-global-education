import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SuccessStory } from '@/lib/types';

export async function GET() {
  const successStories = (await db.getTable('successStories')) || [];
  return NextResponse.json({ success: true, stories: successStories, successStories });
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
    const studentName = body.studentName || body.name;
    const country = body.country;
    const university = body.university;

    if (!studentName || !university || !country) {
      return NextResponse.json({ error: 'Name, university, and country are required' }, { status: 400 });
    }

    const successStories = (await db.getTable('successStories')) || [];
    const isWoman = body.gender === 'woman' || body.gender === 'female';
    const defaultDummy = isWoman
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
    const studentPhoto = body.studentPhoto || body.image || defaultDummy;
    const visaResult = body.visaResult || body.visaGrantTime || 'Visa Approved';
    const scholarship = body.scholarship || body.scholarshipAmount || '';

    const newStory: SuccessStory = {
      id: body.id || `story_${Date.now()}`,
      studentName,
      name: studentName,
      studentPhoto,
      image: studentPhoto,
      previousEducation: body.previousEducation || 'Bachelor Degree',
      cgpa: body.cgpa || '',
      country,
      countrySlug: resolveCountrySlug(country),
      university,
      universitySlug: body.universitySlug || university.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      program: body.program || 'Admitted Degree Program',
      degreeLevel: body.degreeLevel || 'Masters',
      visaResult,
      visaGrantTime: visaResult,
      visaGrantedDate: body.visaGrantedDate || 'Recent',
      intake: body.intake || 'Fall 2025',
      scholarshipAmount: scholarship,
      scholarship: scholarship,
      testimonial: body.testimonial || '',
      quote: body.quote || body.testimonial || '',
      rating: Number(body.rating) || 5,
      gender: body.gender || (isWoman ? 'woman' : 'man'),
      featured: Boolean(body.featured),
      published: body.published !== false,
      videoUrl: body.videoUrl || '',
    };

    successStories.unshift(newStory);
    await db.updateTable('successStories', successStories);

    return NextResponse.json({ success: true, story: newStory });
  } catch {
    return NextResponse.json({ error: 'Failed to create success story' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const stories = (await db.getTable('successStories')) || [];
    const index = stories.findIndex((s: any) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const studentName = body.studentName || body.name || stories[index].studentName || stories[index].name;
    const studentPhoto = body.studentPhoto || body.image || stories[index].studentPhoto || stories[index].image;
    const visaResult = body.visaResult || body.visaGrantTime || stories[index].visaResult || stories[index].visaGrantTime;
    const scholarship = body.scholarship || body.scholarshipAmount || stories[index].scholarship || stories[index].scholarshipAmount || '';

    stories[index] = {
      ...stories[index],
      ...body,
      studentName,
      name: studentName,
      studentPhoto,
      image: studentPhoto,
      visaResult,
      visaGrantTime: visaResult,
      scholarship,
      scholarshipAmount: scholarship,
    };

    await db.updateTable('successStories', stories);

    return NextResponse.json({ success: true, story: stories[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let stories = await db.getTable('successStories');
    stories = stories.filter((s) => s.id !== id);
    await db.updateTable('successStories', stories);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
