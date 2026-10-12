'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Accordion from '@/components/ui/Accordion';

export default function FAQClient({ initialFaqs }: { initialFaqs: any[] }) {
  const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : [];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically compute categories from faqs
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return ['All', ...Array.from(cats)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory =
        selectedCategory === 'All' || faq.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
              Clear & Transparent Answers
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Frequently Asked{' '}
              <span className="text-amber-600">
                Questions
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Find instant clarity on admission deadlines, conditional offers, IELTS waivers, financial proof for visas, and post-study work regulations.
            </p>
          </div>

          {/* Search & Category Filter Multi-Bar */}
          <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Display */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Question' : 'Questions'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any question to expand its full advisory breakdown.
            </p>
          </div>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No questions matched</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different terms or select &quot;All&quot; categories.
            </p>
          </div>
        ) : (
          <Accordion items={filteredFaqs} defaultOpenIndex={0} />
        )}

        {/* Still Have Questions Box */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">
              Still have a specific question about your profile?
            </h3>
            <p className="text-xs text-slate-300">
              Our counselors provide personalized answers within minutes over WhatsApp or phone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <a
              href="https://wa.me/442079460912"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
            >
              <span>Book Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
