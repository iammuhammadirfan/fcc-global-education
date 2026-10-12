'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Filter,
  Play,
  ArrowRight,
  Award,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SuccessStoryCard from '@/components/cards/SuccessStoryCard';
import VideoCard from '@/components/cards/VideoCard';

export default function SuccessStoriesClient({
  initialStories,
  initialVideos,
}: {
  initialStories: any[];
  initialVideos: any[];
}) {
  const successStories = initialStories && initialStories.length > 0 ? initialStories : [];
  const videoTestimonials = initialVideos && initialVideos.length > 0 ? initialVideos : [];

  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');

  const countriesList = useMemo(() => {
    const list = new Set<string>();
    successStories.forEach((s) => {
      if (s.country) list.add(s.country);
    });
    return ['All', ...Array.from(list)];
  }, [successStories]);

  const degreesList = ['All', 'Masters', 'Bachelors', 'PhD'];

  const filteredStories = useMemo(() => {
    return successStories.filter((s) => {
      const matchCountry = selectedCountry === 'All' || s.country === selectedCountry;
      const degree =
        s.degreeLevel ||
        (s.program?.toLowerCase().includes('bachelor') || s.program?.toLowerCase().includes('ba ')
          ? 'Bachelors'
          : 'Masters');
      const matchDegree = selectedDegree === 'All' || degree === selectedDegree;
      return matchCountry && matchDegree;
    });
  }, [successStories, selectedCountry, selectedDegree]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Student Reviews & Experiences' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
              Verified Student Feedback & Ratings
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Real Students.{' '}
              <span className="text-amber-600">
                Real Reviews & Ratings.
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Read authentic feedback, university admissions journeys, and ratings from students who successfully secured admissions and student visas through FCC Global Education.
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-amber-600" /> Country:
              </span>
              {countriesList.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCountry === country
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Degree:</span>
              <div className="flex gap-1">
                {degreesList.map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setSelectedDegree(deg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedDegree === deg
                        ? 'bg-cyan-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                    }`}
                  >
                    {deg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Success Stories Spotlight */}
      {videoTestimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="student-videos">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Play className="w-3.5 h-3.5 fill-current" /> Student Video Testimonials
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Hear Directly From Our Placed Scholars
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Recorded Student Videos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoTestimonials.map((vid) => (
                <VideoCard key={vid.id} testimonial={vid} theme="dark" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Showing {filteredStories.length} Student {filteredStories.length === 1 ? 'Review' : 'Reviews'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified offer letters, counselor ratings, and authentic feedback from real students.
            </p>
          </div>
          {(selectedCountry !== 'All' || selectedDegree !== 'All') && (
            <button
              onClick={() => {
                setSelectedCountry('All');
                setSelectedDegree('All');
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Student Reviews Published Yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Approved student reviews and ratings will appear here once published from Admin → Student Reviews.
            </p>
            <div className="pt-2">
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-amber-400 hover:bg-slate-800 transition-all shadow-md"
              >
                <span>Start Your Application Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Pre-Footer Conversion Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
              Your Journey Starts Here
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Start Your Educational Journey with FCC Global Education
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Whether you need to boost your test score, fix an academic gap, or prepare for a rigorous consular visa interview, our mentors have guided thousands across the finish line.
            </p>
            <div className="pt-4">
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Book Your Free Counseling Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
