import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { universities as fallbackUniversities } from '@/data/universities';
import { countries as fallbackCountries } from '@/data/countries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get('country');

    let allUniversities = (await db.getTable('universities')) || [];
    if (!allUniversities || allUniversities.length === 0) {
      allUniversities = fallbackUniversities;
    }

    let allCountries = (await db.getTable('countries')) || [];
    if (!allCountries || allCountries.length === 0) {
      allCountries = fallbackCountries;
    }

    // Filter only active / published
    const activeCountries = allCountries.filter((c: any) => c.published !== false);
    let activeUniversities = allUniversities.filter((u: any) => u.published !== false);

    // If country parameter supplied, filter strictly by country (by name or slug)
    if (countryParam && countryParam !== 'all') {
      const target = countryParam.trim().toLowerCase();
      activeUniversities = activeUniversities.filter((u: any) => {
        const uCountry = (u.country || '').toLowerCase();
        const uCountrySlug = (u.countrySlug || '').toLowerCase();
        return uCountry === target || uCountrySlug === target;
      });
    }

    return NextResponse.json({
      success: true,
      count: activeUniversities.length,
      universities: activeUniversities,
      countries: activeCountries,
    });
  } catch (error: any) {
    console.error('Error fetching public universities:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}
