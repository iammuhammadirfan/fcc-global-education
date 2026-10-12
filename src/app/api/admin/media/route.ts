import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { MediaItem } from '@/lib/types';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let media = await db.getTable('media');

    if (category && category !== 'all') {
      media = media.filter((m) => m.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      media = media.filter((m) => m.name.toLowerCase().includes(q));
    }

    return NextResponse.json({ success: true, media });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique timestamped name
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${baseName}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    const mediaList = await db.getTable('media');
    const newMedia: MediaItem = {
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      url: publicUrl,
      category: category as any,
      sizeBytes: file.size,
      mimeType: file.type || 'application/octet-stream',
      createdAt: new Date().toISOString(),
    };

    mediaList.unshift(newMedia);
    await db.updateTable('media', mediaList);

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload media file' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const mediaList = await db.getTable('media');
    const item = mediaList.find((m) => m.id === id);

    if (item && item.url.startsWith('/uploads/')) {
      const fileName = path.basename(item.url);
      const filePath = path.join(UPLOAD_DIR, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const filtered = mediaList.filter((m) => m.id !== id);
    await db.updateTable('media', filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 });
  }
}
