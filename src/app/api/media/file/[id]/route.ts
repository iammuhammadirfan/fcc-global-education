import { getMediaFile } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === '') {
      return new Response('Not Found', { status: 404 });
    }

    // Try finding by exact id first
    let file = await getMediaFile(id);

    // If not found, try stripped id (e.g. med_123.png -> med_123)
    if (!file && id.includes('.')) {
      const cleanId = id.replace(/\.[^.]+$/, '');
      file = await getMediaFile(cleanId);
    }

    if (!file || !file.data) {
      return new Response('Not Found', { status: 404 });
    }

    const mimeType = file.mimeType || 'application/octet-stream';
    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Content-Length': String(file.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    // For SVG add strict CSP sandbox header
    if (mimeType.toLowerCase().includes('svg')) {
      headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
    }

    return new Response(new Uint8Array(file.data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Serve Media File Error]:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
