import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User } from '@/lib/types';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  const usersList = await db.getTable('users');
  const users = usersList.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    createdAt: u.createdAt,
  }));
  return NextResponse.json({ success: true, users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const users = await db.getTable('users');
    const existing = users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: body.name,
      email: body.email,
      passwordHash: hashPassword(body.password),
      role: body.role || 'counselor',
      avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await db.updateTable('users', users);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, avatar, password } = body;

    const users = await db.getTable('users');
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) users[index].name = name;
    if (role) users[index].role = role;
    if (avatar) users[index].avatar = avatar;
    if (password) users[index].passwordHash = hashPassword(password);

    await db.updateTable('users', users);

    return NextResponse.json({
      success: true,
      user: {
        id: users[index].id,
        name: users[index].name,
        email: users[index].email,
        role: users[index].role,
        avatar: users[index].avatar,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let users = await db.getTable('users');
    if (users.length <= 1) {
      return NextResponse.json({ error: 'Cannot delete the only remaining admin' }, { status: 400 });
    }

    users = users.filter((u) => u.id !== id);
    await db.updateTable('users', users);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
