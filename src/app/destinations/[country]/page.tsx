import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  DollarSign,
  Clock,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import UniversityCard from '@/components/cards/UniversityCard';
import SuccessStoryCard from '@/components/cards/SuccessStoryCard';
import { countries, getCountryBySlug } from '@/data/countries';
import { getUniversitiesByCountry } from '@/data/universities';
import { successStories } from '@/data/successStories';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = (await db.findBySlug('countries', slug)) || getCountryBySlug(slug);
  if (!country) return { title: 'Destination Not Found' };

  return {
    title: country.seoTitle || `Study in ${country.name} | Top Universities, Admissions & Visa Guidance`,
    description: country.seoDescription || `Explore world-class universities, tuition fees, post-study work visas, and scholarship opportunities in ${country.name}. 98.6% visa approval rate with FCC Global Education.`,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = (await db.findBySlug('countries', slug)) || getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const allUnis = (await db.getTable('universities')) || [];
  const countryUniversities = allUnis.filter(
    (u: any) =>
      (u.countrySlug?.toLowerCase() === country.slug.toLowerCase() ||
        u.country?.toLowerCase() === country.name?.toLowerCase()) &&
      u.published !== false
  );
  const allStories = (await db.getTable('successStories')) || [];
  const countryStories = allStories.filter(
    (s: any) =>
      (s.countrySlug?.toLowerCase() === country.slug.toLowerCase() ||
        s.country?.toLowerCase() === country.name?.toLowerCase()) &&
      s.published !== false
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Country Hero Banner */}
      <section className="relative bg-white text-slate-900 pt-10 pb-24 overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 z-0">
          <Image
            src={country.heroImage}
            alt={`Study in ${country.name}`}
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
              { label: 'Destinations', href: '/destinations' },
              { label: country.name },
            ]}
          />

          <div className="max-w-3xl space-y-5 pt-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">{country.flag}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Official Guide to Studying in {country.name}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Study in {country.name}
            </h1>

            <p className="text-base sm:text-xl text-amber-700 font-bold">
              {country.tagline}
            </p>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
              {country.overview}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                <span>Book Free Consultation for {country.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#universities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <span>View Universities ({countryUniversities.length > 0 ? countryUniversities.length : (country.topUniversityNames?.length || 0)})</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>Average Tuition</span>
              </div>
              <div className="text-xs sm:text-base font-extrabold text-slate-900 mt-1 truncate">
                {country.averageTuition || 'Contact for details'}
              </div>
            </div>

            <div className="p-3.5 sm:p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Post-Study Work</span>
              </div>
              <div className="text-xs sm:text-base font-extrabold text-slate-900 mt-1 truncate">
                {country.postStudyWork ? country.postStudyWork.split('(')[0].trim() : '2 – 3 Years PSW'}
              </div>
            </div>

            <div className="p-3.5 sm:p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visa Success</span>
              </div>
              <div className="text-xs sm:text-base font-extrabold text-emerald-700 mt-1 truncate">
                {country.visaSuccessRate || '98.5%'} <span className="text-[10px] sm:text-xs text-slate-500 font-medium block sm:inline">(FCC)</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                <span>Work Allowed</span>
              </div>
              <div className="text-xs sm:text-base font-extrabold text-slate-900 mt-1 truncate">
                {country.workWhileStudying ? country.workWhileStudying.split(',')[0].trim() : '20 hrs/week allowed'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Study in this country */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Core Strategic Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose {country.name} for Your Higher Education?
            </h2>

            <div className="space-y-3.5">
              {country.whyStudy?.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Popular Courses */}
            <div className="pt-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                High-Demand Study Programs in {country.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {country.popularCourses?.map((course: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Details & Intakes Dossier */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Intakes & Deadlines</span>
              </h3>

              <div className="space-y-3">
                <div className="text-xs text-slate-400 uppercase font-semibold">Available Intakes</div>
                <div className="space-y-1.5">
                  {country.intakes?.map((intake: string, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-medium"
                    >
                      {intake}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">Application Timelines</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {country.applicationDeadlines}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">Living Cost Benchmark</div>
                <p className="text-xs text-slate-300 font-medium">
                  {country.livingCosts} (includes accommodation, groceries, transport, utilities)
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/book-appointment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                >
                  <span>Apply for Next Intake in {country.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scholarships Card */}
            <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Scholarships & Financial Aid</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {country.scholarshipsOverview}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visa Requirements & Post-Study Work Section */}
      <section className="bg-slate-100/70 py-12 sm:py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Visa Criteria */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Student Visa Requirements</h3>
                  <p className="text-xs text-slate-500">Official checklist for {country.name}</p>
                </div>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
                {country.visaRequirements?.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Post-Study Work & Immigration */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Post-Study Work & Careers</h3>
                  <p className="text-xs text-slate-500">Post-graduation rights & pathways</p>
                </div>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
                {country.postStudyOpportunities?.map((opp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Universities in this country */}
      <section id="universities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Leading Institutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Top Universities in {country.name}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Institutions represented with official application and scholarship channels.
            </p>
          </div>
          <Link
            href="/universities"
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse Full Global Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {countryUniversities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {countryUniversities.map((uni: any) => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {country.topUniversityNames?.map((name: string, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <Building className="w-6 h-6 text-amber-500 mb-2" />
                  <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
                  <div className="text-xs text-slate-500 mt-1">{country.name}</div>
                </div>
                <Link
                  href="/book-appointment"
                  className="text-xs font-semibold text-amber-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>Apply for admission →</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Success Stories for this country */}
      {countryStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified Visa Approvals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Students Placed in {country.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {countryStories.map((story) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* Pre-Footer Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-5 sm:p-8 lg:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Study in {country.name}?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Our {country.name} specialist counselors assist with course shortlisting, SOP editing, scholarship applications, and fast-track student visa filing.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Book Free {country.name} Counseling</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/destinations"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <span>Explore Other Countries</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
