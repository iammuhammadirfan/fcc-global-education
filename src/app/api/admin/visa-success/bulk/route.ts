import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VisaSuccessItem } from '@/lib/types';
import { saveMediaFile } from '@/lib/mysql';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB per file

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle Multipart / FormData direct file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const country = (formData.get('country') as string)?.trim();
      const countryCode = (formData.get('countryCode') as string)?.trim() || country?.slice(0, 2).toUpperCase() || 'GL';
      const approvalDays = (formData.get('approvalDays') as string)?.trim() || 'Visa Approved';
      const intake = (formData.get('intake') as string)?.trim() || 'Fall 2026';

      if (!country) {
        return NextResponse.json({ error: 'Destination country is required.' }, { status: 400 });
      }

      const files = formData.getAll('files') as File[];
      if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
      }

      const existingItems: VisaSuccessItem[] = (await db.getTable('visaSuccess')) || [];
      const newItems: VisaSuccessItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file || typeof file === 'string') continue;

        const ext = path.extname(file.name || '').toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext) && !file.type.startsWith('image/')) {
          continue; // skip non-images
        }

        if (file.size > MAX_FILE_SIZE) {
          continue; // skip oversize files
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type || 'image/jpeg';
        const fileId = `visa_img_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`;

        await saveMediaFile(fileId, mimeType, buffer.length, buffer);
        const imageUrl = `/api/media/file/${fileId}`;

        // Attempt clean name from filename if available, e.g. "Farhan_Zaidi.png" -> "Farhan Zaidi"
        const cleanName = (file.name || '')
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b(visa|grant|poster|letter|doc|scan|img|screenshot|image)\b/gi, '')
          .trim();

        const newItem: VisaSuccessItem = {
          id: `visa_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          studentName: cleanName || '',
          studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          visaLetterImage: imageUrl,
          country: country,
          countryCode: countryCode,
          countrySlug: country.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          university: '', // Left blank so admin edits it before adding to home
          program: '',
          intake: intake,
          visaType: `${country} Student Visa`,
          approvalDays: approvalDays,
          grantDate: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          testimonial: 'Visa granted smoothly with verified legal compliance.',
          featured: false,
          published: true,
          showOnHomepage: false, // NOT shown on homepage until studentName & university are verified
          order: existingItems.length + i + 1,
          createdAt: new Date().toISOString(),
        };

        newItems.push(newItem);
      }

      if (newItems.length === 0) {
        return NextResponse.json({ error: 'No valid image files could be processed.' }, { status: 400 });
      }

      const merged = [...newItems, ...existingItems];
      await db.updateTable('visaSuccess', merged);

      return NextResponse.json({
        success: true,
        count: newItems.length,
        items: newItems,
        message: `${newItems.length} visa posters successfully uploaded for ${country}.`,
      });
    }

    // Handle JSON payload (when images are uploaded via media API first)
    const body = await request.json();
    const { country, countryCode, approvalDays, intake, items } = body;

    if (!country) {
      return NextResponse.json({ error: 'Destination country is required.' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No visa items provided.' }, { status: 400 });
    }

    const existingItems: VisaSuccessItem[] = (await db.getTable('visaSuccess')) || [];
    const newItems: VisaSuccessItem[] = [];
    const resolvedCode = countryCode || country.slice(0, 2).toUpperCase() || 'GL';
    const resolvedCountrySlug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.visaLetterImage) continue;

      const newItem: VisaSuccessItem = {
        id: `visa_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        studentName: (it.studentName || '').trim(),
        studentPhoto: it.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        visaLetterImage: it.visaLetterImage,
        country: country,
        countryCode: resolvedCode,
        countrySlug: resolvedCountrySlug,
        university: (it.university || '').trim(),
        program: (it.program || '').trim(),
        intake: intake || it.intake || 'Fall 2026',
        visaType: `${country} Student Visa`,
        approvalDays: approvalDays || it.approvalDays || 'Visa Approved',
        grantDate: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        testimonial: 'Visa granted smoothly with verified legal compliance.',
        featured: false,
        published: true,
        showOnHomepage: false, // NOT on homepage until studentName & university are filled
        order: existingItems.length + i + 1,
        createdAt: new Date().toISOString(),
      };

      newItems.push(newItem);
    }

    const merged = [...newItems, ...existingItems];
    await db.updateTable('visaSuccess', merged);

    return NextResponse.json({
      success: true,
      count: newItems.length,
      items: newItems,
      message: `${newItems.length} visa posters successfully uploaded for ${country}.`,
    });
  } catch (error: any) {
    console.error('[Admin Visa Success Bulk POST Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to bulk upload visa success items.' },
      { status: 500 }
    );
  }
}
