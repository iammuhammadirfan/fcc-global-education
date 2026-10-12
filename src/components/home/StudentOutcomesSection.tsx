'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Plus, Star, CheckCircle2, Globe, Building, 
  MessageSquare, Play, Sparkles 
} from 'lucide-react';
import SuccessStoryCard from '@/components/cards/SuccessStoryCard';
import VideoCard from '@/components/cards/VideoCard';
import AddReviewModal from '@/components/reviews/AddReviewModal';
import { Review } from '@/lib/types';

interface StudentOutcomesSectionProps {
  stories: any[];
  realReviews: Review[];
  videos: any[];
}

export default function StudentOutcomesSection({
  stories = [],
  realReviews = [],
  videos = [],
}: StudentOutcomesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(realReviews);

  // Filter approved real reviews that should show on home
  const approvedHomeReviews = reviewsList.filter(
    (r) => (r.status === 'approved' || r.published === true) && (r.showOnHome === true || reviewsList.length <= 6)
  );
  // Real approved items - ONLY genuine reviews, no dummy success stories
  const itemsToDisplay = approvedHomeReviews.length > 0
    ? approvedHomeReviews
    : reviewsList.filter((r) => r.status === 'approved' || r.published === true);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header with Add Review Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            Verified Student Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Real Students, Genuine Reviews & Ratings
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-xl">
            Read verified feedback, admissions outcomes, and visa experiences from students who achieved their dreams with FCC Global Education.
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>

          <Link
            href="/success-stories"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors group"
          >
            <span>View All Student Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. Real Reviews with Screenshot Card Design */}
      {itemsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {itemsToDisplay.map((item) => (
            <SuccessStoryCard key={item.id} story={item} />
          ))}
        </div>
      ) : (
        /* Empty state when no reviews are approved yet */
        <div className="mb-12 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/80 flex items-center justify-center">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No Student Reviews Published Yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Be the first student to review your study abroad counseling experience! Submitted reviews will appear here once verified and approved by our admin.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 transition-all shadow-md hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Write the First Review</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Student Video Testimonials Showcase */}
      {videos.length > 0 && (
        <div
          className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0B1528] p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden mt-16"
          id="student-videos"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
                <Play className="w-3.5 h-3.5 fill-current" /> Student Videos
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2.5 tracking-tight">
                Student Video Testimonials
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Real video feedback, interview experiences, and visa grant stories recorded by our students.
              </p>
            </div>
            <Link
              href="/success-stories#student-videos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/90 border border-slate-700/80 text-amber-400 hover:text-white hover:bg-slate-800 hover:border-amber-400/40 transition-all shrink-0 shadow-sm"
            >
              <span>Watch More Student Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((vid) => (
              <VideoCard key={vid.id} testimonial={vid} theme="dark" />
            ))}
          </div>
        </div>
      )}

      {/* 5. Add Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Re-fetch approved reviews for home
          fetch('/api/reviews?home=true')
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.reviews) setReviewsList(d.reviews);
            })
            .catch(() => {});
        }}
      />
    </section>
  );
}
