'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Globe2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface HeroSectionProps {
  settings?: any;
}

const UNIVERSITY_SLIDES = [
  {
    url: '/uploads/hero_australia_sydney_1920x1080.jpg',
    title: 'University of Sydney, Australia',
  },
  {
    url: '/uploads/hero_australia_melbourne_1920x1080.jpg',
    title: 'University of Melbourne, Australia',
  },
  {
    url: '/uploads/hero_australia_anu_unsw_1920x1080.jpg',
    title: 'Australian National University & UNSW',
  },
  {
    url: '/uploads/hero_uk_oxford_1920x1080.jpg',
    title: 'University of Oxford, UK',
  },
  {
    url: '/uploads/hero_uk_cambridge_1920x1080.jpg',
    title: 'University of Cambridge, UK',
  },
];

export default function HeroSection({ settings }: HeroSectionProps) {
  const slides = (Array.isArray(settings?.hero?.slides) && settings.hero.slides.length > 0)
    ? settings.hero.slides
    : (Array.isArray(settings?.heroSlides) && settings.heroSlides.length > 0)
      ? settings.heroSlides
      : UNIVERSITY_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);

  // Background Auto-Slider (transitions every 5 seconds)
  useEffect(() => {
    if (slides.length <= 1) {
      setCurrentSlide(0);
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const trustBadge = settings?.hero?.badge || settings?.hero?.trustBadge || 'British Council & PIER Certified Global Education Counselors';
  const headline = settings?.hero?.title || settings?.hero?.headline || 'Your Global Education Journey Starts Here ?';
  const subheadline = settings?.hero?.subtitle || settings?.hero?.subheadline || 'Expert guidance, university admissions, visa support, and personalized counseling to help you study at leading universities around the world.';
  const primaryCtaText = settings?.hero?.primaryCtaText || 'Book a Free Consultation';
  const primaryCtaHref = settings?.hero?.primaryCtaUrl || settings?.hero?.primaryCtaHref || '/book-appointment';
  const secondaryCtaText = settings?.hero?.secondaryCtaText || 'Explore Study Destinations';
  const secondaryCtaHref = settings?.hero?.secondaryCtaUrl || settings?.hero?.secondaryCtaHref || '/destinations';

  // Dynamic Stats fetched directly from DB (supports direct DB properties and array)
  const stat1Num = settings?.studentsPlaced || (Array.isArray(settings?.stats) ? settings.stats[0]?.number : settings?.stats?.studentsPlaced) || '5,000+';
  const stat1Lbl = settings?.studentsPlacedLabel || (Array.isArray(settings?.stats) ? settings.stats[0]?.label : settings?.stats?.studentsPlacedLabel) || 'Students Placed';

  const stat2Num = settings?.visaSuccessRate || (Array.isArray(settings?.stats) ? settings.stats[1]?.number : settings?.stats?.visaSuccessRate) || '98.6%';
  const stat2Lbl = settings?.visaSuccessRateLabel || (Array.isArray(settings?.stats) ? settings.stats[1]?.label : settings?.stats?.visaSuccessRateLabel) || 'Visa Approval Rate';

  const stat3Num = settings?.partnerUniversities || (Array.isArray(settings?.stats) ? settings.stats[2]?.number : settings?.stats?.partnerUniversities) || '120+';
  const stat3Lbl = settings?.partnerUniversitiesLabel || (Array.isArray(settings?.stats) ? settings.stats[2]?.label : settings?.stats?.partnerUniversitiesLabel) || 'Partner Universities';

  // Dynamic Floating Badges (Editable from Admin Panel)
  const badge1Value = settings?.hero?.floatingBadge1Value || `${stat2Num} Success`;
  const badge1Label = settings?.hero?.floatingBadge1Label || 'Visa Granted Record';
  const badge2Value = settings?.hero?.floatingBadge2Value || 'Top 1% Global';
  const badge2Label = settings?.hero?.floatingBadge2Label || 'Ivy & Russell Group';
  const badge3Category = settings?.hero?.floatingBadgeCategory || 'Top Universities';
  const badge3Title = settings?.hero?.floatingBadgeTitle || 'Top Universities in Australia';
  const badge3Highlight = settings?.hero?.floatingBadgeHighlight || 'Group of Eight (Go8)';

  let statCounters = [
    { number: stat1Num, label: stat1Lbl },
    { number: stat2Num, label: stat2Lbl },
    { number: stat3Num, label: stat3Lbl },
  ];

  return (
    <section className="relative min-h-[520px] lg:min-h-[560px] flex flex-col justify-between overflow-hidden border-b border-slate-200/80 pt-4 pb-5 sm:pt-6 sm:pb-6 bg-slate-900">
      {/* 1. Crystal Clear Background Slider (UK & Australia Top Universities) */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        {slides.map((slide: any, idx: number) => {
          const slideUrl = typeof slide === 'string' ? slide : (slide?.url || slide?.imageUrl || '');
          const slideTitle = typeof slide === 'string' ? 'University Campus' : (slide?.title || 'University Campus');
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
              }`}
              style={{ transition: 'opacity 1.2s ease-in-out, transform 8s ease-out' }}
            >
              <Image
                src={slideUrl}
                alt={slideTitle}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          );
        })}

        {/* Balanced Natural Overlay: Soft light top gradient for clear text readability without washing out background */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/75 via-white/35 to-white/10 pointer-events-none" />
      </div>

      {/* 2. Floating Badges (Desktop Right Side) */}
      <div className="hidden lg:block absolute right-6 sm:right-10 xl:right-16 top-16 z-30 space-y-3 pointer-events-none">
        {/* Floating Badge 1: 98.6% Visa Success */}
        <div className="p-2.5 px-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-lg shadow-slate-900/10 backdrop-blur-md animate-float flex items-center gap-2.5 w-60 pointer-events-auto">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{badge1Value}</div>
            <div className="text-[10px] text-slate-500 font-medium">{badge1Label}</div>
          </div>
        </div>

        {/* Floating Badge 2: Top 1% Global */}
        <div className="p-2.5 px-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-lg shadow-slate-900/10 backdrop-blur-md animate-float-slow flex items-center gap-2.5 w-60 pointer-events-auto ml-4">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-700">{badge2Value}</div>
            <div className="text-[10px] text-slate-500 font-medium">{badge2Label}</div>
          </div>
        </div>

        {/* Floating Badge 3: Top Universities in Australia (Fully Editable) */}
        <div className="p-2.5 px-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-lg shadow-slate-900/10 backdrop-blur-md animate-float flex items-center justify-between w-64 pointer-events-auto">
          <div className="min-w-0 pr-2">
            <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider truncate">
              {badge3Category}
            </div>
            <div className="text-xs font-bold text-slate-900 truncate" title={badge3Title}>
              {badge3Title}
            </div>
            <div className="text-[10px] text-amber-600 font-bold mt-0.5 truncate">
              {badge3Highlight}
            </div>
          </div>
          <span className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 3. Main Center Content (Headlines & CTAs) */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-2 sm:pt-4">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-slate-200 shadow-xs text-xs font-semibold text-slate-700 mb-3.5 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{trustBadge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] mb-3 drop-shadow-xs">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl mx-auto mb-5 font-medium">
          {subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={primaryCtaHref}
            prefetch={true}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 hover:scale-[1.02] active:brightness-95 transition-all"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={secondaryCtaHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white/95 text-slate-800 border border-slate-200 shadow-xs hover:bg-white hover:border-slate-300 backdrop-blur-md transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-600" />
            <span>{secondaryCtaText}</span>
          </Link>
        </div>
      </div>

      {/* 4. Bottom Floating Frosted Glass Statistics Bar + Slide Indicator */}
      <div className="relative z-30 max-w-2xl mx-auto px-4 sm:px-6 w-full mt-6 sm:mt-7 space-y-2">
        <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-900/10 py-3.5 px-6 sm:px-8 grid grid-cols-3 gap-2 sm:gap-4 text-center divide-x divide-slate-200/80">
          {/* Stat 1 */}
          <div className="px-1.5">
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {statCounters[0].number}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">
              {statCounters[0].label}
            </div>
          </div>

          {/* Stat 2 */}
          <div className="px-1.5">
            <div className="text-lg sm:text-2xl font-black text-amber-600 tracking-tight">
              {statCounters[1].number}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">
              {statCounters[1].label}
            </div>
          </div>

          {/* Stat 3 */}
          <div className="px-1.5">
            <div className="text-lg sm:text-2xl font-black text-cyan-700 tracking-tight">
              {statCounters[2].number}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">
              {statCounters[2].label}
            </div>
          </div>
        </div>

        {/* Subtle Slide Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {slides.map((_: any, dotIdx: number) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentSlide(dotIdx)}
              aria-label={`Slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === currentSlide
                  ? 'w-5 bg-amber-500 shadow-xs'
                  : 'w-1.5 bg-slate-300/80 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



