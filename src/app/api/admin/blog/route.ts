import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BlogPost } from '@/lib/types';

export async function GET() {
  const blogPosts = await db.getTable('blogPosts');
  return NextResponse.json({ success: true, blogPosts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const blogPosts = await db.getTable('blogPosts');
    const existing = blogPosts.find((p) => p.slug.toLowerCase() === body.slug.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }

    const newPost: BlogPost = {
      id: `post_${Date.now()}`,
      slug: body.slug.toLowerCase().trim().replace(/\s+/g, '-'),
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      category: body.category || 'Study Abroad',
      author: body.author || {
        name: 'FCC Global Education Editorial Board',
        role: 'Senior Academic Counselor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: body.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: body.readTime || '5 min read',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      tags: body.tags || ['Study Abroad', 'Higher Education'],
      featured: Boolean(body.featured),
    };

    blogPosts.unshift(newPost);
    await db.updateTable('blogPosts', blogPosts);

    return NextResponse.json({ success: true, post: newPost });
  } catch {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug } = body;
    const blogPosts = await db.getTable('blogPosts');
    const index = blogPosts.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    blogPosts[index] = { ...blogPosts[index], ...body };
    await db.updateTable('blogPosts', blogPosts);

    return NextResponse.json({ success: true, post: blogPosts[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let blogPosts = await db.getTable('blogPosts');
    blogPosts = blogPosts.filter((p) => p.slug.toLowerCase() !== slug.toLowerCase());
    await db.updateTable('blogPosts', blogPosts);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
