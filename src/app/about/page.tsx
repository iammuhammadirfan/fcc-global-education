import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Globe2,
  GraduationCap,
  Users,
  Target,
  Eye,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { db } from '@/lib/db';
import { globalStats as defaultStats } from '@/data/team';
import { AboutPageSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const aboutSettings: AboutPageSettings = (await db.getTable('aboutPageSettings')) || {};
  return {
    title: aboutSettings.seoTitle || 'About Us | FCC Global Education Consultants',
    description:
      aboutSettings.seoDescription ||
      'Learn about FCC Global Education’s story, leadership, global university accreditations, ethical counseling values, and 98.6% visa approval track record.',
  };
}

export default async function AboutPage() {
  const [teamMembers, homepageSettings, aboutSettings] = await Promise.all([
    db.getTable('teamMembers').then((res) => res || []),
    db.getTable('homepageSettings').then((res) => res || {}),
    db.getTable('aboutPageSettings').then((res) => (res || {}) as AboutPageSettings),
  ]);

  // Statistics fallbacks
  const statsList = Array.isArray(homepageSettings?.stats) ? homepageSettings.stats : [];
  const statPlaced =
    aboutSettings.stats?.stat1Value ||
    homepageSettings?.studentsPlaced ||
    statsList.find((s: any) => s.label?.toLowerCase().includes('student'))?.number ||
    statsList[0]?.number ||
    defaultStats.studentsPlaced;

  const statVisa =
    aboutSettings.stats?.stat2Value ||
    homepageSettings?.visaSuccessRate ||
    statsList.find((s: any) => s.label?.toLowerCase().includes('visa'))?.number ||
    statsList[1]?.number ||
    defaultStats.visaSuccessRate;

  const statUni =
    aboutSettings.stats?.stat3Value ||
    homepageSettings?.partnerUniversities ||
    statsList.find((s: any) => s.label?.toLowerCase().includes('uni'))?.number ||
    statsList[2]?.number ||
    defaultStats.partnerUniversities;

  const statScholarships =
    aboutSettings.stats?.stat4Value ||
    homepageSettings?.scholarshipsSecured ||
    statsList.find((s: any) => s.label?.toLowerCase().includes('scholarship'))?.number ||
    statsList[3]?.number ||
    defaultStats.scholarshipsSecured;

  const defaultPillars = [
    {
      title: 'Ethical Counsel',
      description: 'Zero commission steering. We recommend universities that truly align with your goals.',
    },
    {
      title: 'Audit-Grade Visas',
      description: 'Immigration specialists verify all financial dossiers before submission.',
    },
  ];

  const defaultValues = [
    {
      id: 'val-1',
      title: '1. Absolute Transparency',
      description: 'Honest chances assessment. If a program is unrealistic or overpriced, we give you unfiltered truth, not false promises.',
    },
    {
      id: 'val-2',
      title: '2. Academic Rigor',
      description: 'We treat every application like an academic submission, ensuring essays are intellectually rich and free of boilerplate clichés.',
    },
    {
      id: 'val-3',
      title: '3. Zero Plagiarism',
      description: 'Every personal statement is crafted from original student interviews and verified via Turnitin and AI-detection tools.',
    },
    {
      id: 'val-4',
      title: '4. Lifelong Support',
      description: 'Our care extends well past the airport gate into local housing, tax registration, and graduate job hunting.',
    },
  ];

  const pillars = aboutSettings.storyPillars && aboutSettings.storyPillars.length > 0
    ? aboutSettings.storyPillars
    : defaultPillars;

  const values = aboutSettings.values && aboutSettings.values.length > 0
    ? aboutSettings.values
    : defaultValues;

  const activeTeam = teamMembers.filter((m: any) => m.active !== false);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-20 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'About Us' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
              {aboutSettings.heroBadge || 'Who We Are & What We Stand For'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {aboutSettings.heroTitle || 'Empowering the Next Generation of'}{' '}
              <span className="text-amber-600">
                {aboutSettings.heroTitleHighlight || 'Global Leaders'}
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {aboutSettings.heroDescription ||
                'Founded on the belief that world-class education transforms trajectories, FCC Global Education bridges ambitious international scholars with the world’s most prestigious universities through ethical, data-driven, and high-touch mentorship.'}
            </p>
          </div>

          {/* Key Statistics Grid */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-600 truncate">{statPlaced}</div>
              <div className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                {aboutSettings.stats?.stat1Label || 'Students Placed Globally'}
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 truncate">{statVisa}</div>
              <div className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                {aboutSettings.stats?.stat2Label || 'Verified Visa Success'}
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-4xl font-extrabold text-cyan-600 truncate">{statUni}</div>
              <div className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                {aboutSettings.stats?.stat3Label || 'Direct Partner Universities'}
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 truncate">{statScholarships}</div>
              <div className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                {aboutSettings.stats?.stat4Label || 'Scholarships Won by Students'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story & Who We Are */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative h-[440px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src={
                  aboutSettings.storyImage ||
                  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80'
                }
                alt={aboutSettings.storyTitle || 'FCC Global Education counseling session'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white">
                <div className="text-xs font-bold text-amber-400">
                  {aboutSettings.storyImageBadge || 'Founded by International Academics'}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {aboutSettings.storyImageCaption ||
                    'Over a decade of university admissions excellence across UK, USA, Canada, & Australia.'}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {aboutSettings.storyBadge || 'Our Story'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {aboutSettings.storyTitle || 'Built on Academic Integrity, Driven by Student Triumph'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {aboutSettings.storyParagraph1 ||
                'FCC Global Education began with a clear realization: international education counseling was broken. Most traditional agencies pushed students toward low-tier, commission-heavy private institutions without regard for academic fit or career trajectory.'}
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {aboutSettings.storyParagraph2 ||
                'We set out to create an elite advisory modeled on collegiate fellowship committees. By hiring counselors with degrees from Oxford, Harvard, LSE, and TUM, we brought deep academic rigor to the application process. Today, we stand as one of the most respected independent educational consultancies with official university representations and direct alumni chapters spanning 20+ countries.'}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {pillars.map((pillar, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block text-sm mb-1">{pillar.title}</span>
                  <span className="text-slate-600">{pillar.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Mission Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{aboutSettings.missionTitle || 'Our Mission'}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {aboutSettings.missionDescription ||
                  'To democratize access to the world’s top educational institutions by providing rigorous profiling, uncompromised writing guidance, transparent visa compliance, and relentless scholarship advocacy for every deserving student.'}
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{aboutSettings.visionTitle || 'Our Vision'}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {aboutSettings.visionDescription ||
                  'To be the world’s most trusted overseas education authority, known for elevating students into global thinkers, innovative problem solvers, and lifelong alumni leaders in their host societies.'}
              </p>
            </div>
          </div>

          {/* 4. Core Values & Principles */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
              {aboutSettings.valuesBadge || 'Guiding Principles'}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {aboutSettings.valuesTitle || 'Our Non-Negotiable Values'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div key={val.id} className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="text-amber-500 font-bold text-base mb-2">{val.title}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leadership & Senior Education Counselors (Optional Toggle) */}
      {aboutSettings.showTeam !== false && activeTeam.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {aboutSettings.teamBadge || 'Expert Advisory Council'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {aboutSettings.teamTitle || 'Meet Our Senior Counselors & Visa Directors'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {aboutSettings.teamDescription ||
                'Our counselors possess real credentials from the world’s leading universities and legal immigration bodies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeTeam.map((member: any) => (
              <div
                key={member.id}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full bg-slate-900">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    {member.experience && (
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[11px] font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          {member.experience}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{member.name}</h3>
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">{member.role}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>

                    {member.credentials && Array.isArray(member.credentials) && member.credentials.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Credentials & Certifications:
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-700">
                          {member.credentials.map((cred: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                              <span className="truncate">{cred}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {member.specializations && Array.isArray(member.specializations) && member.specializations.length > 0 && (
                  <div className="p-5 pt-0">
                    <div className="flex flex-wrap gap-1">
                      {member.specializations.map((spec: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Pre-Footer Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-12 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
              {aboutSettings.ctaBadge || 'Begin Your Journey Today'}
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              {aboutSettings.ctaTitle || 'Connect Directly with a Senior Admissions Counselor'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {aboutSettings.ctaDescription ||
                'Schedule a personalized, one-on-one session to evaluate your transcripts and identify matched universities with high scholarship likelihood.'}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={aboutSettings.ctaPrimaryButtonLink || '/book-appointment'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                <span>{aboutSettings.ctaPrimaryButtonText || 'Book Free Profile Evaluation'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={aboutSettings.ctaSecondaryButtonLink || '/services'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <span>{aboutSettings.ctaSecondaryButtonText || 'View Our Services'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
