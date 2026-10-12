import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TeamMember } from '@/lib/types';

export async function GET() {
  try {
    const teamMembers = (await db.getTable('teamMembers')) || [];
    return NextResponse.json({ success: true, team: teamMembers, teamMembers });
  } catch (err: any) {
    console.error('Error getting team members:', err);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ error: 'Name and position/role are required' }, { status: 400 });
    }

    const team = (await db.getTable('teamMembers')) || [];
    
    // Process credentials array
    let creds: string[] = [];
    if (Array.isArray(body.credentials)) {
      creds = body.credentials.filter((c: any) => typeof c === 'string' && c.trim() !== '');
    } else if (typeof body.credentials === 'string') {
      creds = body.credentials.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

    // Process specializations array
    let specs: string[] = [];
    if (Array.isArray(body.specializations)) {
      specs = body.specializations.filter((s: any) => typeof s === 'string' && s.trim() !== '');
    } else if (typeof body.specializations === 'string') {
      specs = body.specializations.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const newMember: TeamMember = {
      id: body.id || `team_${Date.now()}`,
      name: body.name.trim(),
      role: body.role.trim(),
      experience: body.experience || '10+ Years Experience',
      credentials: creds,
      image: body.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: body.bio || '',
      specializations: specs,
      sortOrder: Number(body.sortOrder || body.order || team.length + 1),
      order: Number(body.sortOrder || body.order || team.length + 1),
      active: body.active !== false,
    };

    team.push(newMember);
    await db.updateTable('teamMembers', team);

    return NextResponse.json({ success: true, member: newMember, teamMembers: team, team });
  } catch (err: any) {
    console.error('Error creating team member:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create team member' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const team = (await db.getTable('teamMembers')) || [];
    const index = team.findIndex((m) => String(m.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Process credentials array
    let creds = team[index].credentials || [];
    if (Array.isArray(body.credentials)) {
      creds = body.credentials.filter((c: any) => typeof c === 'string' && c.trim() !== '');
    } else if (typeof body.credentials === 'string') {
      creds = body.credentials.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

    // Process specializations array
    let specs = team[index].specializations || [];
    if (Array.isArray(body.specializations)) {
      specs = body.specializations.filter((s: any) => typeof s === 'string' && s.trim() !== '');
    } else if (typeof body.specializations === 'string') {
      specs = body.specializations.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated: TeamMember = {
      ...team[index],
      ...body,
      credentials: creds,
      specializations: specs,
      sortOrder: Number(body.sortOrder || body.order || team[index].sortOrder || index + 1),
      active: body.active !== undefined ? Boolean(body.active) : (team[index].active ?? true),
    };

    team[index] = updated;
    await db.updateTable('teamMembers', team);

    return NextResponse.json({ success: true, member: team[index], teamMembers: team, team });
  } catch (err: any) {
    console.error('Error updating team member:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let team = (await db.getTable('teamMembers')) || [];
    team = team.filter((m) => String(m.id) !== String(id));
    await db.updateTable('teamMembers', team);

    return NextResponse.json({ success: true, teamMembers: team, team });
  } catch (err: any) {
    console.error('Error deleting team member:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete member' }, { status: 500 });
  }
}
