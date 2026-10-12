import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Country } from '@/lib/types';

export async function GET() {
  const countries = await db.getTable('countries');
  return NextResponse.json({ success: true, countries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const countries = await db.getTable('countries');
    const existing = countries.find((c) => c.slug.toLowerCase() === body.slug.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'A country with this slug already exists' }, { status: 400 });
    }

    const newCountry: Country = {
      id: body.slug.toLowerCase(),
      slug: body.slug.toLowerCase(),
      name: body.name,
      flag: body.flag || '🌍',
      code: body.code || 'GL',
      region: body.region || 'Europe',
      heroImage: body.heroImage || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
      tagline: body.tagline || `Study at Leading Universities in ${body.name}`,
      overview: body.overview || `Comprehensive higher education guidance for studying in ${body.name}.`,
      whyStudy: body.whyStudy || ['World-class university degrees', 'Post-study work rights', 'High quality of life'],
      popularCourses: body.popularCourses || ['Computer Science', 'Business & Management', 'Engineering'],
      averageTuition: body.averageTuition || '$15,000 – $30,000 / year',
      livingCosts: body.livingCosts || '$1,000 – $1,500 / month',
      currency: body.currency || 'USD ($)',
      intakes: body.intakes || ['Fall (September)', 'Spring (January)'],
      postStudyWork: body.postStudyWork || '2 Years Post-Study Work Visa',
      visaSuccessRate: body.visaSuccessRate || '98.5%',
      workWhileStudying: body.workWhileStudying || '20 hours/week during term-time',
      topUniversityNames: body.topUniversityNames || [],
      scholarshipsOverview: body.scholarshipsOverview || 'Government and university merit scholarships available.',
      visaRequirements: body.visaRequirements || ['Valid Passport', 'Admission Confirmation Letter', 'Proof of Financial Funds'],
      postStudyOpportunities: body.postStudyOpportunities || ['Transition to skilled worker visas', 'Multinational job recruitment'],
      applicationDeadlines: body.applicationDeadlines || 'Rolling admissions (4–6 months prior to intake)',
    };

    countries.unshift(newCountry);
    await db.updateTable('countries', countries);

    return NextResponse.json({ success: true, country: newCountry });
  } catch {
    return NextResponse.json({ error: 'Failed to create country' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Country slug is required' }, { status: 400 });
    }

    const countries = await db.getTable('countries');
    const index = countries.findIndex((c) => c.slug.toLowerCase() === slug.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    countries[index] = { ...countries[index], ...body };
    await db.updateTable('countries', countries);

    return NextResponse.json({ success: true, country: countries[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('slug') || searchParams.get('id');

    if (!identifier) {
      return NextResponse.json({ error: 'Country slug or ID is required to delete' }, { status: 400 });
    }

    const clean = identifier.toLowerCase().trim();
    let countries = (await db.getTable('countries')) || [];
    const beforeCount = countries.length;

    countries = countries.filter(
      (c) =>
        (!c.slug || c.slug.toLowerCase().trim() !== clean) &&
        (!c.id || String(c.id).toLowerCase().trim() !== clean)
    );

    if (countries.length === beforeCount) {
      return NextResponse.json({ error: `Country with identifier "${identifier}" not found in database` }, { status: 404 });
    }

    await db.updateTable('countries', countries);

    return NextResponse.json({ success: true, message: `Country "${identifier}" deleted successfully` });
  } catch (err: any) {
    console.error('Error deleting country:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete country' }, { status: 500 });
  }
}
