import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VideoTestimonial } from '@/lib/types';

export async function GET() {
  const videos = (await db.getTable('videos')) || [];
  return NextResponse.json({ success: true, videos });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let embedUrl = body.embedUrl || body.videoEmbedUrl || body.videoUrl || '';
    let autoThumbnail = '';

    if (embedUrl.includes('watch?v=') || embedUrl.includes('watch?')) {
      const match = embedUrl.match(/v=([a-zA-Z0-9_-]+)/);
      const vidId = match ? match[1] : embedUrl.split('watch?v=')[1]?.split('&')[0];
      if (vidId) {
        embedUrl = `https://www.youtube.com/embed/${vidId}`;
        autoThumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    } else if (embedUrl.includes('youtu.be/')) {
      const vidId = embedUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      if (vidId) {
        embedUrl = `https://www.youtube.com/embed/${vidId}`;
        autoThumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    } else if (embedUrl.includes('youtube.com/embed/')) {
      const vidId = embedUrl.split('embed/')[1]?.split('?')[0]?.split('&')[0];
      if (vidId) {
        autoThumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    }

    if (!embedUrl) {
      return NextResponse.json({ error: 'Video URL (YouTube / Vimeo) is required' }, { status: 400 });
    }

    const studentName = body.studentName || body.title || 'Student Video';
    const title = body.title || body.studentName || 'Student Video';
    const videos = (await db.getTable('videos')) || [];
    const country = body.country || body.destination || 'United Kingdom';
    const thumbnailUrl = body.thumbnailUrl || body.thumbnail || autoThumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

    const newVideo = {
      id: body.id || `vid_${Date.now()}`,
      title,
      studentName,
      university: body.university || 'Partner University',
      country,
      destination: country,
      program: body.program || body.category || 'Degree Program',
      category: body.category || 'Student Videos',
      thumbnailUrl,
      thumbnail: thumbnailUrl,
      videoEmbedUrl: embedUrl,
      embedUrl,
      duration: body.duration || '3:00',
      quote: body.quote || '',
      visaGrantedYear: body.visaGrantedYear || new Date().getFullYear().toString(),
      featured: body.featured !== false,
      published: body.published !== false,
    };

    videos.unshift(newVideo);
    await db.updateTable('videos', videos);

    return NextResponse.json({ success: true, video: newVideo });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to add video' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const videos = (await db.getTable('videos')) || [];
    const index = videos.findIndex((v: any) => v.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    let embedUrl = body.embedUrl || body.videoEmbedUrl || body.videoUrl || videos[index].videoEmbedUrl || videos[index].embedUrl || '';
    let autoThumbnail = '';

    if (embedUrl.includes('watch?v=')) {
      const match = embedUrl.match(/v=([a-zA-Z0-9_-]+)/);
      const vidId = match ? match[1] : embedUrl.split('watch?v=')[1]?.split('&')[0];
      if (vidId) {
        embedUrl = `https://www.youtube.com/embed/${vidId}`;
        autoThumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    } else if (embedUrl.includes('youtu.be/')) {
      const vidId = embedUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      if (vidId) {
        embedUrl = `https://www.youtube.com/embed/${vidId}`;
        autoThumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    } else if (embedUrl.includes('youtube.com/embed/')) {
      const vidId = embedUrl.split('embed/')[1]?.split('?')[0]?.split('&')[0];
      if (vidId) {
        autoThumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    }

    const studentName = body.studentName || body.title || videos[index].studentName || videos[index].title || 'Student Video';
    const title = body.title || body.studentName || videos[index].title || videos[index].studentName || 'Student Video';
    const thumbnailUrl = body.thumbnailUrl || body.thumbnail || autoThumbnail || videos[index].thumbnailUrl || videos[index].thumbnail;
    const country = body.country || body.destination || videos[index].country || videos[index].destination || 'United Kingdom';

    videos[index] = {
      ...videos[index],
      ...body,
      title,
      studentName,
      videoEmbedUrl: embedUrl,
      embedUrl,
      thumbnailUrl,
      thumbnail: thumbnailUrl,
      country,
      destination: country,
    };

    await db.updateTable('videos', videos);

    return NextResponse.json({ success: true, video: videos[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let videos = await db.getTable('videos');
    videos = videos.filter((v) => v.id !== id);
    await db.updateTable('videos', videos);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
