import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries as fallbackCountries } from '@/data/countries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let allCountries = (await db.getTable('countries')) || [];
    if (!allCountries || allCountries.length === 0) {
      allCountries = fallbackCountries;
    }
    const published = allCountries.filter((c: any) => c.published !== false);
    return NextResponse.json({
      success: true,
      count: published.length,
      countries: published,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
