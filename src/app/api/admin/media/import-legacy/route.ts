import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveMediaFile, ensureMediaFilesTable } from '@/lib/mysql';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST() {
  try {
    await ensureMediaFilesTable();

    if (!fs.existsSync(UPLOAD_DIR)) {
      return NextResponse.json({ success: true, message: 'Uploads directory does not exist.', importedCount: 0 });
    }

    const files = fs.readdirSync(UPLOAD_DIR);
    let importedCount = 0;
    const importedList: string[] = [];

    for (const fileName of files) {
      const filePath = path.join(UPLOAD_DIR, fileName);
      const stat = fs.statSync(filePath);

      if (!stat.isFile()) continue;

      const ext = path.extname(fileName).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.svg') mimeType = 'image/svg+xml';
      else if (ext === '.ico') mimeType = 'image/x-icon';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.gif') mimeType = 'image/gif';

      const fileBuffer = fs.readFileSync(filePath);

      // Save using both the exact filename and standard media id
      await saveMediaFile(fileName, mimeType, fileBuffer.length, fileBuffer);
      importedCount++;
      importedList.push(fileName);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedCount} legacy files into database media_files.`,
      importedCount,
      files: importedList,
    });
  } catch (error: any) {
    console.error('[Import Legacy Media Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to import legacy media files.' },
      { status: 500 }
    );
  }
}
