import { NextResponse } from 'next/server';
import { db, addSubscriber } from '@/lib/db';
import { Lead } from '@/lib/types';
import { saveLeadToMySQL } from '@/lib/mysql';

// Public submission of inquiry or eligibility calculator
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required fields.' },
        { status: 400 }
      );
    }

    const leads = await db.getTable('leads');
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      currentCountry: body.currentCountry || 'Not Specified',
      targetCountry: body.targetCountry || 'United Kingdom',
      studyLevel: body.studyLevel || 'Masters',
      program: body.program || '',
      academicScore: body.academicScore || '',
      englishTest: body.englishTest || '',
      message: body.message || '',
      sourcePage: body.sourcePage || '/contact',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save directly to MySQL database
    await saveLeadToMySQL(newLead).catch(console.error);

    leads.unshift(newLead);
    await db.updateTable('leads', leads);

    // Automatically record unique email in audience subscribers table
    await addSubscriber(body.email, body.fullName, 'contact', body.phone).catch((err) =>
      console.warn('[Lead Subscriber Registration Warning]:', err)
    );

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record lead.' }, { status: 500 });
  }
}

// Admin fetch with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let leads = await db.getTable('leads');

    if (status && status !== 'all') {
      leads = leads.filter((l) => l.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.targetCountry.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, leads });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}

// Admin update lead status, notes, or assigned counselor
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes, assignedTo } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const leads = await db.getTable('leads');
    const index = leads.findIndex((l) => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (status) leads[index].status = status;
    if (notes !== undefined) leads[index].notes = notes;
    if (assignedTo !== undefined) leads[index].assignedTo = assignedTo;
    leads[index].updatedAt = new Date().toISOString();

    await db.updateTable('leads', leads);

    return NextResponse.json({ success: true, lead: leads[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// Delete lead
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    let leads = await db.getTable('leads');
    leads = leads.filter((l) => l.id !== id);
    await db.updateTable('leads', leads);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
