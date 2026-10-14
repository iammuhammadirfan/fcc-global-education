'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutTemplate, Save, RefreshCw, Eye, CheckCircle2, 
  XCircle, MoveUp, MoveDown, Layers, Sparkles, UserCheck, 
  Upload, Image as ImageIcon, Trash2, EyeOff, Plus, RotateCcw,
  Globe, Building, Info, Check, ShieldCheck, GraduationCap,
  Phone, CalendarCheck, ArrowRight, Bell
} from 'lucide-react';
import { HomepageConfig } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

const DEFAULT_HERO_SLIDES = [
  { url: '/uploads/hero_australia_sydney_1920x1080.jpg' },
  { url: '/uploads/hero_australia_melbourne_1920x1080.jpg' },
  { url: '/uploads/hero_australia_anu_unsw_1920x1080.jpg' },
  { url: '/uploads/hero_uk_oxford_1920x1080.jpg' },
  { url: '/uploads/hero_uk_cambridge_1920x1080.jpg' },
];

const PRESET_HIGH_RES_UNIVERSITIES = [
  {
    name: 'University of Sydney (Australia)',
    url: '/uploads/hero_australia_sydney_1920x1080.jpg',
    country: 'Australia',
  },
  {
    name: 'University of Melbourne (Australia)',
    url: '/uploads/hero_australia_melbourne_1920x1080.jpg',
    country: 'Australia',
  },
  {
    name: 'ANU & UNSW (Australia)',
    url: '/uploads/hero_australia_anu_unsw_1920x1080.jpg',
    country: 'Australia',
  },
  {
    name: 'University of Oxford (UK)',
    url: '/uploads/hero_uk_oxford_1920x1080.jpg',
    country: 'United Kingdom',
  },
  {
    name: 'University of Cambridge (UK)',
    url: '/uploads/hero_uk_cambridge_1920x1080.jpg',
    country: 'United Kingdom',
  },
];

export default function AdminHomepageCMS() {
  const [config, setConfig] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingCEO, setUploadingCEO] = useState(false);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      if (data.success && data.homepage) {
        const hp = data.homepage;

        // Normalize stats array
        let statsArray: any[] = [];
        if (Array.isArray(hp.stats)) {
          statsArray = hp.stats;
        } else if (hp.stats && typeof hp.stats === 'object') {
          statsArray = [
            { number: hp.stats.studentsPlaced || '5,000+', label: hp.stats.studentsPlacedLabel || 'Students Placed' },
            { number: hp.stats.visaSuccessRate || '98.6%', label: hp.stats.visaSuccessRateLabel || 'Visa Approval Rate' },
            { number: hp.stats.partnerUniversities || '120+', label: hp.stats.partnerUniversitiesLabel || 'Partner Universities' },
            { number: hp.stats.scholarshipsSecured || '$14.2M+', label: hp.stats.scholarshipsSecuredLabel || 'Scholarships Secured' },
          ];
        } else {
          statsArray = [
            { number: '5,000+', label: 'Students Placed' },
            { number: '98.6%', label: 'Visa Approval Rate' },
            { number: '120+', label: 'Partner Universities' },
            { number: '$14.2M+', label: 'Scholarships Secured' },
          ];
        }

        const topBarObj = {
          enabled: hp.topBar?.enabled !== false,
          tag: hp.topBar?.tag ?? 'Fall 2026 / Spring 2027',
          text: hp.topBar?.text ?? 'Admissions open for top global universities. Free profile assessment!',
          visaTag: hp.topBar?.visaTag ?? '98.6% Visa Approval',
          phone: hp.topBar?.phone ?? '+44 (0) 20 7946 0912',
          ctaLabel: hp.topBar?.ctaLabel ?? 'Book Free Consultation',
          ctaHref: hp.topBar?.ctaHref ?? '/book-appointment',
        };

        const heroSlides = Array.isArray(hp.hero?.slides) && hp.hero.slides.length > 0
          ? hp.hero.slides.map((s: any) => typeof s === 'string' ? { url: s } : { url: s.url || s.imageUrl || '' })
          : DEFAULT_HERO_SLIDES;

        const heroObj = {
          badge: hp.hero?.badge || hp.hero?.trustBadge || 'British Council Certified Consultants',
          title: hp.hero?.title || hp.hero?.headline || 'Your Global Education Journey Starts Here',
          subtitle: hp.hero?.subtitle || hp.hero?.subheadline || 'Expert guidance, university admissions, and visa support...',
          primaryCtaText: hp.hero?.primaryCtaText || 'Book Free Consultation',
          primaryCtaUrl: hp.hero?.primaryCtaUrl || hp.hero?.primaryCtaHref || '/book-appointment',
          secondaryCtaUrl: hp.hero?.secondaryCtaUrl || hp.hero?.secondaryCtaHref || '/destinations',
          heroImage: hp.hero?.heroImage || hp.hero?.heroImageUrl || '/uploads/hero_australia_sydney_1920x1080.jpg',
          // Floating Badges on Hero Banner (Task 2: Editable Top Universities in Australia)
          floatingBadgeCategory: hp.hero?.floatingBadgeCategory || 'Top Universities',
          floatingBadgeTitle: hp.hero?.floatingBadgeTitle || 'Top Universities in Australia',
          floatingBadgeHighlight: hp.hero?.floatingBadgeHighlight || 'Group of Eight (Go8)',
          floatingBadge1Value: hp.hero?.floatingBadge1Value || '98.6% Success',
          floatingBadge1Label: hp.hero?.floatingBadge1Label || 'Visa Granted Record',
          floatingBadge2Value: hp.hero?.floatingBadge2Value || 'Top 1% Global',
          floatingBadge2Label: hp.hero?.floatingBadge2Label || 'Ivy & Russell Group',
          slides: heroSlides,
        };

        const ceoObj = {
          enabled: hp.ceoSection?.enabled !== false,
          name: hp.ceoSection?.name || 'Dr. Farhan Chaudhry',
          title: hp.ceoSection?.title || 'Founder & Chief Executive Officer',
          badge: hp.ceoSection?.badge || "Founder's Vision & Leadership",
          heading: hp.ceoSection?.heading || "Empowering Global Aspirations With Proven Expertise & Honesty",
          quote: hp.ceoSection?.quote || "Every student who walks through our doors is not just an application — they are a future leader with unique potential. We exist to open the world's most prestigious university doors for them.",
          bio: hp.ceoSection?.bio || "With over 15 years of distinguished leadership in global education counseling, student visa strategy, and university admissions partnerships, our team has steered thousands of candidates to top-ranked institutions across the UK, USA, Canada, Australia, and Europe.",
          photoUrl: hp.ceoSection?.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
          experienceYears: hp.ceoSection?.experienceYears || '15+',
          statsLabel: hp.ceoSection?.statsLabel || 'Years of Global Admissions Leadership',
          credentials: (hp.ceoSection?.credentials && Array.isArray(hp.ceoSection.credentials))
            ? hp.ceoSection.credentials.join(', ')
            : 'PIER (QEAC) Certified Education Counselor, British Council Certified Global Agent, 100% Transparency & Direct University Partnerships',
          signatureText: hp.ceoSection?.signatureText || 'Dr. Farhan Chaudhry',
          ctaText: hp.ceoSection?.ctaText || 'Book Consultation with Leadership',
          ctaHref: hp.ceoSection?.ctaHref || '/book-appointment',
        };

        const sectionsArr = Array.isArray(hp.sections) ? hp.sections : [];

        setConfig({
          ...hp,
          topBar: topBarObj,
          hero: heroObj,
          ceoSection: ceoObj,
          stats: statsArray,
          sections: sectionsArr,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config) return;
    setSaving(true);
    try {
      // Normalize direct statistics properties so any page gets them directly from DB
      const s0 = config.stats?.[0]?.number || '5,000+';
      const s0Label = config.stats?.[0]?.label || 'Students Placed';
      const s1 = config.stats?.[1]?.number || '98.6%';
      const s1Label = config.stats?.[1]?.label || 'Visa Approval Rate';
      const s2 = config.stats?.[2]?.number || '120+';
      const s2Label = config.stats?.[2]?.label || 'Partner Universities';
      const s3 = config.stats?.[3]?.number || '$14.2M+';
      const s3Label = config.stats?.[3]?.label || 'Scholarships Secured';

      // Normalize CEO credentials to array before saving
      const payload = {
        ...config,
        topBar: config.topBar,
        studentsPlaced: s0,
        studentsPlacedLabel: s0Label,
        visaSuccessRate: s1,
        visaSuccessRateLabel: s1Label,
        partnerUniversities: s2,
        partnerUniversitiesLabel: s2Label,
        scholarshipsSecured: s3,
        scholarshipsSecuredLabel: s3Label,
        stats: config.stats,
        ceoSection: {
          ...config.ceoSection,
          credentials: typeof config.ceoSection?.credentials === 'string'
            ? config.ceoSection.credentials.split(',').map((s: string) => s.trim()).filter(Boolean)
            : (config.ceoSection?.credentials || []),
        }
      };

      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        alert(data.error || 'Failed to save homepage settings');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCEOPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    try {
      setUploadingCEO(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'team');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.media?.url) {
        setConfig({
          ...config,
          ceoSection: {
            ...config.ceoSection,
            photoUrl: data.media.url,
          },
        });
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error(err);
      alert('Photo upload failed');
    } finally {
      setUploadingCEO(false);
    }
  };



  // Hero Background Slider Handlers (Simplified: Image-only per user instruction)
  const handleAddSlide = (presetUrl?: string) => {
    if (!config) return;
    const currentSlides = Array.isArray(config.hero?.slides) ? config.hero.slides : [];
    const newSlide = {
      url: presetUrl || '/uploads/hero_australia_sydney_1920x1080.jpg',
    };
    setConfig({
      ...config,
      hero: {
        ...config.hero,
        slides: [...currentSlides, newSlide],
      },
    });
  };

  const handleUpdateSlideUrl = (index: number, url: string) => {
    if (!config) return;
    const currentSlides = [...(Array.isArray(config.hero?.slides) ? config.hero.slides : [])];
    if (!currentSlides[index]) return;
    currentSlides[index] = { url };
    setConfig({
      ...config,
      hero: {
        ...config.hero,
        slides: currentSlides,
      },
    });
  };

  const handleDeleteSlide = (index: number) => {
    if (!config) return;
    const currentSlides = [...(Array.isArray(config.hero?.slides) ? config.hero.slides : [])];
    if (currentSlides.length <= 1) {
      alert('You must keep at least 1 background slide in the Hero Carousel.');
      return;
    }
    currentSlides.splice(index, 1);
    setConfig({
      ...config,
      hero: {
        ...config.hero,
        slides: currentSlides,
      },
    });
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const currentSlides = [...(Array.isArray(config.hero?.slides) ? config.hero.slides : [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;
    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;
    setConfig({
      ...config,
      hero: {
        ...config.hero,
        slides: currentSlides,
      },
    });
  };

  const handleResetSlides = () => {
    if (!config) return;
    if (confirm('Reset hero background slides back to default UK & Australia universities?')) {
      setConfig({
        ...config,
        hero: {
          ...config.hero,
          slides: [...DEFAULT_HERO_SLIDES],
        },
      });
    }
  };

  if (loading || !config) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
        <p className="font-semibold text-sm">Loading Homepage CMS Settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header (Sticky Bar - stays fixed at top while scrolling) */}
      <div className="sticky top-0 z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-md transition-all">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            Homepage CMS & Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize the Hero Banner, Founder/CEO Message Section, Metric Counters, and page sections.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Live Homepage</span>
          </a>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:brightness-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Homepage configuration and header announcement bar saved successfully and live on the website!</span>
        </div>
      )}

      {/* SECTION 1: TOP HEADER ANNOUNCEMENT & NOTIFICATION BAR CMS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              Top Header Announcement & Notification Bar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the announcement banner displayed at the very top of the website (intake badge, notice text, visa approval tag, helpline phone, and consultation CTA).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset to defaults button */}
            <button
              type="button"
              onClick={() => setConfig({
                ...config,
                topBar: {
                  enabled: true,
                  tag: 'Fall 2026 / Spring 2027',
                  text: 'Admissions open for top global universities. Free profile assessment!',
                  visaTag: '98.6% Visa Approval',
                  phone: '+44 (0) 20 7946 0912',
                  ctaLabel: 'Book Free Consultation',
                  ctaHref: '/book-appointment',
                },
              })}
              title="Reset announcement bar to default values"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            {/* Visibility ON/OFF Toggle */}
            <button
              type="button"
              onClick={() => setConfig({
                ...config,
                topBar: {
                  ...config?.topBar,
                  enabled: config?.topBar?.enabled === false ? true : false,
                },
              })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                config?.topBar?.enabled !== false
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
              }`}
            >
              {config?.topBar?.enabled !== false ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Top Bar: ON (Visible)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                  <span>Top Bar: OFF (Hidden)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Box (Matches website top bar exactly) */}
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/40 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              Live Header Bar Preview (how visitors see it):
            </span>
            <span className={`font-semibold ${config?.topBar?.enabled !== false ? 'text-emerald-700' : 'text-rose-600'}`}>
              {config?.topBar?.enabled !== false ? '● Currently Active' : '● Hidden from Visitors'}
            </span>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-amber-50 via-white to-amber-50 text-slate-800 text-xs py-2 px-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 overflow-hidden">
            {/* Left: Tag + Message */}
            <div className="flex items-center gap-2 min-w-0">
              {config?.topBar?.tag && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shadow-2xs shrink-0">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-700 shrink-0" />
                  {config?.topBar?.tag}
                </span>
              )}
              {config?.topBar?.text && (
                <span className="text-slate-600 font-medium text-[12px] truncate">
                  {config?.topBar?.text}
                </span>
              )}
            </div>

            {/* Right: Visa, Phone, CTA button */}
            <div className="flex items-center gap-3 shrink-0">
              {config?.topBar?.visaTag && (
                <div className="hidden sm:inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{config?.topBar?.visaTag}</span>
                </div>
              )}

              {config?.topBar?.phone && (
                <div className="hidden md:flex items-center gap-1 text-slate-700 font-semibold text-[11px] whitespace-nowrap">
                  <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{config?.topBar?.phone}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xs whitespace-nowrap">
                <CalendarCheck className="w-3 h-3 text-slate-950 shrink-0" />
                <span>{config?.topBar?.ctaLabel || 'Book Free Consultation'}</span>
                <ArrowRight className="w-3 h-3 text-slate-950 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
          {/* 1. Intake / Season Tag */}
          <div>
            <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Intake Season Highlight Badge
            </label>
            <input
              type="text"
              value={config?.topBar?.tag ?? ''}
              onChange={(e) => setConfig({
                ...config,
                topBar: { ...config?.topBar, tag: e.target.value }
              })}
              placeholder="e.g. Fall 2026 / Spring 2027"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Yellow pill badge with sparkle icon</p>
          </div>

          {/* 2. Announcement Message Text */}
          <div className="sm:col-span-2">
            <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              Announcement Notice Text
            </label>
            <input
              type="text"
              value={config?.topBar?.text ?? ''}
              onChange={(e) => setConfig({
                ...config,
                topBar: { ...config?.topBar, text: e.target.value }
              })}
              placeholder="e.g. Admissions open for top global universities. Free profile assessment!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Main notification text displayed beside the badge</p>
          </div>

          {/* 3. Visa Approval Tag */}
          <div>
            <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Visa Approval Trust Badge
            </label>
            <input
              type="text"
              value={config?.topBar?.visaTag ?? ''}
              onChange={(e) => setConfig({
                ...config,
                topBar: { ...config?.topBar, visaTag: e.target.value }
              })}
              placeholder="e.g. 98.6% Visa Approval"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Green trust badge showing approval rate</p>
          </div>

          {/* 4. Phone Number */}
          <div>
            <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              Helpline Phone Number
            </label>
            <input
              type="text"
              value={config?.topBar?.phone ?? ''}
              onChange={(e) => setConfig({
                ...config,
                topBar: { ...config?.topBar, phone: e.target.value }
              })}
              placeholder="e.g. +44 (0) 20 7946 0912"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Direct click-to-call phone number</p>
          </div>

          {/* 5. Button Text */}
          <div>
            <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
              Action Button Label
            </label>
            <input
              type="text"
              value={config?.topBar?.ctaLabel ?? ''}
              onChange={(e) => setConfig({
                ...config,
                topBar: { ...config?.topBar, ctaLabel: e.target.value }
              })}
              placeholder="e.g. Book Free Consultation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Orange button call-to-action text</p>
          </div>

          {/* 6. Button Link */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              Action Button URL / Destination Link
            </label>
            <input
              type="text"
              value={config?.topBar?.ctaHref ?? ''}
              onChange={(e) => setConfig({
                ...config,
                topBar: { ...config?.topBar, ctaHref: e.target.value }
              })}
              placeholder="e.g. /book-appointment"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Target link (e.g. /book-appointment, /contact, or external link)</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: FOUNDER & CEO MESSAGE / INTRODUCTION CMS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              Founder & CEO Message / Introduction Section
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showcase your Chief Executive Officer, personal message, photo, credentials, and leadership story on the Homepage.
            </p>
          </div>

          {/* Visibility ON/OFF Toggle */}
          <button
            type="button"
            onClick={() => setConfig({
              ...config,
              ceoSection: {
                ...config.ceoSection,
                enabled: !config.ceoSection?.enabled,
              },
            })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
              config.ceoSection?.enabled
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
            }`}
          >
            {config.ceoSection?.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>CEO Section: ON (Showing)</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                <span>CEO Section: OFF (Hidden)</span>
              </>
            )}
          </button>
        </div>

        {/* CEO Photo Upload & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* CEO Photo Upload Column */}
          <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <ImageUploadInput
              label="CEO Portrait Photo"
              value={config.ceoSection?.photoUrl || ''}
              onChange={(url) => setConfig({
                ...config,
                ceoSection: { ...config.ceoSection, photoUrl: url }
              })}
              placeholder="https://... or upload photo"
              category="team"
              dark={false}
              helperText="Upload portrait photo of the CEO (saved to database)"
            />
          </div>

          {/* CEO Content Details Form */}
          <div className="lg:col-span-8 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">CEO Full Name</label>
                <input
                  type="text"
                  value={config.ceoSection?.name || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, name: e.target.value }
                  })}
                  placeholder="e.g. Dr. Farhan Chaudhry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Official Title & Designation</label>
                <input
                  type="text"
                  value={config.ceoSection?.title || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, title: e.target.value }
                  })}
                  placeholder="e.g. Founder & Chief Executive Officer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Section Badge Label</label>
                <input
                  type="text"
                  value={config.ceoSection?.badge || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, badge: e.target.value }
                  })}
                  placeholder="e.g. Founder's Vision & Leadership"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Years of Experience (Badge Number)</label>
                <input
                  type="text"
                  value={config.ceoSection?.experienceYears || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, experienceYears: e.target.value }
                  })}
                  placeholder="e.g. 15+"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Section Main Headline</label>
              <input
                type="text"
                value={config.ceoSection?.heading || ''}
                onChange={(e) => setConfig({
                  ...config,
                  ceoSection: { ...config.ceoSection, heading: e.target.value }
                })}
                placeholder="Empowering Global Aspirations With Proven Expertise & Honesty"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">CEO Inspirational Quote / Message</label>
              <textarea
                rows={2}
                value={config.ceoSection?.quote || ''}
                onChange={(e) => setConfig({
                  ...config,
                  ceoSection: { ...config.ceoSection, quote: e.target.value }
                })}
                placeholder="Every student who walks through our doors is not just an application..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Short Bio / Introductory Paragraph</label>
              <textarea
                rows={3}
                value={config.ceoSection?.bio || ''}
                onChange={(e) => setConfig({
                  ...config,
                  ceoSection: { ...config.ceoSection, bio: e.target.value }
                })}
                placeholder="With over 15 years of distinguished leadership in global education counseling..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Professional Credentials (comma-separated bullet points)
              </label>
              <input
                type="text"
                value={config.ceoSection?.credentials || ''}
                onChange={(e) => setConfig({
                  ...config,
                  ceoSection: { ...config.ceoSection, credentials: e.target.value }
                })}
                placeholder="PIER (QEAC) Certified, British Council Certified Agent, 100% Direct University Partnerships"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Signature Text</label>
                <input
                  type="text"
                  value={config.ceoSection?.signatureText || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, signatureText: e.target.value }
                  })}
                  placeholder="e.g. Farhan Chaudhry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">CTA Button Label</label>
                <input
                  type="text"
                  value={config.ceoSection?.ctaText || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, ctaText: e.target.value }
                  })}
                  placeholder="Book Consultation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">CTA Button Link</label>
                <input
                  type="text"
                  value={config.ceoSection?.ctaHref || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    ceoSection: { ...config.ceoSection, ctaHref: e.target.value }
                  })}
                  placeholder="/book-appointment"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION: HOMEPAGE VISA SUCCESS SHOWCASE */}
      <div className="bg-white border-2 border-amber-300/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Student Visa Success Showcase (2 Rows Slider)
              </h2>
              <p className="text-xs text-slate-500">
                Row 1: Australia (10 posters) • Row 2: United Kingdom &amp; Global (10 posters)
              </p>
            </div>
          </div>

          <Link
            href="/admin/visa-success"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <span>Manage 2 Rows &amp; Posters in Visa CMS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-bold text-slate-900">2 Rows Configured For Homepage:</div>
            <div>• <span className="font-semibold text-slate-800">Row 1:</span> Australia Student Visa Success Proofs (Top Row)</div>
            <div>• <span className="font-semibold text-slate-800">Row 2:</span> United Kingdom Student Visa Success Proofs (Second Row)</div>
          </div>
          <Link
            href="/admin/visa-success"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 underline shrink-0"
          >
            Edit Headings, Countries &amp; Posters &rarr;
          </Link>
        </div>
      </div>

      {/* SECTION 3: HERO BANNER SETTINGS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Hero Banner Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Hero Badge Label</label>
            <input
              type="text"
              value={config.hero?.badge || ''}
              onChange={(e) => setConfig({ ...config, hero: { ...config.hero, badge: e.target.value } })}
              placeholder="e.g. British Council Certified Consultants"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Secondary CTA Link</label>
            <input
              type="text"
              value={config.hero?.secondaryCtaUrl || ''}
              onChange={(e) => setConfig({ ...config, hero: { ...config.hero, secondaryCtaUrl: e.target.value } })}
              placeholder="/destinations"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="block text-slate-700 font-bold">Hero Headline (H1)</label>
          <input
            type="text"
            value={config.hero?.title || ''}
            onChange={(e) => setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
            placeholder="Global Education Consultancy Headline"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="block text-slate-700 font-bold">Hero Subtitle</label>
          <textarea
            rows={2}
            value={config.hero?.subtitle || ''}
            onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
            placeholder="Subtitle describing admission success, scholarships, and visa guidance..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Primary CTA Text</label>
            <input
              type="text"
              value={config.hero?.primaryCtaText || ''}
              onChange={(e) => setConfig({ ...config, hero: { ...config.hero, primaryCtaText: e.target.value } })}
              placeholder="Book Free Consultation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Primary CTA URL</label>
            <input
              type="text"
              value={config.hero?.primaryCtaUrl || ''}
              onChange={(e) => setConfig({ ...config, hero: { ...config.hero, primaryCtaUrl: e.target.value } })}
              placeholder="/book-appointment"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>
        </div>

        {/* HERO FLOATING BADGES CMS (Task 2: Editable Top Universities in Australia Badge) */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Hero Floating Badges (Desktop Overlay Cards)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the 3 interactive floating badges shown on the right side of the Hero section.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* Badge 3: Top Universities in Australia (Priority Task 2) */}
            <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Badge #3 (Australia Highlight Card)
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Hero Right
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                Replaces the default &quot;Latest Admission&quot; card with your custom university highlight.
              </p>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge Category / Top Label</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadgeCategory || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadgeCategory: e.target.value } })}
                  placeholder="e.g. Top Universities"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge Main Title</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadgeTitle || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadgeTitle: e.target.value } })}
                  placeholder="e.g. Top Universities in Australia"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge Highlight / Subtitle</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadgeHighlight || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadgeHighlight: e.target.value } })}
                  placeholder="e.g. Group of Eight (Go8)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Badge 1: Visa Approval Record */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Badge #1 (Visa Success)
                </span>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Main Value / Stat</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadge1Value || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadge1Value: e.target.value } })}
                  placeholder="e.g. 98.6% Success"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtext / Label</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadge1Label || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadge1Label: e.target.value } })}
                  placeholder="e.g. Visa Granted Record"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Badge 2: Global Ranking Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  Badge #2 (Global Ranking)
                </span>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Main Value / Stat</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadge2Value || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadge2Value: e.target.value } })}
                  placeholder="e.g. Top 1% Global"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtext / Label</label>
                <input
                  type="text"
                  value={config.hero?.floatingBadge2Label || ''}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingBadge2Label: e.target.value } })}
                  placeholder="e.g. Ivy & Russell Group"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* HERO BACKGROUND CAROUSEL SLIDER CMS (Image-Only, Clean Minimalist UI) */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                Hero Background Slider Images (Carousel Manager)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage high-resolution background landscape images that transition automatically on the Homepage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSlides}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Restore default 5 UK & Australia slides"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 5 Default Slides</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddSlide()}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:brightness-95 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Slide</span>
              </button>
            </div>
          </div>

          {/* RESOLUTION & FORMAT GUIDELINES BANNER */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 border border-blue-200/80 space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  Recommended Image Resolution & Specifications:
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  <span className="font-semibold text-slate-800">Resolution:</span> <strong>1920 × 1080 px</strong> (Full HD 16:9 Landscape) or <strong>2560 × 1440 px</strong>.
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="font-semibold text-slate-800">Format:</span> WebP, JPG, or PNG.
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="font-semibold text-slate-800">File Size:</span> Recommended under <strong>1.5MB – 2MB</strong> for fastest page loading speed.
                </div>
              </div>
            </div>

            {/* Quick 1-Click Preset Buttons */}
            <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">Quick-Add Presets (3 Australia + 2 UK):</span>
              {PRESET_HIGH_RES_UNIVERSITIES.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleAddSlide(preset.url)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-[11px] font-semibold text-slate-800 transition flex items-center gap-1 shadow-xs cursor-pointer"
                  title={`Add ${preset.name} (${preset.country})`}
                >
                  <Plus className="w-3 h-3 text-amber-600" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slides List (Image-Only, No Title/Country clutter per user requirement) */}
          <div className="space-y-3">
            {(Array.isArray(config.hero?.slides) ? config.hero.slides : []).map((slide: any, sIdx: number) => {
              const slideUrl = typeof slide === 'string' ? slide : (slide?.url || slide?.imageUrl || '');
              return (
                <div
                  key={sIdx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Hero Slide #{sIdx + 1}
                      </span>
                      {slideUrl.includes('australia') && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                          Australia Campus
                        </span>
                      )}
                      {slideUrl.includes('uk') && (
                        <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                          UK Campus
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={sIdx === 0}
                        onClick={() => handleMoveSlide(sIdx, 'up')}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Slide Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={sIdx === (config.hero?.slides?.length || 1) - 1}
                        onClick={() => handleMoveSlide(sIdx, 'down')}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Slide Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(sIdx)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Clean Full-Width Image Upload & Preview Only */}
                  <div className="w-full">
                    <ImageUploadInput
                      label="Slide Background Image"
                      value={slideUrl}
                      onChange={(url) => handleUpdateSlideUrl(sIdx, url)}
                      placeholder="https://... or upload image"
                      category="hero"
                      dark={false}
                      helperText="Recommended: 1920x1080 (16:9 Landscape) - Saved to database"
                    />
                  </div>
                </div>
              );
            })}

            {(!config.hero?.slides || config.hero.slides.length === 0) && (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">No slider images configured yet.</p>
                <button
                  type="button"
                  onClick={handleResetSlides}
                  className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                >
                  Load Default University Slides
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: KEY METRIC COUNTERS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-amber-600" />
          Key Statistics Counters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(config.stats) ? config.stats : []).map((stat: any, idx: number) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div>
                <label className="block text-slate-600 text-[11px] font-bold mb-1">Counter Number</label>
                <input
                  type="text"
                  value={stat.number || ''}
                  onChange={(e) => {
                    const newStats = [...(Array.isArray(config.stats) ? config.stats : [])];
                    newStats[idx] = { ...newStats[idx], number: e.target.value };
                    setConfig({ ...config, stats: newStats });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-amber-700 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 text-[11px] font-bold mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label || ''}
                  onChange={(e) => {
                    const newStats = [...(Array.isArray(config.stats) ? config.stats : [])];
                    newStats[idx] = { ...newStats[idx], label: e.target.value };
                    setConfig({ ...config, stats: newStats });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
