'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  GraduationCap,
  FileCheck,
  Award,
  Stamp,
  PenTool,
  Languages,
  Building2,
  PlaneTakeoff,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Clock,
  BookOpen,
  Users,
  ShieldCheck,
  FileText,
  Globe,
  Briefcase,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ServicesPageSettings } from '@/lib/types';

const iconMap: Record<string, any> = {
  Compass,
  GraduationCap,
  FileCheck,
  Award,
  Stamp,
  PenTool,
  Languages,
  Building2,
  PlaneTakeoff,
  HeartHandshake,
  BookOpen,
  Users,
  ShieldCheck,
  FileText,
  Globe,
  Briefcase,
  Sparkles,
  HelpCircle,
};

interface ServicesClientProps {
  initialServices: any[];
  initialSettings?: ServicesPageSettings;
}

export default function ServicesClient({ initialServices, initialSettings = {} }: ServicesClientProps) {
  // Filter only active services and sort properly
  const activeServices = (initialServices || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (Number(a.sortOrder ?? a.order ?? 999)) - (Number(b.sortOrder ?? b.order ?? 999)));

  const [selectedService, setSelectedService] = useState<any>(activeServices[0] || null);

  // Sync selected service if URL hash points to a specific service slug
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashSlug = window.location.hash.replace('#', '').toLowerCase();
      const matched = activeServices.find(
        (s) => s.slug?.toLowerCase() === hashSlug || s.id?.toLowerCase() === hashSlug
      );
      if (matched) {
        setSelectedService(matched);
      }
    }
  }, [activeServices]);

  // Page Content Settings with fallbacks
  const heroBadge = initialSettings?.heroBadge || 'End-to-End International Education Suite';
  const heroTitle = initialSettings?.heroTitle || 'Bespoke Services for Every Stage of';
  const heroTitleHighlight = initialSettings?.heroTitleHighlight || 'Your Global Journey';
  const heroDescription =
    initialSettings?.heroDescription ||
    'From academic profiling and Turnitin-verified SOP editing to our audited 98.6% visa advisory and overseas accommodation booking, discover our full spectrum of specialized student services.';

  const spotlightBadge = initialSettings?.spotlightBadge || 'Featured Deep-Dive';
  const spotlightCtaText = initialSettings?.spotlightCtaText || 'Book Free Consultation for this Service';
  const spotlightCtaLink = initialSettings?.spotlightCtaLink || '/book-appointment';
  const whatsappCtaText = initialSettings?.whatsappCtaText || 'Chat with Service Lead on WhatsApp';
  const rawWhatsapp = initialSettings?.whatsappNumber || '+442079460912';
  const whatsappLink = rawWhatsapp.startsWith('http')
    ? rawWhatsapp
    : `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;
  const selectorTitle = initialSettings?.selectorTitle || 'Select Service to Inspect:';

  const portfolioBadge = initialSettings?.portfolioBadge || 'Complete Portfolio';
  const portfolioTitleTemplate =
    initialSettings?.portfolioTitle || 'Explore All {count} Specialized Advisory Services';
  const portfolioTitle = portfolioTitleTemplate.includes('{count}')
    ? portfolioTitleTemplate.replace('{count}', String(activeServices.length))
    : `${portfolioTitleTemplate} (${activeServices.length})`;
  const portfolioSubtitle =
    initialSettings?.portfolioSubtitle ||
    'Every service is led by certified specialists with direct experience in university admissions and international immigration law.';
  const serviceCtaText = initialSettings?.serviceCtaText || 'Get Service Consultation';
  const serviceCtaLink = initialSettings?.serviceCtaLink || '/book-appointment';

  const ctaBadge = initialSettings?.ctaBadge || 'Tailored Mentorship';
  const ctaTitle = initialSettings?.ctaTitle || 'Not Sure Which Service You Need First?';
  const ctaDescription =
    initialSettings?.ctaDescription ||
    'Book a complimentary 30-minute diagnostic session. Our senior counselor will evaluate your profile and chart a custom roadmap covering all required services.';
  const ctaButtonText = initialSettings?.ctaButtonText || 'Book Free Diagnostic Session';
  const ctaButtonLink = initialSettings?.ctaButtonLink || '/book-appointment';

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-20 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Our Services' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            {heroBadge && (
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
                {heroBadge}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {heroTitle}{' '}
              {heroTitleHighlight && (
                <span className="text-amber-600">{heroTitleHighlight}</span>
              )}
            </h1>
            {heroDescription && (
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {heroDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Interactive Service Spotlight & Selector */}
      {selectedService && (
        <section id={selectedService.slug} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="rounded-3xl bg-white text-slate-900 border border-slate-200 p-8 sm:p-12 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
                  {spotlightBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {selectedService.title}
                </h2>
              </div>
              {(selectedService.turnaroundTime || selectedService.turnaround) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700 font-semibold border border-slate-200 w-fit">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Turnaround: {selectedService.turnaroundTime || selectedService.turnaround}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {selectedService.fullDesc || selectedService.fullDescription || selectedService.shortDesc || selectedService.shortDescription}
                </p>

                {selectedService.deliverables && Array.isArray(selectedService.deliverables) && selectedService.deliverables.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">
                      Key Deliverables & Protections:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedService.deliverables.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={spotlightCtaLink}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
                  >
                    <span>{spotlightCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 text-emerald-700 hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{whatsappCtaText}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <h4 className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                  {selectorTitle}
                </h4>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeServices.map((svc) => (
                    <button
                      key={svc.id || svc.slug}
                      onClick={() => setSelectedService(svc)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        (selectedService?.id === svc.id || selectedService?.slug === svc.slug)
                          ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                          : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-950'
                      }`}
                    >
                      <span className="truncate">{svc.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 ml-2 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. All Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          {portfolioBadge && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              {portfolioBadge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {portfolioTitle}
          </h2>
          {portfolioSubtitle && (
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {portfolioSubtitle}
            </p>
          )}
        </div>

        {activeServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            No active services currently published. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => {
              const IconComponent = iconMap[service.icon] || GraduationCap;
              const turnaround = service.turnaroundTime || service.turnaround;
              const shortDescription = service.shortDesc || service.shortDescription;

              return (
                <div
                  key={service.id || service.slug}
                  id={`card-${service.slug}`}
                  className="group rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {turnaround && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {turnaround}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {service.title}
                      </h3>
                      {shortDescription && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {shortDescription}
                        </p>
                      )}
                    </div>

                    {service.benefits && Array.isArray(service.benefits) && service.benefits.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Student Benefits:
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {service.benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-tight">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Link
                      href={serviceCtaLink}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 transition-colors group/btn"
                    >
                      <span>{serviceCtaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Pre-Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            {ctaBadge && (
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
                {ctaBadge}
              </span>
            )}
            <h2 className="text-3xl font-extrabold text-white">
              {ctaTitle}
            </h2>
            {ctaDescription && (
              <p className="text-slate-300 text-sm leading-relaxed">
                {ctaDescription}
              </p>
            )}
            <div className="pt-4">
              <Link
                href={ctaButtonLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>{ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
