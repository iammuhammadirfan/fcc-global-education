import { Metadata } from 'next';
import Link from 'next/link';
import {
  Globe2,
  Building2,
  GraduationCap,
  FileCheck2,
  BookOpen,
  Award,
  Compass,
  Shield,
  HelpCircle,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Complete Website Sitemap & Search Crawler Index | FCC Global Education',
  description:
    'Browse the complete architectural directory and sitemap of FCC Global Education. Access direct crawlable links to 12 study abroad destinations, global universities, admissions services, visa success records, and student guides.',
  keywords: [
    'FCC Global Education sitemap',
    'study abroad directory',
    'university index',
    'visa success sitemap',
    'overseas education links',
  ],
  alternates: {
    canonical: 'https://fccglobaleducation.com/sitemap',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SitemapPage() {
  const [
    countries,
    universities,
    services,
    blogPosts,
    customPages,
    generalSettings,
  ] = await Promise.all([
    db.getTable('countries').then((res) => res || []).catch(() => []),
    db.getTable('universities').then((res) => res || []).catch(() => []),
    db.getTable('services').then((res) => res || []).catch(() => []),
    db.getTable('blogPosts').then((res) => res || []).catch(() => []),
    db.getTable('customPages').then((res) => res || []).catch(() => []),
    db.getTable('generalSettings').then((res) => res || {}).catch(() => ({})),
  ]);

  const liveCountries = countries.filter((c: any) => c.published !== false);
  const liveUniversities = universities.filter((u: any) => u.published !== false);
  const liveServices = services.filter((s: any) => s.active !== false);
  const liveBlogs = blogPosts.filter((b: any) => b.published !== false);
  const liveCustomPages = customPages.filter((p: any) => p.published !== false);

  const mainPages = [
    { title: 'Home Page', href: '/', desc: 'Official landing page, hero highlights, admissions stats, and live visa approvals.' },
    { title: 'Study Destinations Directory', href: '/destinations', desc: 'Comprehensive guide to 12 top study destinations worldwide.' },
    { title: 'Global Universities Directory', href: '/universities', desc: 'Search and filter accredited universities, rankings, and fees.' },
    { title: 'Admissions & Visa Services', href: '/services', desc: 'End-to-end consulting, CAS audits, SOP review, and mock interviews.' },
    { title: 'Visa Success Gallery & Official Proofs', href: '/visa-success', desc: 'Authentic student visa approvals, embassy grant stamps, and timelines.' },
    { title: 'Student Success Stories & Reviews', href: '/success-stories', desc: 'Video reviews and verified student testimonials from top universities.' },
    { title: 'Admissions Knowledge Base & Blog', href: '/blog', desc: 'Expert guides on visas, scholarships, living costs, and intake dates.' },
    { title: 'About FCC Global Education', href: '/about', desc: 'Our certified counselors, British Council status, and global track record.' },
    { title: 'Book an Advisory Session', href: '/book-appointment', desc: 'Schedule a free 1-on-1 counseling session with an immigration expert.' },
    { title: 'Frequently Asked Questions (FAQ)', href: '/faq', desc: 'Answers to university admissions, funding proof, and visa requirements.' },
    { title: 'Contact & Office Locations', href: '/contact', desc: 'London and global contact points, WhatsApp assistance, and inquiries.' },
  ];

  const legalPages = [
    { title: 'Privacy Policy', href: '/privacy', desc: 'How we protect and manage student applicant data.' },
    { title: 'Terms of Service', href: '/terms', desc: 'Consulting representation terms, obligations, and transparency notice.' },
    { title: 'Cookie Policy', href: '/cookies', desc: 'Information on website cookies, analytics, and session preferences.' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-10 sm:mb-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">HTML Sitemap & Directory</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3">
                <Compass className="w-3.5 h-3.5 text-amber-700" /> Search Engine Crawler Index & Directory
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Website Sitemap
              </h1>
              <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                An exhaustive, real-time architectural map of all public pages, destinations, university profiles, and services published across <strong className="text-slate-900 font-bold">FCC Global Education</strong>.
              </p>
            </div>

            {/* XML Feeds for Bots */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all group"
              >
                <Code2 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>XML Sitemap (For Googlebot)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/robots.txt"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all group"
              >
                <Shield className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
                <span>robots.txt</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 1: Main Platform Pages */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Core Website Pages ({mainPages.length})
              </h2>
              <p className="text-xs text-slate-500">Primary consultation, admissions portals, and student engagement pages.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {page.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {page.desc}
                  </p>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-amber-700 mt-3 pt-3 border-t border-slate-100 block">
                  {page.href}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Study Abroad Destinations */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Study Abroad Destination Guides ({liveCountries.length})
              </h2>
              <p className="text-xs text-slate-500">In-depth guides for student visa pathways, tuition rates, and post-study work rights.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveCountries.map((c: any) => (
              <Link
                key={c.id || c.slug}
                href={`/destinations/${c.slug}`}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{c.flag || '🌍'}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                      Study in {c.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {c.visaSuccessRate ? `${c.visaSuccessRate} Visa Rate` : 'Top Destination'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 shrink-0 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Universities Directory */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Global Universities & Partner Institutions ({liveUniversities.length})
              </h2>
              <p className="text-xs text-slate-500">World-ranked universities represented by FCC Global Education with official direct admissions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveUniversities.map((u: any) => (
              <Link
                key={u.id || u.slug}
                href={`/universities/${u.slug}`}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 truncate transition-colors">
                    {u.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>{u.country}</span>
                    {u.worldRank && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">{u.worldRank}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 shrink-0 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Admissions & Visa Services */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Admissions, Scholarship & Visa Services ({liveServices.length})
              </h2>
              <p className="text-xs text-slate-500">Comprehensive assistance from university application to consular visa grant.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveServices.map((s: any) => (
              <Link
                key={s.id || s.slug}
                href={`/services/${s.slug}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {s.shortDesc || s.fullDesc || 'Professional counseling service offered by FCC Global Education.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-600">
                  <span>Explore Service Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Blog & Articles (if any) */}
        {liveBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Admissions Insights & Articles ({liveBlogs.length})
                </h2>
                <p className="text-xs text-slate-500">Guides on visa policies, English tests, statement of purpose, and living budgets.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveBlogs.map((b: any) => (
                <Link
                  key={b.id || b.slug}
                  href={`/blog/${b.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                      {b.category || 'Article'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 mt-2.5 transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-3 pt-3 border-t border-slate-100 block">
                    Read Full Guide →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Legal & Compliance */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Legal, Policies & Institutional Disclosures ({legalPages.length})
              </h2>
              <p className="text-xs text-slate-500">Transparency standards, privacy protections, and counseling representation rules.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {legalPages.map((lp) => (
              <Link
                key={lp.href}
                href={lp.href}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {lp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {lp.desc}
                  </p>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-slate-700 mt-3 pt-3 border-t border-slate-100 block">
                  {lp.href}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom Crawl Summary Box */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-bold tracking-tight text-amber-400">
              Search Engine Indexing & Bot Discovery
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              This sitemap automatically synchronizes with Google Search Console, Bing Webmaster Tools, and Yandex. Whenever new study destinations, universities, or student visa records are added, the dynamic sitemap XML updates in real time.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Sitemap URL: https://fccglobaleducation.com/sitemap.xml
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1.5">
                ● Live Real-Time Crawl Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
