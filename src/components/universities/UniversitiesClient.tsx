'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Building, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import UniversityCard from '@/components/cards/UniversityCard';
import { University } from '@/lib/types';

interface UniversitiesClientProps {
  initialUniversities: University[];
}

export default function UniversitiesClient({ initialUniversities }: UniversitiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedField, setSelectedField] = useState('All');
  const [rankFilter, setRankFilter] = useState('All');

  // Extract unique countries
  const countriesList = useMemo(() => {
    return ['All', ...Array.from(new Set(initialUniversities.map((u) => u.country).filter(Boolean)))];
  }, [initialUniversities]);

  // Extract unique fields
  const fieldsList = useMemo(() => {
    const fields = new Set<string>();
    initialUniversities.forEach((u) => (u.studyFields || []).forEach((f: string) => fields.add(f)));
    return ['All', ...Array.from(fields)];
  }, [initialUniversities]);

  const filteredUniversities = useMemo(() => {
    return initialUniversities.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.popularPrograms || []).some((prog: string) =>
          prog.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCountry =
        selectedCountry === 'All' || u.country === selectedCountry;

      const matchesField =
        selectedField === 'All' ||
        (u.studyFields || []).includes(selectedField);

      let matchesRank = true;
      if (rankFilter === 'Top 50') {
        matchesRank = !!u.worldRank && u.worldRank <= 50;
      } else if (rankFilter === 'Top 100') {
        matchesRank = !!u.worldRank && u.worldRank <= 100;
      } else if (rankFilter === 'Top 200') {
        matchesRank = !!u.worldRank && u.worldRank <= 200;
      }

      return matchesSearch && matchesCountry && matchesField && matchesRank;
    });
  }, [initialUniversities, searchQuery, selectedCountry, selectedField, rankFilter]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Partner Universities' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
              Direct University Admissions Representation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              World-Class{' '}
              <span className="text-amber-600">
                Partner Universities
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Explore admission criteria, world rankings, estimated tuition fees, and high-value scholarship endowments across globally accredited institutions.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by university name, campus city, or academic degree..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-amber-600" /> Country Destination
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                >
                  {countriesList.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Academic Discipline
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                >
                  {fieldsList.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  World Ranking Range
                </label>
                <select
                  value={rankFilter}
                  onChange={(e) => setRankFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                >
                  <option value="All">All Rankings</option>
                  <option value="Top 50">Top 50 Global (QS/THE)</option>
                  <option value="Top 100">Top 100 Global</option>
                  <option value="Top 200">Top 200 Global</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Showing {filteredUniversities.length} {filteredUniversities.length === 1 ? 'Institution' : 'Institutions'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any university profile for complete fee breakdowns, GPA thresholds, and scholarship dates.
            </p>
          </div>
        </div>

        {filteredUniversities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No partner universities found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or country filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('All');
                setSelectedField('All');
                setRankFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUniversities.map((uni) => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
          </div>
        )}
      </section>

      {/* Pre-Footer Conversion Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
              Official University Representation
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Targeting Oxbridge, Ivy League, or Group of Eight?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our bespoke Top-Tier Admissions Advisory pairs candidates directly with Oxbridge and Ivy League alumni counselors who have navigated the rigorous interview panels.
            </p>
            <div className="pt-4">
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Book Top-Tier Strategy Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
