import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Award,
  MapPin,
  CheckCircle2,
  Calendar,
  DollarSign,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Star,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SuccessStoryCard from '@/components/cards/SuccessStoryCard';
import UniversityReviewsSection from '@/components/reviews/UniversityReviewsSection';
import { universities, getUniversityBySlug } from '@/data/universities';
import { successStories } from '@/data/successStories';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface UniversityPageProps {
  params: Promise<{
    university: string;
  }>;
}

export async function generateMetadata({ params }: UniversityPageProps) {
  const { university: slug } = await params;
  const uni = (await db.findBySlug('universities', slug)) || getUniversityBySlug(slug);
  if (!uni) return { title: 'University Not Found' };

  return {
    title: uni.seoTitle || `${uni.name} | Admissions, Tuition, Ranking & Scholarships`,
    description: uni.seoDescription || `Complete guide to admissions at ${uni.name} (${uni.city}). Entry requirements, tuition fees, acceptance rates, and scholarship application deadlines.`,
  };
}

export default async function UniversityDetailPage({ params }: UniversityPageProps) {
  const { university: slug } = await params;
  const uni = (await db.findBySlug('universities', slug)) || getUniversityBySlug(slug);

  if (!uni) {
    notFound();
  }

  const allStories = (await db.getTable('successStories')) || successStories;
  const allReviews = ((await db.getTable('reviews' as any)) as any) || [];
  const uniStories = allStories.filter(
    (s: any) =>
      (s.universitySlug?.toLowerCase() === uni.slug.toLowerCase() ||
        s.university?.toLowerCase() === uni.name?.toLowerCase()) &&
      s.published !== false
  );

  // Normalize fields so CMS entries never crash
  const highlightsList: string[] = Array.isArray(uni.highlights)
    ? uni.highlights
    : typeof uni.highlights === 'string'
    ? uni.highlights.split('\n').map((h: string) => h.trim()).filter(Boolean)
    : ['High graduate employability and career advancement', 'World-class academic faculty and campus facilities'];

  const popularProgramsList: string[] = Array.isArray(uni.popularPrograms)
    ? uni.popularPrograms
    : typeof uni.popularPrograms === 'string'
    ? uni.popularPrograms.split(',').map((p: string) => p.trim()).filter(Boolean)
    : ['Undergraduate Degree Programs', 'Postgraduate Master Programs'];

  const ugTuition = typeof uni.tuition === 'object' && uni.tuition !== null
    ? uni.tuition.undergraduate || '$20,000 – $35,000 / year'
    : typeof uni.tuition === 'string' && uni.tuition.trim() !== ''
    ? uni.tuition
    : '$20,000 – $35,000 / year';

  const pgTuition = typeof uni.tuition === 'object' && uni.tuition !== null
    ? uni.tuition.postgraduate || '$22,000 – $38,000 / year'
    : typeof uni.tuition === 'string' && uni.tuition.trim() !== ''
    ? uni.tuition
    : '$22,000 – $38,000 / year';

  const livingCost = uni.livingCostEstimate || '$1,200 – $1,500 / month';
  const acceptance = uni.acceptanceRate || '65%';
  const rankingBadge = uni.rankingBadge || (uni.worldRank ? `QS World #${uni.worldRank}` : 'Top Ranked');
  const countrySlug = uni.countrySlug || uni.country?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'all';
  const uniImage = uni.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80';

  const scholarshipsList = Array.isArray(uni.scholarships) && uni.scholarships.length > 0
    ? uni.scholarships
    : typeof uni.scholarships === 'string' && uni.scholarships.trim() !== ''
    ? [{ title: 'Academic Excellence Scholarship', amount: 'Partial Tuition Grant', eligibility: uni.scholarships, deadline: 'Rolling Intake' }]
    : [{ title: 'International Merit Scholarship', amount: 'Partial Tuition', eligibility: 'Partial tuition fee grants for qualifying international applicants.', deadline: 'Check intake dates' }];

  const hasStructuredRequirements = typeof uni.entryRequirements === 'object' && uni.entryRequirements !== null;

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-white text-slate-900 pt-10 pb-20 overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 z-0">
          <Image
            src={uniImage}
            alt={uni.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs
            items={[
              { label: 'Universities', href: '/universities' },
              { label: uni.name },
            ]}
          />

          <div className="max-w-3xl space-y-4 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{rankingBadge}</span>
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                {uni.country}
              </span>
              {uni.officialRep && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Official Partner
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {uni.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-slate-600 text-xs sm:text-sm font-semibold">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{uni.city}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{acceptance} Acceptance Rate</span>
            </div>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
              {uni.overview}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                <span>Apply to {uni.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/destinations/${countrySlug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <span>Study in {uni.country} Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Academic Overview & Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            {/* Campus Highlights */}
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Institutional Distinctions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
                Why Study at {uni.name}?
              </h2>
              <div className="space-y-3">
                {highlightsList.map((point: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Programs */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                Flagship Academic Disciplines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {popularProgramsList.map((prog: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2.5"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{prog}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entry Requirements Detailed */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Admission & Entry Requirements</span>
              </h3>

              {hasStructuredRequirements ? (
                <div className="space-y-3 text-xs leading-relaxed">
                  {uni.entryRequirements.academic && (
                    <div>
                      <strong className="text-slate-900 block font-bold mb-1">
                        Academic Minimums:
                      </strong>
                      <p className="text-slate-600">{uni.entryRequirements.academic}</p>
                    </div>
                  )}

                  {uni.entryRequirements.english && (
                    <div className="pt-2 border-t border-slate-100">
                      <strong className="text-slate-900 block font-bold mb-1">
                        English Proficiency:
                      </strong>
                      <p className="text-slate-600">{uni.entryRequirements.english}</p>
                    </div>
                  )}

                  {uni.entryRequirements.standardizedTests && (
                    <div className="pt-2 border-t border-slate-100">
                      <strong className="text-slate-900 block font-bold mb-1">
                        Standardized Testing:
                      </strong>
                      <p className="text-slate-600">{uni.entryRequirements.standardizedTests}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <strong className="text-slate-900 block font-bold mb-1">
                      Admission Criteria:
                    </strong>
                    <p className="text-slate-600">
                      {typeof uni.entryRequirements === 'string' && uni.entryRequirements.trim() !== ''
                        ? uni.entryRequirements
                        : 'Standard academic qualifications and certified language proficiency scores required. Contact our counselors for complete department prerequisites.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Tuition, Cost, and Scholarships */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tuition Breakdown Card */}
            <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Tuition & Living Costs</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Undergraduate Tuition:</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {ugTuition}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block">Postgraduate / Masters:</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {pgTuition}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block">Estimated Living Cost:</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                    {livingCost}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/book-appointment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-lg"
                >
                  <span>Book Free Consultation for {uni.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scholarships Available */}
            <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Scholarships & Grants</span>
              </div>

              <div className="space-y-4">
                {scholarshipsList.map((sch: any, idx: number) => {
                  const title = typeof sch === 'object' ? sch.title : 'Scholarship Award';
                  const amount = typeof sch === 'object' ? sch.amount : 'Partial Tuition';
                  const eligibility = typeof sch === 'object' ? sch.eligibility : String(sch);
                  const deadline = typeof sch === 'object' ? sch.deadline : 'Check intake dates';

                  return (
                    <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-1.5">
                      <div className="text-xs font-bold text-slate-900">{title}</div>
                      {amount && <div className="text-xs font-extrabold text-emerald-700">{amount}</div>}
                      <p className="text-[11px] text-slate-600 leading-relaxed">{eligibility}</p>
                      {deadline && (
                        <div className="text-[10px] text-amber-700 font-semibold pt-1">
                          Deadline: {deadline}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Student Success Stories for this University */}
      {uniStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified Admitted Students
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              FCC Global Education Scholars at {uni.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {uniStories.map((story) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Verified Student Reviews & Ratings */}
      <UniversityReviewsSection
        universityName={uni.name}
        countryName={uni.country}
        initialReviews={allReviews}
      />

      {/* Pre-Footer Application CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-5 sm:p-8 lg:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Submit Your Application to {uni.name}?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Our Oxbridge and Ivy League trained writing mentors will help draft your SOP, review recommendations, and secure expedited conditional offers.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Start Application Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/universities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <span>Back to University Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
