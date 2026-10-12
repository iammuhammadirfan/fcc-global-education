import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CustomPage } from '@/lib/types';

export async function GET() {
  const customPages = await db.getTable('customPages');
  return NextResponse.json({ success: true, pages: customPages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const pages = await db.getTable('customPages');
    const newPage: CustomPage = {
      id: `page_${Date.now()}`,
      slug: body.slug.toLowerCase().trim().replace(/^\//, '').replace(/\s+/g, '-'),
      title: body.title,
      heroImage: body.heroImage,
      content: body.content || '',
      published: body.published !== undefined ? Boolean(body.published) : true,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      updatedAt: new Date().toISOString(),
    };

    pages.push(newPage);
    await db.updateTable('customPages', pages);

    return NextResponse.json({ success: true, page: newPage });
  } catch {
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug } = body;
    const pages = await db.getTable('customPages');
    const index = pages.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    pages[index] = { ...pages[index], ...body, updatedAt: new Date().toISOString() };
    await db.updateTable('customPages', pages);

    return NextResponse.json({ success: true, page: pages[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let pages = await db.getTable('customPages');
    pages = pages.filter((p) => p.slug.toLowerCase() !== slug.toLowerCase());
    await db.updateTable('customPages', pages);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
