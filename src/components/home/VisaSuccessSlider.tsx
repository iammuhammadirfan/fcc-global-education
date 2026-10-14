'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Globe,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ZoomIn,
  Award,
} from 'lucide-react';
import { VisaSuccessItem } from '@/lib/types';

export interface VisaRowData {
  id: string;
  title: string;
  highlightText?: string;
  badge?: string;
  subtitle?: string;
  country: string;
  limit?: number;
  enabled?: boolean;
  items: VisaSuccessItem[];
}

interface VisaSuccessSliderProps {
  items?: VisaSuccessItem[];
  rows?: VisaRowData[];
}

function formatStudentName(name?: string, country?: string): string {
  if (
    !name ||
    name.toLowerCase().includes('whatsapp') ||
    name.startsWith('IMG') ||
    name === 'Visa Success Poster' ||
    name === 'Student Visa Success' ||
    name.length > 35
  ) {
    if (country === 'Australia') return 'Australian Visa Scholar';
    if (country === 'United Kingdom') return 'UK Visa Scholar';
    return `${country || 'Global'} Visa Scholar`;
  }
  return name;
}

function formatUniversity(uni?: string, country?: string, program?: string): string {
  if (uni && uni.trim() && uni !== 'Global University') {
    return uni;
  }
  if (country === 'Australia') return 'Australian University (Subclass 500)';
  if (country === 'United Kingdom') return 'UK University (Student Route)';
  if (country === 'Canada') return 'Canadian Designated Institution (DLI)';
  if (country === 'United States') return 'US Accredited University (F-1)';
  return 'Accredited Partner University';
}

function getCountryFlag(country?: string): string {
  const c = (country || '').toLowerCase();
  if (c.includes('australia')) return '🇦🇺';
  if (c.includes('united kingdom') || c.includes('uk')) return '🇬🇧';
  if (c.includes('united states') || c.includes('usa') || c.includes('us')) return '🇺🇸';
  if (c.includes('canada')) return '🇨🇦';
  if (c.includes('germany')) return '🇩🇪';
  if (c.includes('ireland')) return '🇮🇪';
  return '🌍';
}

// Full-Section Skeleton Loader
function SectionSkeletonLoader() {
  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 text-slate-900 overflow-hidden shadow-xl border border-slate-200/90 select-none">
      <div className="absolute -top-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
        <div className="space-y-3">
          <div className="w-48 h-7 rounded-full bg-amber-100/70 animate-pulse border border-amber-200/60" />
          <div className="w-72 sm:w-96 h-9 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="w-64 sm:w-80 h-4 rounded-lg bg-slate-100 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-9 rounded-xl bg-slate-100 animate-pulse" />
          <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
          <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs space-y-3">
            <div className="relative aspect-[4/5] rounded-xl bg-slate-100 overflow-hidden flex flex-col items-center justify-center border border-slate-200/60">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin mb-2" />
              <div className="h-3 w-20 bg-slate-200/80 rounded animate-pulse" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-amber-100 rounded-full animate-pulse" />
              </div>
              <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-xs font-semibold text-amber-800 bg-amber-50/80 py-2 px-4 rounded-full max-w-sm mx-auto border border-amber-200">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0" />
        <span>Loading latest verified student visa results...</span>
      </div>
    </div>
  );
}

// Individual Visa Result Card (Enlarged Image, No Loader, Clear Text Without Click)
function VisaCard({
  item,
  onZoom,
}: {
  item: VisaSuccessItem;
  onZoom: (url: string) => void;
}) {
  const [imageError, setImageError] = useState(false);
  const countryFlag = getCountryFlag(item.country);

  return (
    <div
      onClick={() => onZoom(item.visaLetterImage)}
      className="h-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 p-2 sm:p-2.5 shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all duration-300 group cursor-pointer select-none"
    >
      {/* Visa Success Full Graphic / Poster Container - Extra Large A4 Document Proportion */}
      <div className="relative aspect-[1/1.36] sm:aspect-[1/1.38] rounded-xl overflow-hidden bg-slate-950/5 border border-slate-200/80">
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-4 flex flex-col justify-between text-white text-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Verified Grant
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
                {item.country} Student Visa
              </h4>
              <p className="text-xs text-amber-200/90 font-medium mt-1">
                Official Embassy Visa Grant Letter
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 font-medium">
              Click to view official grant letter
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950/5">
            {/* Ambient blur backdrop */}
            <img
              src={item.visaLetterImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-20 pointer-events-none"
            />
            {/* Crisp large foreground grant letter */}
            <img
              src={item.visaLetterImage}
              alt={`${item.country} Visa Grant Proof`}
              className="relative z-10 w-full h-full object-contain p-0.5 sm:p-1 group-hover:scale-102 transition-all duration-300 drop-shadow-sm select-none"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Top Floating Badge */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600/95 text-white shadow-xs">
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            {item.approvalDays || 'Visa Approved'}
          </span>
        </div>

        {/* Top Right Country Tag */}
        <div className="absolute top-2 right-2 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/90 backdrop-blur-xs text-amber-400 border border-amber-400/40 shadow-xs">
            <span>{countryFlag}</span>
            <span>{item.country}</span>
          </span>
        </div>

        {/* Hover Zoom Overlay */}
        <div className="absolute inset-0 z-20 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 text-slate-950 font-bold text-xs shadow-xl transform translate-y-1.5 group-hover:translate-y-0 transition-transform">
            <ZoomIn className="w-4 h-4 text-amber-600" /> Click to Zoom Full Proof
          </span>
        </div>
      </div>

      {/* Clean Slim Bottom Bar (No Student Name or University) */}
      <div className="mt-2.5 px-1 flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
          <span>{countryFlag}</span>
          <span className="truncate">{item.country} Visa Grant</span>
        </span>
        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
        </span>
      </div>
    </div>
  );
}

// Single Row Slider Subcomponent
function SingleRowSlider({
  row,
  cardsPerView,
  onZoom,
  isFirstRow = false,
}: {
  row: VisaRowData;
  cardsPerView: number;
  onZoom: (url: string) => void;
  isFirstRow?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayItems = (row.items || []).filter((it) => it.published !== false);
  const total = displayItems.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  // Auto-slide every 3.5 seconds (3 to 4 seconds) when not hovered
  useEffect(() => {
    if (maxIndex <= 0 || isPaused) return;
    const intervalTime = 3500;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, intervalTime);
    return () => clearInterval(timer);
  }, [maxIndex, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (total === 0) {
    return null;
  }

  const countryFlag = getCountryFlag(row.country);
  const highlightWord = row.highlightText || 'Visa Success Proofs';

  // Render title with highlight
  const renderTitle = () => {
    if (!row.title) {
      return (
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {countryFlag} {row.country} <span className="text-amber-600">Visa Success Proofs</span>
        </h3>
      );
    }
    if (row.title.includes(highlightWord)) {
      const parts = row.title.split(highlightWord);
      return (
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          <span className="mr-2 text-2xl">{countryFlag}</span>
          {parts[0]}
          <span className="text-amber-600">{highlightWord}</span>
          {parts[1]}
        </h3>
      );
    }
    return (
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <span className="text-2xl">{countryFlag}</span>
        <span>{row.title}</span>
      </h3>
    );
  };

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
        <div>
          {row.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>{row.badge}</span>
            </div>
          )}
          {renderTitle()}
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {row.subtitle ||
              `Real student visa grants and verified embassy approval letters for ${row.country}.`}
          </p>
        </div>

        {/* Row Slider Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline-block">
            {Math.min(currentIndex + cardsPerView, total)} of {total} grants
          </span>
          <button
            type="button"
            onClick={handlePrev}
            disabled={maxIndex === 0}
            aria-label="Previous Slide"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 transition cursor-pointer shadow-2xs disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={maxIndex === 0}
            aria-label="Next Slide"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 transition cursor-pointer shadow-2xs disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Slider Track */}
      <div className="relative overflow-hidden py-1">
        <div
          className="flex transition-transform duration-500 ease-out -mx-2 sm:-mx-2.5"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {displayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2 sm:px-3"
            >
              <VisaCard item={item} onZoom={onZoom} />
            </div>
          ))}
        </div>
      </div>

      {/* Row Slider Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-6 bg-amber-500'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main Component
export default function VisaSuccessSlider({ items = [], rows = [] }: VisaSuccessSliderProps) {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Responsive cards per view (3 cards on desktop for large, clear, readable visa letters)
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Determine active rows
  const activeRows: VisaRowData[] =
    rows && rows.length > 0
      ? rows
      : items && items.length > 0
      ? [
          {
            id: 'default-row',
            title: 'Recent Student Visa Success Proofs',
            highlightText: 'Visa Success Proofs',
            badge: 'Official Student Visa Approval Gallery',
            subtitle:
              'Real student visa grants, official consulate approval letters, and eVisa stamps across UK, USA, Canada, Australia, and Europe.',
            country: 'Global',
            limit: 10,
            enabled: true,
            items: items,
          },
        ]
      : [];

  const totalCards = activeRows.reduce((acc, r) => acc + (r.items?.length || 0), 0);

  if (totalCards === 0) {
    return null;
  }

  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 text-slate-900 overflow-hidden shadow-xl border border-slate-200/90 select-none space-y-10">
      {/* Soft Ambient Accents */}
      <div className="absolute -top-10 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Official Student Visa Approval Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recent Student <span className="text-amber-600">Visa Success Proofs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Real student visa grants, official consulate approval letters, and eVisa stamps across Australia, UK, and leading global destinations.
          </p>
        </div>

        {/* Global Action Link */}
        <div className="shrink-0">
          <Link
            href="/visa-success"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-2xs"
          >
            <span>View All Visa Proofs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Rows of Sliders (e.g. Row 1: Australia, Row 2: UK / Other) */}
      <div className="space-y-12 relative z-10">
        {activeRows.map((row, index) => (
          <div key={row.id || index} className="space-y-4">
            <SingleRowSlider
              row={row}
              cardsPerView={cardsPerView}
              onZoom={(url) => setPreviewImage(url)}
              isFirstRow={index === 0}
            />
            {index < activeRows.length - 1 && (
              <div className="pt-6 border-b border-slate-100" />
            )}
          </div>
        ))}
      </div>

      {/* High-Resolution Zoom Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 overflow-auto max-h-[78vh] flex items-center justify-center bg-slate-100 rounded-2xl p-2">
              <img
                src={previewImage}
                alt="Visa Grant Letter Full Preview"
                className="max-w-full max-h-[74vh] object-contain rounded-xl shadow-md"
              />
            </div>
            <div className="p-3 flex items-center justify-between text-xs text-slate-900 border-t border-slate-100 mt-2">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Official Verified Visa Grant Poster
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
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
