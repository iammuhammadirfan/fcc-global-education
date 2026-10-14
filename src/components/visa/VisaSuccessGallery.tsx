'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Search,
  Globe,
  Building,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { VisaSuccessItem } from '@/lib/types';

interface VisaSuccessGalleryProps {
  items: VisaSuccessItem[];
}

const countryFlags: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  Germany: '🇩🇪',
  Ireland: '🇮🇪',
  Sweden: '🇸🇪',
  'New Zealand': '🇳🇿',
  Netherlands: '🇳🇱',
  France: '🇫🇷',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
  Malaysia: '🇲🇾',
  Dubai: '🇦🇪',
  UAE: '🇦🇪',
  Turkey: '🇹🇷',
  Cyprus: '🇨🇾',
  China: '🇨🇳',
  all: '🌍',
};

// Sub-component for individual card with instant display & fallback
function GalleryCard({
  item,
  onZoom,
}: {
  item: VisaSuccessItem;
  onZoom: (url: string) => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      } else {
        setImageError(true);
      }
    }
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [item.visaLetterImage]);

  const flag = countryFlags[item.country] || '🌍';

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 p-2 sm:p-2.5 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group">
      {/* Visa Poster Container - Tall A4 Proportion for Clear Legibility */}
      <div
        className="relative aspect-[1/1.36] sm:aspect-[1/1.38] rounded-xl overflow-hidden bg-slate-900/5 border border-slate-200/80 cursor-pointer group-hover:shadow-md transition-all select-none"
        onClick={() => onZoom(item.visaLetterImage)}
      >
        {/* Fallback branded certificate if image fails to load */}
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-3 flex flex-col justify-between text-white text-center">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified Grant
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white">
                {item.approvalDays || 'Approved'}
              </span>
            </div>

            <div className="my-auto py-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mb-2 shadow-inner">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-sm font-extrabold text-white leading-tight">
                {item.country} Visa Grant
              </h4>
              <p className="text-[10px] text-amber-200/90 font-medium mt-1">
                Official Consulate Visa Letter
              </p>
            </div>

            <div className="pt-1.5 border-t border-white/10 text-[9px] text-slate-400 font-medium">
              Click to view verification proof
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/5">
            {/* Ambient matching backdrop blur so any aspect ratio looks seamless */}
            <img
              src={item.visaLetterImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-lg scale-115 opacity-25 select-none pointer-events-none"
            />
            {/* Foreground crisp image without cropping or distorting */}
            <img
              ref={imgRef}
              src={item.visaLetterImage}
              alt={`${item.country || 'Visa'} Proof`}
              className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-all duration-300 drop-shadow-xs select-none"
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Speed / Approval Tag */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-sm">
            <CheckCircle2 className="w-2.5 h-2.5" />
            {item.approvalDays || 'Visa Approved'}
          </span>
        </div>

        {/* Country Badge */}
        <div className="absolute top-2 right-2 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 shadow-sm border border-amber-300">
            <span>{flag}</span>
            <span>{item.country}</span>
          </span>
        </div>

        {/* Hover Zoom Overlay */}
        <div className="absolute inset-0 z-20 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-[11px] shadow-lg transform translate-y-1.5 group-hover:translate-y-0 transition-transform">
            <ZoomIn className="w-3.5 h-3.5 text-amber-600" /> Click to Zoom
          </span>
        </div>
      </div>

      {/* Clean Bottom Country & Verified Bar (No student name or university) */}
      <div className="mt-2.5 px-1 flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
          <span>{flag}</span>
          <span className="truncate">{item.country} Visa Grant</span>
        </span>
        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
        </span>
      </div>
    </div>
  );
}

export default function VisaSuccessGallery({ items = [] }: VisaSuccessGalleryProps) {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const galleryRef = useRef<HTMLDivElement>(null);

  // 50 cards per page
  const itemsPerPage = 50;

  // 1. Dynamic country calculation from active items
  const activeItems = items.filter((i) => i.published !== false);
  const countryCounts = activeItems.reduce((acc: Record<string, number>, item) => {
    if (item.country) {
      acc[item.country] = (acc[item.country] || 0) + 1;
    }
    return acc;
  }, {});

  const countries = ['all', ...Array.from(new Set(activeItems.map((i) => i.country).filter(Boolean)))];

  // 2. Filter items
  const filtered = activeItems.filter((item) => {
    const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
    const matchesSearch =
      (item.studentName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.university?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.program?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (item.country?.toLowerCase() || '').includes(search.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // In-place pagination: does NOT reload page, stays smoothly in this section
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setSelectedCountry('all');
    setSearch('');
  };

  return (
    <div ref={galleryRef} className="space-y-6 scroll-mt-28">
      {/* ========================================================================= */}
      {/* REDESIGNED CLEAN CONTROL TOOLBAR & NATURAL WRAPPING DESTINATION CHIPS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Row: Search Box + Status Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Select Destination:</span>
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Showing {filtered.length} of {activeItems.length} Grants
            </span>
            {(selectedCountry !== 'all' || search) && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, university, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Natural Wrapping Destination Chips (Clean, no clunky scroll arrows) */}
        <div className="flex flex-wrap items-center gap-2">
          {countries.map((c) => {
            const count = c === 'all' ? activeItems.length : countryCounts[c] || 0;
            const flag = countryFlags[c] || '🌍';
            const isSelected = selectedCountry === c;

            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCountry(c)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border-slate-200 hover:border-amber-300'
                }`}
              >
                <span className="text-base leading-none">{flag}</span>
                <span>{c === 'all' ? 'All Countries' : c}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards: Exactly 4 cards in 1 line on desktop, 2 rows (8 items per page) */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 space-y-2">
          <p className="font-bold text-slate-800 text-sm">
            No verified visa success proofs match your selection.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
          >
            Clear filters and show all {activeItems.length} grants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedItems.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onZoom={(url) => setPreviewImage(url)}
            />
          ))}
        </div>
      )}

      {/* In-Place Client-Side Pagination (Never reloads page, stays in this section) */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 text-xs">
          <div className="text-slate-600 font-semibold">
            Showing Page <span className="font-bold text-slate-950">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-950">{totalPages}</span> ({filtered.length} Total Verified Grants)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-xl font-bold transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Zoom Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[92vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 overflow-auto max-h-[80vh] flex items-center justify-center bg-slate-100 rounded-2xl p-2">
              <img
                src={previewImage}
                alt="Visa Grant Letter Proof"
                className="max-w-full max-h-[76vh] object-contain rounded-xl shadow-md"
              />
            </div>

            <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs border-t border-slate-100 mt-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-center sm:text-left text-[11px] sm:text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Verified Legal Visa Grant Decision Letter
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
