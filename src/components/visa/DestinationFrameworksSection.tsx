'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, FileCheck, ShieldCheck, Sparkles } from 'lucide-react';

interface DestinationFrameworkItem {
  country: string;
  flag?: string;
  code?: string;
  slug?: string;
  countrySlug?: string;
  visaType?: string;
  approvalRate?: string;
  avgProcessing?: string;
  fundsRule?: string;
  interviewReq?: string;
  keyHighlight?: string;
}

interface DestinationFrameworksSectionProps {
  cards: DestinationFrameworkItem[];
  badge?: string;
  title?: string;
  description?: string;
}

export default function DestinationFrameworksSection({
  cards = [],
  badge = 'Country-Wise Protocols',
  title = 'Destination Visa Frameworks & Timelines',
  description = 'Every country enforces distinct financial holding rules, attestation mandates, and interview procedures. Here is how our team manages them for you.',
}: DestinationFrameworksSectionProps) {
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);

  const triggerHighlight = (rawSlug: string) => {
    if (!rawSlug) return;
    const cleanSlug = rawSlug.replace(/^#?destination-?/, '').toLowerCase().trim();
    if (!cleanSlug) return;

    // Find card that matches slug or countrySlug or country name
    const matched = cards.find(
      (c) =>
        (c.slug && c.slug.toLowerCase() === cleanSlug) ||
        (c.countrySlug && c.countrySlug.toLowerCase() === cleanSlug) ||
        (c.country && c.country.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug) ||
        (c.country && c.country.toLowerCase().replace(/\s+/g, '') === cleanSlug.replace(/[^a-z0-9]+/g, ''))
    );

    const activeSlug = matched?.slug || matched?.countrySlug || cleanSlug;
    setHighlightedSlug(activeSlug);

    // Find DOM element to smooth scroll
    const targetElement =
      document.getElementById(`destination-${cleanSlug}`) ||
      document.getElementById(`destination-${matched?.slug}`) ||
      document.getElementById(`destination-${matched?.countrySlug}`) ||
      document.querySelector(`[data-destination-slug="${cleanSlug}"]`) ||
      document.querySelector(`[data-destination-slug="${matched?.slug}"]`);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Auto-remove highlight after 4 seconds
    const timer = setTimeout(() => {
      setHighlightedSlug(null);
    }, 4000);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // 1. Check URL hash on page load / mount
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      if (hash.startsWith('#destination-')) {
        setTimeout(() => {
          triggerHighlight(hash);
        }, 150);
      }
    }

    // 2. Listen to browser hashchange events
    const handleHashChange = () => {
      if (window.location.hash?.startsWith('#destination-')) {
        triggerHighlight(window.location.hash);
      }
    };

    // 3. Listen to custom trigger event from Navbar
    const handleCustomHighlight = (e: any) => {
      if (e?.detail?.slug) {
        triggerHighlight(e.detail.slug);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('highlight-destination', handleCustomHighlight as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('highlight-destination', handleCustomHighlight as EventListener);
    };
  }, [cards]);

  return (
    <section id="destination-frameworks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
          {badge}
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Grid: 4 cards in 1 row on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, idx) => {
          const itemSlug = (item.slug || item.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `card-${idx}`).toLowerCase();
          const countrySlug = (item.countrySlug || item.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || itemSlug).toLowerCase();

          const isHighlighted =
            highlightedSlug &&
            (highlightedSlug === itemSlug ||
              highlightedSlug === countrySlug ||
              highlightedSlug === item.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

          return (
            <div
              key={`${itemSlug}-${idx}`}
              id={`destination-${itemSlug}`}
              data-destination-slug={itemSlug}
              className={`rounded-2xl p-4.5 flex flex-col justify-between scroll-mt-36 transition-all duration-500 relative ${
                isHighlighted
                  ? 'bg-amber-50/70 border-2 border-amber-500 ring-4 ring-amber-400/40 shadow-2xl scale-[1.03] z-20'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-300'
              }`}
            >
              {/* Secondary Anchor ID for country name slug if different from slug */}
              {countrySlug !== itemSlug && (
                <span id={`destination-${countrySlug}`} className="absolute -top-36 invisible pointer-events-none" />
              )}

              {/* Glowing Highlight Active Indicator */}
              {isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md flex items-center gap-1 animate-bounce">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>Selected Destination</span>
                  </span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Card Top: Country Flag, Name & Approval Rate */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                      {item.flag || item.code || '🌍'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                        {item.country}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium truncate block">
                        {item.visaType || 'Student Route Visa'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-1">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                      {item.approvalRate || '98.5%'}
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Processing Turnaround
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {item.avgProcessing || '2 – 4 Weeks via Official Portal'}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Financial Proof Required
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px] line-clamp-2">
                      {item.fundsRule || 'Proof of liquid living funds + tuition receipt'}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Interview Simulation
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px] line-clamp-2">
                      {item.interviewReq || 'Comprehensive Credibility & Mock Interview Clinic'}
                    </span>
                  </div>
                </div>

                {/* Key Highlight / PSW Rights */}
                <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 leading-snug">
                  <span className="font-bold text-amber-900">Post-Study Work: </span>
                  <span>{item.keyHighlight?.replace(/^Post-Study Work:\s*/i, '') || 'Post-graduation work rights available for eligible graduates.'}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 mt-3.5">
                <Link
                  href={`/book-appointment?destination=${encodeURIComponent(item.country)}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-amber-400 hover:text-slate-950 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-sm"
                >
                  <span>Book {item.country} Visa Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
