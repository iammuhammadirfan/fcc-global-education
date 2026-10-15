import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { University } from '@/lib/types';
import { logActivity, getClientActor } from '@/lib/auditLogger';

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

    const actor = await getClientActor(request);
    await logActivity({
      action: 'CREATE',
      entity: 'University',
      entityId: newUniversity.slug,
      details: `Added new university ${newUniversity.name} in ${newUniversity.country}`,
      userId: actor.userId,
      userName: actor.userName,
      userEmail: actor.userEmail,
      userRole: actor.userRole,
      ip: actor.ip,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({ success: true, university: newUniversity });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create university' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Support bulk reordering if requested
    if (body.action === 'reorder' && Array.isArray(body.items)) {
      const universities = await db.getTable('universities');
      const orderMap = new Map<string, number>();
      body.items.forEach((it: any) => {
        if (it.id) orderMap.set(String(it.id).toLowerCase(), Number(it.order));
        if (it.slug) orderMap.set(String(it.slug).toLowerCase(), Number(it.order));
      });

      const updated = universities.map((u) => {
        const customOrder = orderMap.get(u.id.toLowerCase()) ?? orderMap.get(u.slug.toLowerCase());
        if (customOrder !== undefined) {
          return { ...u, order: customOrder, sortOrder: customOrder };
        }
        return u;
      });

      // Sort by order ascending
      updated.sort((a, b) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999));
      await db.updateTable('universities', updated);
      return NextResponse.json({ success: true, universities: updated });
    }

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
    const numOrder = body.order !== undefined ? Number(body.order) : (body.sortOrder !== undefined ? Number(body.sortOrder) : undefined);

    const updatedUni: any = {
      ...existing,
      ...body,
      ...(numOrder !== undefined ? { order: numOrder, sortOrder: numOrder } : {}),
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

    const actor = await getClientActor(request);
    await logActivity({
      action: 'UPDATE',
      entity: 'University',
      entityId: updatedUni.slug,
      details: `Updated university details and curriculum/fees for ${updatedUni.name} (${updatedUni.country})`,
      userId: actor.userId,
      userName: actor.userName,
      userEmail: actor.userEmail,
      userRole: actor.userRole,
      ip: actor.ip,
      userAgent: actor.userAgent,
    });

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
    const targetUni = universities.find(
      (u) => u.slug?.toLowerCase() === target.toLowerCase() || u.id === target
    );
    universities = universities.filter(
      (u) => u.slug?.toLowerCase() !== target.toLowerCase() && u.id !== target
    );
    await db.updateTable('universities', universities);

    const actor = await getClientActor(request);
    await logActivity({
      action: 'DELETE',
      entity: 'University',
      entityId: target,
      details: `Deleted university ${targetUni ? targetUni.name : target} from database`,
      userId: actor.userId,
      userName: actor.userName,
      userEmail: actor.userEmail,
      userRole: actor.userRole,
      ip: actor.ip,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete university' }, { status: 500 });
  }
}
