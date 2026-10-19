'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Plus, Star, CheckCircle2, Globe, Building, 
  MessageSquare, Play, Sparkles, ChevronLeft, ChevronRight 
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

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Filter approved real reviews that should show on home
  const approvedHomeReviews = reviewsList.filter(
    (r) => r.status === 'approved' && r.published !== false && r.showOnHome === true
  );
  // Real approved items - ONLY genuine approved reviews, never pending
  const approvedGeneral = reviewsList.filter(
    (r) => r.status === 'approved' && r.published !== false
  );
  const itemsToDisplay = approvedHomeReviews.length > 0 ? approvedHomeReviews : approvedGeneral;

  const total = itemsToDisplay.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  // Reset index if cardsPerView changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex));
    }
  }, [maxIndex, currentIndex]);

  // Auto-play slider every 4 seconds, pause on hover
  useEffect(() => {
    if (maxIndex <= 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxIndex, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header with Add Review Button & Slider Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
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

        {/* Right Action Buttons & Slider Navigation Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {itemsToDisplay.length > cardsPerView && (
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Review"
                className="p-2.5 rounded-xl bg-white hover:bg-amber-50 active:bg-amber-100 text-slate-800 border border-slate-200/90 transition shadow-xs cursor-pointer hover:border-amber-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Review"
                className="p-2.5 rounded-xl bg-white hover:bg-amber-50 active:bg-amber-100 text-slate-800 border border-slate-200/90 transition shadow-xs cursor-pointer hover:border-amber-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] flex-1 sm:flex-initial cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>

          <Link
            href="/success-stories"
            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors group flex-1 sm:flex-initial whitespace-nowrap"
          >
            <span>View All Student Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. Interactive Responsive Reviews Carousel Slider */}
      {itemsToDisplay.length > 0 ? (
        <div
          className="relative mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Overflow Track */}
          <div
            className="overflow-hidden py-2 -mx-2 sm:-mx-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {itemsToDisplay.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 px-2 sm:px-3 flex"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <div className="w-full h-full flex flex-col">
                    <SuccessStoryCard story={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator & Slide Counter */}
          {maxIndex > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 sm:w-8 h-2.5 bg-amber-500 shadow-xs'
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write the First Review</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Student Video Testimonials Showcase (Compact & Modern Design) */}
      {videos.length > 0 && (
        <div
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-[#0B1528] p-5 sm:p-7 lg:p-8 text-white border border-slate-800/90 shadow-xl relative overflow-hidden mt-10 sm:mt-12"
          id="student-videos"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Play className="w-3 h-3 fill-current" /> Student Videos
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 tracking-tight">
                Student Video Testimonials
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 max-w-xl">
                Real video feedback, interview experiences, and visa grant stories recorded by our students.
              </p>
            </div>
            <Link
              href="/success-stories#student-videos"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/40 text-amber-400 hover:text-white transition-all shrink-0 self-start sm:self-center shadow-xs"
            >
              <span>Watch More Student Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div
            className={`relative z-10 grid gap-4 sm:gap-5 ${
              videos.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
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
