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
} from 'lucide-react';
import { VisaSuccessItem } from '@/lib/types';

interface VisaSuccessSliderProps {
  items: VisaSuccessItem[];
}

// 1. Full-Section Skeleton Loader (Runs on live server during page load or if results are not loaded yet)
function SectionSkeletonLoader() {
  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 text-slate-900 overflow-hidden shadow-xl border border-slate-200/90 select-none">
      {/* Background soft ambient accents */}
      <div className="absolute -top-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Skeleton */}
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

      {/* 4 Cards Skeleton Grid (4 results displayed side-by-side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs space-y-3">
            {/* Image Skeleton with spinner */}
            <div className="relative aspect-[4/5] rounded-xl bg-slate-100 overflow-hidden flex flex-col items-center justify-center border border-slate-200/60">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin mb-2" />
              <div className="h-3 w-20 bg-slate-200/80 rounded animate-pulse" />
            </div>
            {/* Meta Skeletons */}
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

      {/* Status loader tag */}
      <div className="flex items-center justify-center gap-2 mt-6 text-xs font-semibold text-amber-800 bg-amber-50/80 py-2 px-4 rounded-full max-w-sm mx-auto border border-amber-200">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0" />
        <span>Loading latest verified student visa results...</span>
      </div>
    </div>
  );
}

// 2. Individual Visa Result Card with Per-Card Shimmer & Error Fallback
function VisaCard({
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

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 p-3.5 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 group">
      {/* Visa Success Full Graphic / Poster Container */}
      <div
        className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer group-hover:shadow-md transition-all select-none"
        onClick={() => onZoom(item.visaLetterImage)}
      >
        {/* Subtle background pulse while downloading */}
        {!isLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          </div>
        )}

        {/* Fallback branded certificate if image fails to load or link is broken */}
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-4 flex flex-col justify-between text-white text-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
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
                {item.studentName}
              </h4>
              <p className="text-[11px] text-amber-200/90 font-medium mt-0.5">
                {item.country} Visa Approved
              </p>
              <div className="mt-2 inline-block px-2.5 py-1 rounded-md bg-white/10 text-[10px] text-slate-200 border border-white/15 truncate max-w-full">
                {item.university}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[9px] text-slate-400 font-medium">
              Official Embassy Visa Grant Letter
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
              alt={`${item.studentName} Visa Success Poster`}
              className="relative z-10 w-full h-full object-contain p-1.5 group-hover:scale-105 transition-all duration-300 drop-shadow-xs select-none"
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Top Floating Badge */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md">
            <CheckCircle2 className="w-3 h-3 text-white" />
            {item.approvalDays || 'Visa Approved'}
          </span>
        </div>

        {/* Top Right Verified Seal */}
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/80 backdrop-blur-xs text-amber-400 border border-amber-400/40 shadow-xs">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Verified
          </span>
        </div>

        {/* Hover Zoom Overlay */}
        <div className="absolute inset-0 z-20 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <ZoomIn className="w-3.5 h-3.5 text-amber-600" /> Click to Zoom Proof
          </span>
        </div>
      </div>

      {/* Bottom Card Meta Details */}
      <div className="mt-3 space-y-2">
        {/* Student Name & Target Country Badge */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
            {item.studentName}
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
            <Globe className="w-2.5 h-2.5 text-amber-700" />
            {item.country}
          </span>
        </div>

        {/* University & Degree Information Box */}
        <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] truncate">
            <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{item.university}</span>
          </div>
          {item.program && item.program !== 'Academic Degree Program' && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate pl-5">
              <span className="truncate">{item.program}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. Main Slider Component displaying 4 Result Cards at a Time
export default function VisaSuccessSlider({ items = [] }: VisaSuccessSliderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Client hydration check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Responsive cards per view (1 on mobile, 2 on tablet, 4 on desktop)
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const displayItems = items.filter((it) => it.published !== false);
  const total = displayItems.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  // Auto-slide every 4.5 seconds when not hovered
  useEffect(() => {
    if (maxIndex <= 0 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [maxIndex, isPaused]);

  // If no items loaded yet or list is empty, show the full-section skeleton loader
  if (total === 0) {
    return <SectionSkeletonLoader />;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div
      className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 text-slate-900 overflow-hidden shadow-xl border border-slate-200/90 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background soft ambient accents */}
      <div className="absolute -top-10 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Slider Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Official Student Visa Approval Gallery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recent Student <span className="text-amber-600">Visa Success Proofs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Real student visa grants, official consulate approval letters, and eVisa stamps across UK, USA, Canada, Australia, and Europe.
          </p>
        </div>

        {/* Action Button & Slider Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/visa-success"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-2xs"
          >
            <span>View All Visa Proofs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-1.5">
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
      </div>

      {/* The Slider Container (Displays 4 cards simultaneously on desktop) */}
      <div className="relative overflow-hidden py-2">
        <div
          className="flex transition-transform duration-500 ease-out -mx-2 sm:-mx-2.5"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {displayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2 sm:px-2.5"
            >
              <VisaCard
                item={item}
                onZoom={(url) => setPreviewImage(url)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slider Navigation Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-6 relative z-10">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-6 bg-amber-500'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}

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
