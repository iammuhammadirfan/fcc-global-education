import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Globe2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  Building,
  Star,
  Users,
  Play,
  HeartHandshake,
} from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import PartnerTicker from '@/components/home/PartnerTicker';
import CountryCard from '@/components/cards/CountryCard';
import UniversityCard from '@/components/cards/UniversityCard';
import ServiceCard from '@/components/cards/ServiceCard';
import SuccessStoryCard from '@/components/cards/SuccessStoryCard';
import VideoCard from '@/components/cards/VideoCard';
import InteractiveEligibilityForm from '@/components/home/InteractiveEligibilityForm';
import CEOIntroSection from '@/components/home/CEOIntroSection';
import VisaSuccessSlider from '@/components/home/VisaSuccessSlider';
import StudentOutcomesSection from '@/components/home/StudentOutcomesSection';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const allCountries = (await db.getTable('countries')) || [];
  const allUniversities = (await db.getTable('universities')) || [];
  const allServices = (await db.getTable('services')) || [];
  const allStories = (await db.getTable('successStories')) || [];
  const allVideos = (await db.getTable('videos')) || [];
  const allVisaSuccess = (await db.getTable('visaSuccess')) || [];
  const allReviews = ((await db.getTable('reviews' as any)) as any) || [];
  // 10 items for homepage slider (items with showOnHomepage === true, or fallback to first 10 published)
  const selectedHomeItems = allVisaSuccess
    .filter((it: any) => it.published !== false && it.showOnHomepage === true)
    .slice(0, 10);
  const activeVisaSlider = selectedHomeItems.length > 0
    ? selectedHomeItems
    : allVisaSuccess.filter((it: any) => it.published !== false).slice(0, 10);
  const homepageSettings = (await db.getTable('homepageSettings')) || {};

  // Dynamic statistics directly from database
  const statPlaced = homepageSettings?.studentsPlaced || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[0]?.number : homepageSettings?.stats?.studentsPlaced) || '5,000+';
  const statPlacedLabel = homepageSettings?.studentsPlacedLabel || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[0]?.label : homepageSettings?.stats?.studentsPlacedLabel) || 'Scholars Placed Globally';

  const statVisa = homepageSettings?.visaSuccessRate || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[1]?.number : homepageSettings?.stats?.visaSuccessRate) || '98.6%';
  const statVisaLabel = homepageSettings?.visaSuccessRateLabel || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[1]?.label : homepageSettings?.stats?.visaSuccessRateLabel) || 'Visa Grant Record';

  const statUni = homepageSettings?.partnerUniversities || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[2]?.number : homepageSettings?.stats?.partnerUniversities) || '120+';
  const statUniLabel = homepageSettings?.partnerUniversitiesLabel || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[2]?.label : homepageSettings?.stats?.partnerUniversitiesLabel) || 'Direct Partner Universities';

  const statScholarships = homepageSettings?.scholarshipsSecured || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[3]?.number : homepageSettings?.stats?.scholarshipsSecured) || '$14.2M+';
  const statScholarshipsLabel = homepageSettings?.scholarshipsSecuredLabel || (Array.isArray(homepageSettings?.stats) ? homepageSettings.stats[3]?.label : homepageSettings?.stats?.scholarshipsSecuredLabel) || 'Scholarships Claimed';

  const featuredCountries = allCountries.filter((c: any) => c.published !== false).slice(0, 6);
  const featuredUniversities = allUniversities.filter((u: any) => u.published !== false).slice(0, 6);
  const featuredServices = allServices.filter((s: any) => s.active !== false).slice(0, 6);
  const featuredStories = allStories.filter((s: any) => s.published !== false).slice(0, 3);
  const featuredVideos = allVideos.filter((v: any) => v.published !== false).slice(0, 2);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section & Partner University Sliding Ticker (Grouped together without excessive gap) */}
      <div className="space-y-0">
        <HeroSection settings={homepageSettings} />
        <PartnerTicker universities={featuredUniversities} />
      </div>

      {/* 2. Founder & CEO Message / Leadership Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CEOIntroSection ceoData={homepageSettings?.ceoSection} />
      </section>

      {/* 3. Visa Success Proofs Showcase (Top 10 Real Approval Letters Slider) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VisaSuccessSlider items={activeVisaSlider} />
      </section>

      {/* 4. The 4-Step Global Admission Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Proven Advisory Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your 4-Step Pathway to a Leading Global University
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From initial transcript evaluation to landing at your overseas campus, our structured milestone strategy ensures zero surprises and peak admission results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg mb-4 shadow-md group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Profile Assessment & Shortlisting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In-depth transcript review, career trajectory matching, and categorization into Dream, Target, and Safe institutions.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free Initial Assessment</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg mb-4 shadow-md group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">SOP & Application Polishing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Turnitin-verified personal statements, academic CV formatting, faculty reference letters, and portal submission.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Plagiarism Guarantee</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg mb-4 shadow-md group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Offer Letters & Scholarships</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Securing unconditional offer letters, CAS/I-20 issuance, and claiming available merit scholarships and fee waivers.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Up to $15k in Fee Waivers</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg mb-4 shadow-md group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Visa Approval & Relocation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financial document audit, mock interview drill sessions, student accommodation, and pre-departure briefings.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>98.6% Visa Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Study Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Explore Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Top Global Study Destinations
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Compare average tuition fees, post-study work visa rights, and world-ranking universities across the globe.
            </p>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors group"
          >
            <span>View All 12 Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCountries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      </section>

      {/* 5. Core Services Showcase */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/60">
              Full-Spectrum Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Services for Ambitious Scholars
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We handle every intricate layer of your international education journey with seasoned admissions counselors and certified immigration advisors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg"
            >
              <span>Explore All 10 Specialized Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Top Universities Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              World-Class Institutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Global Universities
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Explore admission criteria, tuition fees, and scholarship opportunities at leading institutions.
            </p>
          </div>
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors group"
          >
            <span>Search Full University Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredUniversities.map((uni) => (
            <UniversityCard key={uni.id} university={uni} />
          ))}
        </div>
      </section>

      {/* 7. Interactive Eligibility Lead Magnet */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveEligibilityForm countries={allCountries} />
      </section>


      {/* 9. Verified Student Outcomes, Real Reviews & Video Testimonials */}
      <StudentOutcomesSection
        stories={featuredStories}
        realReviews={allReviews}
        videos={featuredVideos}
      />

      {/* 9. Why Students Trust FCC Global Education - Stats & Accreditations */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-20 border-y border-slate-200/90 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                The FCC Global Education Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Why Discerning International Students Trust Us With Their Future
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Unlike generic agencies that push pre-selected low-tier colleges, we operate on an ethical, student-first mandate. Our senior counselors are alumni of Oxford, Harvard, and LSE who mentor you directly.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">98.6% Audited Visa Approval Rate</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Rigorous mock interview clinics and financial compliance screening that eliminate visa refusals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-200">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">$14.2M+ in Secured Scholarships</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      We uncover institutional fee waivers, departmental assistantships, and prestigious government grants.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">On-Ground Overseas Support</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Airport pickups, verified student housing, local bank setup, and part-time job guidance in destination cities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side stats box */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-white p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-8">
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Cumulative Impact Metrics
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-amber-600 mt-2">
                    {statPlaced}
                  </div>
                  <div className="text-sm text-slate-600 mt-1 font-semibold">
                    {statPlacedLabel}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{statUni}</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{statUniLabel}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{statVisa}</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{statVisaLabel}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600">{statScholarships}</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{statScholarshipsLabel}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">7–10 Days</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">Average Offer Turnaround</div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/book-appointment"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all"
                  >
                    <span>Claim Your Free Profile Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Pre-Footer High-Impact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 border border-slate-800 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" /> Book Your 1-on-1 Consultation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Secure Your Seat at a Leading World University?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Speak directly with an accredited senior counselor today. We evaluate your transcripts, shortlist optimal degree courses, and chart your fast-track visa roadmap.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-[1.02] transition-all"
              >
                <span>Book Free 30-Min Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/destinations"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <span>Browse All Countries</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
