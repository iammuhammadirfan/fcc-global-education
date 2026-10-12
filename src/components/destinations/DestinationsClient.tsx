'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe, Filter, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CountryCard from '@/components/cards/CountryCard';
import { Country } from '@/lib/types';

interface DestinationsClientProps {
  initialCountries: Country[];
}

export default function DestinationsClient({ initialCountries }: DestinationsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredCountries = useMemo(() => {
    return initialCountries.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.popularCourses || []).some((course: string) =>
          course.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (c.topUniversityNames || []).some((uni: string) =>
          uni.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesRegion =
        selectedRegion === 'All' || c.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion, initialCountries]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Study Destinations' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest bg-cyan-100 px-3.5 py-1.5 rounded-full border border-cyan-300">
              {initialCountries.length} Leading Global Education Hubs
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Discover Your Ideal{' '}
              <span className="text-amber-600">
                Study Destination
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Explore tuition benchmarks, post-study work visa rights, living costs, and top-tier universities across Europe, North America, and the Asia-Pacific.
            </p>
          </div>

          {/* Search & Region Filter Bar */}
          <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Live Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by country, university, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Region:
              </span>
              {['All', 'Europe', 'North America', 'Asia-Pacific'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRegion === region
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Country Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Showing {filteredCountries.length} {filteredCountries.length === 1 ? 'Country' : 'Countries'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a destination to inspect detailed tuition fees, post-study work rules, and top university rosters.
            </p>
          </div>
        </div>

        {filteredCountries.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No destinations found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or filter selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </section>

      {/* Pre-Footer Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
              Country Comparison Advice
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Torn Between Two Countries?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              UK vs USA? Canada vs Australia? Germany vs Ireland? Our comparative diagnostic model breaks down overall tuition investment, living costs, and post-study permanent residency probability.
            </p>
            <div className="pt-4">
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Book Country Comparison Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
