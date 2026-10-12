import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { University } from '@/lib/types';

export async function GET() {
  const universities = await db.getTable('universities');
  return NextResponse.json({ success: true, universities });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug || !body.country) {
      return NextResponse.json({ error: 'Name, slug, and country are required' }, { status: 400 });
    }

    const universities = await db.getTable('universities');
    const existing = universities.find((u) => u.slug.toLowerCase() === body.slug.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'A university with this slug already exists' }, { status: 400 });
    }

    const newUniversity: any = {
      id: body.id || body.slug.toLowerCase(),
      slug: body.slug.toLowerCase(),
      name: body.name,
      country: body.country,
      countrySlug: body.countrySlug || body.country.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      city: body.city || 'Campus City',
      worldRank: Number(body.worldRank) || 50,
      rankingBadge: body.rankingBadge || `QS World #${body.worldRank || 50}`,
      acceptanceRate: body.acceptanceRate || '65%',
      logo: body.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200',
      image: body.image || body.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      overview: body.overview || body.description || `${body.name} is a leading institution renowned for its academic excellence.`,
      tuition: body.tuition || {
        undergraduate: body.tuitionUg || '$25,000 / year',
        postgraduate: body.tuitionPg || '$28,000 / year',
      },
      livingCostEstimate: body.livingCostEstimate || '$1,200 / month',
      popularPrograms: Array.isArray(body.popularPrograms)
        ? body.popularPrograms
        : (typeof body.popularPrograms === 'string' ? body.popularPrograms.split(',').map((s: string) => s.trim()).filter(Boolean) : ['Computer Science', 'Business Administration']),
      highlights: Array.isArray(body.highlights)
        ? body.highlights
        : (typeof body.highlights === 'string' ? body.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean) : ['Top-ranked faculty', 'High graduate employability']),
      entryRequirements: typeof body.entryRequirements === 'object' && body.entryRequirements !== null
        ? body.entryRequirements
        : {
            academic: body.entryAcademic || 'Minimum 70% or 3.0+ GPA in prior academics.',
            english: body.entryEnglish || 'IELTS 6.5 overall (no band less than 6.0).',
            standardizedTests: body.entryStandardized || '',
          },
      scholarships: Array.isArray(body.scholarships) && body.scholarships.length > 0
        ? body.scholarships
        : typeof body.scholarships === 'string' && body.scholarships.trim() !== ''
        ? [{ title: 'International Merit Scholarship', amount: 'Partial Tuition', eligibility: body.scholarships, deadline: 'Rolling' }]
        : [
            {
              title: 'International Student Excellence Award',
              amount: 'Up to $10,000 fee deduction',
              deadline: 'May 31',
              eligibility: 'Merit-based for international students.',
            },
          ],
      intakes: Array.isArray(body.intakes) ? body.intakes : ['September / Fall'],
      officialRep: body.officialRep !== undefined ? Boolean(body.officialRep) : true,
      featured: Boolean(body.featured),
      published: body.published !== undefined ? Boolean(body.published) : true,
      website: body.website || '',
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
    };

    universities.unshift(newUniversity);
    await db.updateTable('universities', universities);

    return NextResponse.json({ success: true, university: newUniversity });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create university' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, id } = body;

    if (!slug && !id) {
      return NextResponse.json({ error: 'University slug or id is required' }, { status: 400 });
    }

    const universities = await db.getTable('universities');
    const index = universities.findIndex(
      (u) => (id && u.id === id) || (slug && u.slug?.toLowerCase() === slug?.toLowerCase())
    );

    if (index === -1) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    const existing = universities[index];
    const updatedUni: any = {
      ...existing,
      ...body,
      countrySlug: body.countrySlug || (body.country ? body.country.toLowerCase().replace(/[^a-z0-9]+/g, '-') : existing.countrySlug),
      image: body.image || body.coverImage || existing.image,
      overview: body.overview || body.description || existing.overview,
      tuition: body.tuition || existing.tuition,
      livingCostEstimate: body.livingCostEstimate !== undefined ? body.livingCostEstimate : existing.livingCostEstimate,
      highlights: body.highlights !== undefined ? body.highlights : existing.highlights,
      entryRequirements: body.entryRequirements !== undefined ? body.entryRequirements : existing.entryRequirements,
      scholarships: body.scholarships !== undefined ? body.scholarships : existing.scholarships,
      popularPrograms: body.popularPrograms !== undefined ? body.popularPrograms : existing.popularPrograms,
    };

    universities[index] = updatedUni;
    await db.updateTable('universities', universities);

    return NextResponse.json({ success: true, university: universities[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update university' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('slug') || searchParams.get('id');

    if (!target) {
      return NextResponse.json({ error: 'University slug or id is required' }, { status: 400 });
    }

    let universities = await db.getTable('universities');
    universities = universities.filter(
      (u) => u.slug?.toLowerCase() !== target.toLowerCase() && u.id !== target
    );
    await db.updateTable('universities', universities);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete university' }, { status: 500 });
  }
}
