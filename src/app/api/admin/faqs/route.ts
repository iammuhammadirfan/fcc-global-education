import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FAQItem } from '@/lib/types';

export async function GET() {
  const faqs = await db.getTable('faqs');
  return NextResponse.json({ success: true, faqs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const faqs = await db.getTable('faqs');
    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      category: body.category || 'Admissions',
      question: body.question,
      answer: body.answer,
    };

    faqs.push(newFaq);
    await db.updateTable('faqs', faqs);

    return NextResponse.json({ success: true, faq: newFaq });
  } catch {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const faqs = await db.getTable('faqs');
    const index = faqs.findIndex((f) => f.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    faqs[index] = { ...faqs[index], ...body };
    await db.updateTable('faqs', faqs);

    return NextResponse.json({ success: true, faq: faqs[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let faqs = await db.getTable('faqs');
    faqs = faqs.filter((f) => f.id !== id);
    await db.updateTable('faqs', faqs);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
