import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { MediaItem } from '@/lib/types';
import { saveMediaFile, deleteMediaFile } from '@/lib/mysql';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Allowed image formats
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'];
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
  } catch (error: any) {
    console.error('[Admin Media GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    // 1. Validate File Size (max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 10MB.' },
        { status: 400 }
      );
    }

    // 2. Validate Extension & MIME Type
    const ext = path.extname(file.name || '').toLowerCase();
    const detectedType = (file.type || '').toLowerCase();

    const isExtensionAllowed = ALLOWED_EXTENSIONS.includes(ext);
    const isMimeAllowed = ALLOWED_MIME_TYPES.includes(detectedType) || detectedType.startsWith('image/');

    if (!isExtensionAllowed && !isMimeAllowed) {
      return NextResponse.json(
        { error: 'Invalid file format. Only images (PNG, JPEG, WebP, GIF, SVG, ICO) are allowed.' },
        { status: 400 }
      );
    }

    // Resolve accurate MIME type
    let mimeType = detectedType;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (ext === '.svg') mimeType = 'image/svg+xml';
      else if (ext === '.ico') mimeType = 'image/x-icon';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.gif') mimeType = 'image/gif';
      else mimeType = 'image/jpeg';
    }

    // 3. Read bytes into Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Generate unique media identifier
    const id = `med_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 5. Save image binary directly in MySQL media_files table (Zero disk dependency)
    await saveMediaFile(id, mimeType, buffer.length, buffer);

    // Public URL served by streaming API route
    const publicUrl = `/api/media/file/${id}`;

    const mediaList = await db.getTable('media');
    const newMedia: MediaItem = {
      id,
      name: file.name,
      url: publicUrl,
      category: category as any,
      sizeBytes: buffer.length,
      mimeType,
      createdAt: new Date().toISOString(),
    };

    mediaList.unshift(newMedia);
    await db.updateTable('media', mediaList);

    return NextResponse.json({
      success: true,
      media: newMedia,
      file: newMedia,
    });
  } catch (error: any) {
    console.error('[Admin Media POST Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload media file.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required.' }, { status: 400 });
    }

    // 1. Delete binary from MySQL media_files table
    await deleteMediaFile(id);

    // 2. Fetch media list and find item
    const mediaList = await db.getTable('media');
    const item = mediaList.find((m) => m.id === id);

    // 3. If item URL references a custom media file ID, delete that too
    if (item && item.url.startsWith('/api/media/file/')) {
      const fileId = item.url.replace('/api/media/file/', '').trim();
      if (fileId && fileId !== id) {
        await deleteMediaFile(fileId);
      }
    }

    // 4. For legacy items whose URL starts with /uploads/, attempt disk cleanup safely
    if (item && item.url.startsWith('/uploads/')) {
      try {
        const fileName = path.basename(item.url);
        const filePath = path.join(UPLOAD_DIR, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fsErr) {
        console.warn('[Legacy Disk Delete Notice - Ignored on read-only disk]:', fsErr);
      }
    }

    const filtered = mediaList.filter((m) => m.id !== id);
    await db.updateTable('media', filtered);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Admin Media DELETE Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete media item.' },
      { status: 500 }
    );
  }
}
