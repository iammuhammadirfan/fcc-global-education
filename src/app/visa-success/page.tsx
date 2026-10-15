import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Plane,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VisaSuccessGallery from '@/components/visa/VisaSuccessGallery';
import DestinationFrameworksSection from '@/components/visa/DestinationFrameworksSection';
import { db } from '@/lib/db';
import { VisaSuccessPageSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Visa Success Track Record & Grant Proofs | FCC Global Education',
  description: 'Audited 98.6% student visa approval track record across UK, USA, Canada, Australia, and Schengen. Verified visa grant letters and stamp proofs.',
};

export default async function VisaSuccessPage() {
  const countries = (await db.getTable('countries')) || [];
  const visaSuccessItems = (await db.getTable('visaSuccess')) || [];
  const pageSettings: VisaSuccessPageSettings = (await db.getTable('visaSuccessPageSettings')) || {};

  // Build complete list of destination cards:
  // Include existing CMS framework details AND all published countries from database
  const frameworks = (pageSettings.destinationFrameworks && pageSettings.destinationFrameworks.length > 0)
    ? pageSettings.destinationFrameworks
    : [];

  const publishedCountries = countries.filter((c: any) => c.published !== false);

  const mergedDestinationCards = publishedCountries.map((c: any) => {
    const slug = (c.slug || c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    const nameLower = c.name.toLowerCase().trim();

    // Check if this country has custom framework settings in CMS
    const existing = frameworks.find((f: any) => f.country?.toLowerCase().trim() === nameLower);

    if (existing) {
      return {
        ...existing,
        country: c.name,
        flag: existing.flag || c.flag || '🌍',
        code: c.code || c.id?.slice(0, 2).toUpperCase() || 'GL',
        slug: slug,
        countrySlug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
    }

    // Default framework for dynamically added countries (e.g. "test", etc.)
    return {
      country: c.name,
      flag: c.flag || '🌍',
      code: c.code || c.id?.slice(0, 2).toUpperCase() || 'GL',
      visaType: c.visaSuccessRate ? `${c.name} Student Route Visa` : 'Student Visa Route',
      approvalRate: c.visaSuccessRate || '98.5%',
      avgProcessing: c.avgProcessing || '2 – 4 Weeks via Official Portal',
      fundsRule: c.livingCosts ? `Living Costs: ${c.livingCosts} + Tuition Proof` : 'Proof of liquid living funds + tuition receipt',
      interviewReq: 'Comprehensive Credibility & Mock Interview Clinic',
      keyHighlight: c.postStudyWork ? `Post-Study Work: ${c.postStudyWork}` : 'Post-graduation work rights available for eligible graduates.',
      slug: slug,
      countrySlug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
  });

  // Also retain any custom CMS framework that wasn't in countries table
  const countryNamesSet = new Set(publishedCountries.map((c: any) => c.name.toLowerCase().trim()));
  const extraFrameworks = frameworks
    .filter((f: any) => !countryNamesSet.has(f.country?.toLowerCase().trim()))
    .map((f: any) => ({
      ...f,
      slug: f.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      countrySlug: f.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      code: f.flag || 'GL',
    }));

  const destinationCards = [...mergedDestinationCards, ...extraFrameworks];

  const defaultAuditStages = [
    {
      stageNumber: 'Stage 01',
      title: 'CAS / I-20 Audit',
      description: 'Verification that course start dates, fees, and passport details match academic records with zero discrepancies.',
    },
    {
      stageNumber: 'Stage 02',
      title: 'Financial Dossier Check',
      description: '28-day holding verification, sponsor affidavits, CA valuation, and tax return audits.',
    },
    {
      stageNumber: 'Stage 03',
      title: 'Statement of Purpose',
      description: 'Legal drafting of SOP proving academic continuity, home ties, and genuine temporary student intent.',
    },
    {
      stageNumber: 'Stage 04',
      title: 'Consular Mocks',
      description: '3 live 1-on-1 mock interviews simulating toughest questions on financing, post-study goals, and career progression.',
    },
    {
      stageNumber: 'Stage 05',
      title: 'Filing & Biometrics',
      description: 'Portal upload, VFS appointment booking, priority processing dispatch, and tracking until stamp collection.',
    },
  ];

  const auditStages = (pageSettings.auditStages && pageSettings.auditStages.length > 0)
    ? pageSettings.auditStages
    : defaultAuditStages;

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* 1. Hero Section - Sleek & Compact */}
      <section className="bg-gradient-to-b from-amber-50/40 via-white to-slate-50/60 text-slate-900 pt-3 sm:pt-4 pb-4 sm:pb-5 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-2">
            <Breadcrumbs items={[{ label: 'Visa Success' }]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* Left: Headline & Badge */}
            <div className="lg:col-span-7 space-y-1.5 sm:space-y-2">
              <span className="inline-block text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {pageSettings.heroBadge || 'Verified Legal Immigration Compliance'}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {pageSettings.heroTitle || 'Turning Study Dreams Into'}{' '}
                <span className="text-emerald-600">
                  {pageSettings.heroTitleHighlight || 'Visa Success'}
                </span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {pageSettings.heroDescription ||
                  'Our certified immigration solicitors and visa compliance officers audit every bank statement, tax filing, and sponsor affidavit before submission, ensuring near-perfect approval outcomes.'}
              </p>
            </div>

            {/* Right: 4 Compact Trust Statistics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2 sm:gap-2.5">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 truncate">
                  {pageSettings.stats?.stat1Value || '98.6%'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold truncate leading-tight mt-0.5">
                  {pageSettings.stats?.stat1Label || 'Audited Approval Rate'}
                </div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                  {pageSettings.stats?.stat2Value || '5,000+'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold truncate leading-tight mt-0.5">
                  {pageSettings.stats?.stat2Label || 'Approved Visas'}
                </div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-amber-600 truncate">
                  {pageSettings.stats?.stat3Value || `${countries.length || 12}+`}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold truncate leading-tight mt-0.5">
                  {pageSettings.stats?.stat3Label || 'Destination Consulates'}
                </div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-cyan-600 truncate">
                  {pageSettings.stats?.stat4Value || '0%'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold truncate leading-tight mt-0.5">
                  {pageSettings.stats?.stat4Label || 'Refusal on Compliant Files'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Visa Grant Letters & Proofs Gallery Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1">
              {pageSettings.galleryBadge || 'Real Proofs & Official Stamps'}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageSettings.galleryTitle || 'Verified Student Visa Approval Letters'}
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-xs max-w-md sm:text-right leading-relaxed">
            {pageSettings.galleryDescription ||
              'Browse genuine visa grant decisions and embassy approval stamps obtained by our scholars across the UK, USA, Canada, Australia, Germany, and Europe.'}
          </p>
        </div>

        <VisaSuccessGallery items={visaSuccessItems} />
      </section>

      {/* 3. Destination Visa Frameworks & Timelines Grid */}
      <DestinationFrameworksSection
        cards={destinationCards}
        badge={pageSettings.frameworksBadge}
        title={pageSettings.frameworksTitle}
        description={pageSettings.frameworksDescription}
      />

      {/* 4. The FCC Global Education 5-Stage Visa Audit System */}
      <section className="bg-slate-100/70 py-12 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {pageSettings.auditBadge || 'Why We Maintain 98.6% Success'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {pageSettings.auditTitle || 'Our 5-Stage Visa Pre-Audit Protocol'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              {pageSettings.auditDescription ||
                'We never submit a visa application until it has cleared every internal compliance hurdle.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {auditStages.map((st: any, idx: number) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-amber-600">
                  {st.stageNumber || `Stage 0${idx + 1}`}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Legal Compliance Disclaimer Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 sm:p-6 flex items-start gap-3 sm:gap-4 text-xs text-amber-900 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-sm">
              {pageSettings.disclaimerTitle || 'Compliance Disclosure & Realistic Advisory Notice'}
            </span>
            <p className="text-[11px] sm:text-xs">
              {pageSettings.disclaimerText ||
                'FCC Global Education operates in strict compliance with international student recruitment standards. While our rigorous document audit produces an industry-leading 98.6% approval record, all visa grant determinations are the sole, sovereign prerogative of respective government immigration departments (such as UKVI, US Department of State, IRCC Canada, and Australian Home Affairs). We do not guarantee visa issuance; rather, we provide audit-standard representation that eliminates procedural and documentary refusal grounds.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Action CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-5 sm:p-8 lg:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {pageSettings.ctaTitle || 'Have an Offer Letter and Need Flawless Visa Support?'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {pageSettings.ctaDescription ||
                'Book a dedicated visa consultation with our licensed immigration compliance director. We audit your financial documents and organize your mock interview clinic.'}
            </p>
            <div className="pt-4">
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>{pageSettings.ctaButtonText || 'Book Visa File Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
