'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Globe,
  ChevronDown,
  Menu,
  X,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import { countries as fallbackCountries } from '@/data/countries';
import { universities as fallbackUniversities } from '@/data/universities';

interface NavbarProps {
  navSettings?: any;
  generalSettings?: any;
  countries?: any[];
  universities?: any[];
  topBarSettings?: any;
}

const defaultNavItems = [
  { label: 'Home', href: '/', enabled: true },
  { label: 'Destinations', href: '/visa-success#destination-frameworks', badge: '12 Countries', enabled: true },
  { label: 'Universities', href: '/universities', enabled: true },
  { label: 'Services', href: '/services', enabled: true },
  { label: 'Student Reviews', href: '/success-stories', enabled: true },
  { label: 'Visa Success', href: '/visa-success', enabled: true },
  { label: 'About Us', href: '/about', enabled: true },
  { label: 'FAQ', href: '/faq', enabled: true },
  { label: 'Contact', href: '/contact', enabled: true },
];

export default function Navbar({
  navSettings,
  generalSettings,
  countries = fallbackCountries,
  universities = fallbackUniversities,
  topBarSettings,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [universitiesOpen, setUniversitiesOpen] = useState(false);
  const pathname = usePathname();

  const destinationsRef = useRef<HTMLDivElement>(null);
  const universitiesRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDestinationsOpen(false);
    setUniversitiesOpen(false);
  }, [pathname]);

  // Click outside to close dropdowns when open without intercepting other page clicks
  useEffect(() => {
    if (!destinationsOpen && !universitiesOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (destinationsOpen && destinationsRef.current && !destinationsRef.current.contains(target)) {
        setDestinationsOpen(false);
      }
      if (universitiesOpen && universitiesRef.current && !universitiesRef.current.contains(target)) {
        setUniversitiesOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [destinationsOpen, universitiesOpen]);

  const featuredCountries = countries && countries.length > 0 ? countries : fallbackCountries;
  const topUniversities = (universities && universities.length > 0 ? universities : fallbackUniversities).slice(0, 6);

  const topBar = topBarSettings || {};
  const isTopBarEnabled = topBar.enabled !== false;
  const topBarTag = topBar.tag !== undefined && topBar.tag !== '' ? topBar.tag : 'Fall 2026 / Spring 2027';
  const topBarText = topBar.text !== undefined && topBar.text !== '' ? topBar.text : 'Admissions open for top global universities. Free profile assessment!';
  const topBarVisa = topBar.visaTag !== undefined && topBar.visaTag !== '' ? topBar.visaTag : '98.6% Visa Approval';
  const displayPhone = topBar.phone || generalSettings?.phone || '+44 (0) 20 7946 0912';
  const ctaLabel = topBar.ctaLabel || navSettings?.ctaButton?.text || navSettings?.ctaButton?.label || 'Book Free Consultation';
  const ctaHref = topBar.ctaHref || navSettings?.ctaButton?.href || '/book-appointment';

  let rawItems = (navSettings?.items && Array.isArray(navSettings.items) && navSettings.items.length > 0
    ? navSettings.items
    : defaultNavItems)
    .filter((item: any) => item.href !== '/blog' && !item.href?.startsWith('/blog') && item.label?.toLowerCase() !== 'blog')
    .map((item: any) => {
      const updated = { ...item };
      if (updated.href === '/success-stories' || updated.label?.toLowerCase() === 'student reviews' || updated.label?.toLowerCase() === 'success stories') {
        updated.label = 'Student Reviews';
        updated.href = '/success-stories';
        delete updated.badge;
      }
      if (updated.badge && (String(updated.badge).includes('98%') || String(updated.badge).toLowerCase().includes('visa rate'))) {
        delete updated.badge;
      }
      if (updated.href === '/visa-success' || updated.label?.toLowerCase() === 'visa success') {
        updated.label = 'Visa Success';
        updated.href = '/visa-success';
        updated.enabled = true;
      }
      return updated;
    });

  // Guarantee Visa Success is ALWAYS in navbar
  const hasVisaSuccess = rawItems.some((it: any) => it.href === '/visa-success' || it.label?.toLowerCase() === 'visa success');
  if (!hasVisaSuccess) {
    const reviewIdx = rawItems.findIndex((it: any) => it.href === '/success-stories' || it.label === 'Student Reviews');
    const visaItem = { label: 'Visa Success', href: '/visa-success', enabled: true };
    if (reviewIdx !== -1) {
      rawItems.splice(reviewIdx + 1, 0, visaItem);
    } else {
      const aboutIdx = rawItems.findIndex((it: any) => it.href === '/about' || it.label === 'About Us');
      if (aboutIdx !== -1) {
        rawItems.splice(aboutIdx, 0, visaItem);
      } else {
        rawItems.push(visaItem);
      }
    }
  }

  const hasHome = rawItems.some((it: any) => it.href === '/');
  const itemsWithHome = hasHome ? rawItems : [{ label: 'Home', href: '/', enabled: true }, ...rawItems];
  const activeNavItems = itemsWithHome.filter((item: any) => item.enabled !== false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const formatPsw = (psw?: string) => {
    if (!psw) return 'Post-Study Work Visa';
    let clean = psw.split('(')[0].trim();
    if (clean.length > 32) {
      clean = clean.slice(0, 32) + '...';
    }
    return clean;
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Top Announcement & Quick Action Bar */}
      {isTopBarEnabled && (
        <div className={`bg-gradient-to-r from-amber-50 via-white to-amber-50 text-slate-800 text-xs py-1.5 px-2.5 sm:px-4 border-b border-slate-200/90 shadow-2xs w-full max-w-full overflow-hidden transition-all duration-300 ${
          isScrolled ? 'hidden sm:block' : 'block'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden w-full">
            {/* Left: Highlight Tag */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
              {topBarTag && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] sm:text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs shrink-0 max-w-[130px] sm:max-w-[180px] lg:max-w-none truncate">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-amber-700 shrink-0" />
                  <span className="truncate">{topBarTag}</span>
                </span>
              )}
              {topBarText && (
                <span className="hidden lg:inline-block text-slate-600 font-medium text-[11px] xl:text-[12px] truncate max-w-xs xl:max-w-md min-w-0">
                  {topBarText}
                </span>
              )}
            </div>

            {/* Right: Phone, Visa rate, and Book Consultation CTA Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
              {topBarVisa && (
                <div className="hidden xl:flex items-center gap-1 text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{topBarVisa}</span>
                </div>
              )}

              {displayPhone && (
                <a
                  href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`}
                  className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-amber-700 font-semibold transition-colors text-[11px] whitespace-nowrap"
                >
                  <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{displayPhone}</span>
                </a>
              )}

              {/* Book Free Consultation Pill Button in Top Bar */}
              <Link
                href={ctaHref}
                prefetch={true}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[9.5px] sm:text-[11px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-2xs hover:shadow transition-all duration-200 active:brightness-95 whitespace-nowrap shrink-0"
              >
                <CalendarCheck className="w-3 h-3 text-slate-950 shrink-0" />
                <span className="hidden lg:inline">{ctaLabel}</span>
                <span className="lg:hidden">Consult</span>
                <ArrowRight className="w-3 h-3 text-slate-950 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-2 sm:py-2.5 shadow-md border-b border-slate-200/80'
            : 'bg-white/95 backdrop-blur-sm py-2.5 sm:py-3 border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Brand Logo & Company Name */}
            <Link href="/" prefetch={true} className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              {generalSettings?.logoUrl && generalSettings.logoUrl.trim() !== '' && generalSettings.logoUrl !== '/logo.svg' ? (
                <div className="relative flex items-center shrink-0">
                  <img
                    src={generalSettings.logoUrl}
                    alt={generalSettings?.companyName || 'Brand Logo'}
                    className="h-7 sm:h-9 w-auto max-h-10 object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-slate-950 leading-tight flex items-center gap-1 whitespace-nowrap">
                  {generalSettings?.companyName ? (
                    generalSettings.companyName
                  ) : (
                    <>Aura<span className="text-amber-600">Global</span></>
                  )}
                </span>
                <span className="text-[8px] sm:text-[9px] xl:text-[9.5px] tracking-wider text-slate-500 uppercase font-semibold leading-tight whitespace-normal sm:whitespace-nowrap">
                  {generalSettings?.tagline || 'Education Consultants'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-nowrap whitespace-nowrap">
              {activeNavItems.map((item: any, idx: number) => {
                const isDestinations = item.href === '/destinations' || item.href === '/visa-success#destination-frameworks' || item.label?.toLowerCase() === 'destinations';
                const isUniversities = item.href === '/universities';
                const active = isActive(item.href);

                // 1. Destinations Dropdown
                if (isDestinations) {
                  return (
                    <div
                      key={idx}
                      ref={destinationsRef}
                      className="relative shrink-0"
                      onMouseEnter={() => setDestinationsOpen(true)}
                      onMouseLeave={() => setDestinationsOpen(false)}
                    >
                      <div className="flex items-center">
                        <Link
                          href="/visa-success#destination-frameworks"
                          prefetch={true}
                          onClick={() => setDestinationsOpen(false)}
                          className={`px-2.5 py-1.5 text-[13px] xl:text-[13.5px] font-semibold rounded-l-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                            active
                              ? 'text-amber-700 bg-amber-50/80 font-bold'
                              : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDestinationsOpen(!destinationsOpen);
                            setUniversitiesOpen(false);
                          }}
                          className={`px-1 py-1.5 rounded-r-lg transition-all ${
                            active
                              ? 'text-amber-700 bg-amber-50/80'
                              : 'text-slate-500 hover:text-amber-600 hover:bg-slate-50'
                          }`}
                          aria-label="Toggle destinations dropdown"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              destinationsOpen ? 'rotate-180 text-amber-600' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Destinations Dropdown Card */}
                      {destinationsOpen && (
                        <div className="absolute top-full left-0 w-[420px] sm:w-[460px] pt-2 z-50">
                          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                            {/* Header */}
                            <div className="flex justify-between items-center px-2 py-1.5 mb-1.5 border-b border-slate-100">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-amber-600" />
                                Top Study Destinations
                              </span>
                              <Link
                                href="/visa-success#destination-frameworks"
                                prefetch={true}
                                onClick={() => setDestinationsOpen(false)}
                                className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 hover:underline"
                              >
                                View All {featuredCountries.length} →
                              </Link>
                            </div>

                            {/* Countries List */}
                            <div className="grid grid-cols-1 gap-1 max-h-[360px] overflow-y-auto pr-1">
                              {featuredCountries.map((country) => {
                                const targetSlug = (country.slug || country.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
                                return (
                                  <Link
                                    key={country.id}
                                    href={`/visa-success#destination-${targetSlug}`}
                                    prefetch={true}
                                    onClick={() => {
                                      setDestinationsOpen(false);
                                      if (typeof window !== 'undefined' && window.location.pathname === '/visa-success') {
                                        window.location.hash = `#destination-${targetSlug}`;
                                        window.dispatchEvent(
                                          new CustomEvent('highlight-destination', {
                                            detail: { slug: targetSlug },
                                          })
                                        );
                                      }
                                    }}
                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/60 transition-all group gap-3"
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/90 flex items-center justify-center font-black text-xs text-slate-800 shrink-0 group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 transition-all shadow-2xs">
                                        {country.code || country.flag || country.name.slice(0, 2).toUpperCase()}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                                          {country.name}
                                        </div>
                                        <div className="text-[11px] text-slate-500 truncate">
                                          {formatPsw(country.postStudyWork)}
                                        </div>
                                      </div>
                                    </div>

                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg shrink-0 shadow-2xs">
                                      {country.visaSuccessRate || '98%'}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>

                            {/* Dropdown Quick Footer */}
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Direct University Admissions
                              </span>
                              <Link
                                href="/book-appointment"
                                prefetch={true}
                                onClick={() => setDestinationsOpen(false)}
                                className="font-bold text-amber-700 hover:underline"
                              >
                                Book Free Session →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // 2. Universities Dropdown
                if (isUniversities) {
                  return (
                    <div
                      key={idx}
                      ref={universitiesRef}
                      className="relative shrink-0"
                      onMouseEnter={() => setUniversitiesOpen(true)}
                      onMouseLeave={() => setUniversitiesOpen(false)}
                    >
                      <div className="flex items-center">
                        <Link
                          href="/universities"
                          prefetch={true}
                          onClick={() => setUniversitiesOpen(false)}
                          className={`px-2.5 py-1.5 text-[13px] xl:text-[13.5px] font-semibold rounded-l-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                            active
                              ? 'text-amber-700 bg-amber-50/80 font-bold'
                              : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUniversitiesOpen(!universitiesOpen);
                            setDestinationsOpen(false);
                          }}
                          className={`px-1 py-1.5 rounded-r-lg transition-all ${
                            active
                              ? 'text-amber-700 bg-amber-50/80'
                              : 'text-slate-500 hover:text-amber-600 hover:bg-slate-50'
                          }`}
                          aria-label="Toggle universities dropdown"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              universitiesOpen ? 'rotate-180 text-amber-600' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Universities Dropdown Card */}
                      {universitiesOpen && (
                        <div className="absolute top-full left-0 w-[420px] sm:w-[460px] pt-2 z-50">
                          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                            {/* Header */}
                            <div className="flex justify-between items-center px-2 py-1.5 mb-1.5 border-b border-slate-100">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Building className="w-3.5 h-3.5 text-amber-600" />
                                Top Ranked Universities
                              </span>
                              <Link
                                href="/universities"
                                prefetch={true}
                                onClick={() => setUniversitiesOpen(false)}
                                className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 hover:underline"
                              >
                                View Directory →
                              </Link>
                            </div>

                            {/* Universities List */}
                            <div className="grid grid-cols-1 gap-1">
                              {topUniversities.map((uni) => (
                                <Link
                                  key={uni.id}
                                  href={`/universities/${uni.slug}`}
                                  prefetch={true}
                                  onClick={() => setUniversitiesOpen(false)}
                                  className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/60 transition-all group gap-3"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center text-amber-800 shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shadow-2xs">
                                      <Building className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[13px] font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                                        {uni.name}
                                      </div>
                                      <div className="text-[11px] text-slate-500 truncate">
                                        {uni.city || uni.country}
                                      </div>
                                    </div>
                                  </div>

                                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg shrink-0 shadow-2xs">
                                    #{uni.worldRank || 'Top 100'}
                                  </span>
                                </Link>
                              ))}
                            </div>

                            {/* Dropdown Quick Footer */}
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-500">
                              <span className="text-slate-500">
                                Over 500+ Official University Partnerships
                              </span>
                              <Link
                                href="/universities"
                                prefetch={true}
                                onClick={() => setUniversitiesOpen(false)}
                                className="font-bold text-amber-700 hover:underline"
                              >
                                All Universities →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    prefetch={true}
                    className={`px-2.5 py-1.5 text-[13px] xl:text-[13.5px] font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-amber-700 font-bold bg-amber-50/80'
                        : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href={ctaHref}
                prefetch={true}
                className="hidden sm:inline-flex text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs whitespace-nowrap"
              >
                Consult
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[calc(100vh-75px)] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {activeNavItems.map((item: any, idx: number) => {
                const targetHref = (item.href === '/destinations' || item.label?.toLowerCase() === 'destinations')
                  ? '/visa-success#destination-frameworks'
                  : item.href;
                return (
                  <Link
                    key={idx}
                    href={targetHref}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold border transition ${
                      isActive(item.href) || (targetHref.includes('#destination-frameworks') && isActive('/visa-success'))
                        ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-800 hover:bg-amber-50 hover:text-amber-700 border-slate-200/80'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold shrink-0 ml-1">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href={ctaHref}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-md text-center text-xs"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
