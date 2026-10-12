import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Service } from '@/lib/types';

function parseStringList(val: any): string[] {
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    return val
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET() {
  try {
    const rawServices: any[] = (await db.getTable('services')) || [];
    const services = rawServices.map((s, index) => ({
      id: s.id || s.slug,
      slug: s.slug,
      title: s.title,
      shortDesc: s.shortDesc || s.shortDescription || '',
      fullDesc: s.fullDesc || s.fullDescription || '',
      icon: s.icon || 'GraduationCap',
      benefits: Array.isArray(s.benefits) ? s.benefits : [],
      deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
      targetAudience: s.targetAudience || 'All international students',
      turnaroundTime: s.turnaroundTime || s.turnaround || '3–5 business days',
      sortOrder: s.sortOrder !== undefined ? Number(s.sortOrder) : (s.order !== undefined ? Number(s.order) : index + 1),
      active: s.active !== undefined ? Boolean(s.active) : true,
    })).sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const cleanSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const services: any[] = (await db.getTable('services')) || [];

    const existingIndex = services.findIndex(
      (s) => s.slug?.toLowerCase() === cleanSlug || s.id === (body.id || cleanSlug)
    );
    if (existingIndex !== -1) {
      return NextResponse.json({ error: 'A service with this slug or ID already exists' }, { status: 409 });
    }

    const newService: Service = {
      id: body.id || cleanSlug,
      slug: cleanSlug,
      title: body.title.trim(),
      shortDesc: body.shortDesc || body.shortDescription || '',
      fullDesc: body.fullDesc || body.fullDescription || body.shortDesc || body.shortDescription || '',
      icon: body.icon?.trim() || 'GraduationCap',
      benefits: parseStringList(body.benefits),
      deliverables: parseStringList(body.deliverables),
      targetAudience: body.targetAudience?.trim() || 'All international students',
      turnaroundTime: body.turnaroundTime || body.turnaround || '3–5 business days',
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : (body.order !== undefined ? Number(body.order) : services.length + 1),
      active: body.active !== undefined ? Boolean(body.active) : true,
    };

    services.push(newService);
    await db.updateTable('services', services);

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const services: any[] = (await db.getTable('services')) || [];

    const index = services.findIndex((s) => {
      if (body.id && s.id === body.id) return true;
      if (body.originalSlug && s.slug?.toLowerCase() === body.originalSlug.toLowerCase()) return true;
      if (body.slug && s.slug?.toLowerCase() === body.slug.toLowerCase()) return true;
      return false;
    });

    if (index === -1) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const current = services[index];
    const cleanSlug = (body.slug || current.slug).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    const updatedService: any = {
      ...current,
      id: body.id || current.id,
      slug: cleanSlug,
      title: body.title !== undefined ? body.title.trim() : current.title,
      shortDesc: body.shortDesc !== undefined ? body.shortDesc : (body.shortDescription !== undefined ? body.shortDescription : current.shortDesc),
      fullDesc: body.fullDesc !== undefined ? body.fullDesc : (body.fullDescription !== undefined ? body.fullDescription : current.fullDesc),
      icon: body.icon !== undefined ? body.icon.trim() : current.icon,
      benefits: body.benefits !== undefined ? parseStringList(body.benefits) : current.benefits,
      deliverables: body.deliverables !== undefined ? parseStringList(body.deliverables) : current.deliverables,
      targetAudience: body.targetAudience !== undefined ? body.targetAudience.trim() : current.targetAudience,
      turnaroundTime: body.turnaroundTime !== undefined ? body.turnaroundTime : (body.turnaround !== undefined ? body.turnaround : current.turnaroundTime),
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : (body.order !== undefined ? Number(body.order) : current.sortOrder),
      active: body.active !== undefined ? Boolean(body.active) : current.active,
    };

    services[index] = updatedService;
    await db.updateTable('services', services);

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Service ID or Slug is required' }, { status: 400 });
    }

    let services: any[] = (await db.getTable('services')) || [];
    const prevCount = services.length;

    services = services.filter((s) => {
      if (id && s.id === id) return false;
      if (slug && s.slug?.toLowerCase() === slug.toLowerCase()) return false;
      return true;
    });

    if (services.length === prevCount) {
      return NextResponse.json({ error: 'Service not found to delete' }, { status: 404 });
    }

    await db.updateTable('services', services);

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete service' }, { status: 500 });
  }
}
