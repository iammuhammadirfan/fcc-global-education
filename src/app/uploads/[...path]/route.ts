import { getMediaFile } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const fileName = Array.isArray(pathSegments) ? pathSegments.join('/') : '';

    if (!fileName) {
      return new Response('Not Found', { status: 404 });
    }

    // Check if file binary exists in media_files table (e.g. imported legacy asset)
    const file = await getMediaFile(fileName);

    if (!file || !file.data) {
      return new Response('Not Found', { status: 404 });
    }

    const mimeType = file.mimeType || 'application/octet-stream';
    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Content-Length': String(file.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    if (mimeType.toLowerCase().includes('svg')) {
      headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
    }

    return new Response(new Uint8Array(file.data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Fallback Uploads Route Error]:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
