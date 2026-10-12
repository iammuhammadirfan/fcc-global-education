import React from 'react';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Calendar, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.findBySlug('customPages', slug);
  if (!page) {
    return { title: 'Page Not Found | FCC Global Education' };
  }
  return {
    title: page.seoTitle || `${page.title} | FCC Global Education`,
    description: page.seoDescription || `Read ${page.title} at FCC Global Education.`
  };
}

export default async function DynamicCustomPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await db.findBySlug('customPages', slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#0B1528] via-[#09101F] to-slate-950 text-white pt-10 pb-16 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <Breadcrumbs items={[{ label: page.title }]} />
          
          <div className="max-w-3xl space-y-3 pt-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {page.title}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Last updated: {page.updatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10)}
            </p>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-6 text-slate-800">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {page.content}
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Need clarification regarding our terms or academic policies?
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-semibold inline-flex items-center gap-2 transition"
            >
              Contact Legal & Admissions Support
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
