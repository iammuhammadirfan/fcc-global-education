'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, Building, Globe, Quote } from 'lucide-react';
import { Review } from '@/lib/types';
import AddReviewModal from './AddReviewModal';

interface HomeReviewsSectionProps {
  initialReviews?: Review[];
}

export default function HomeReviewsSection({ initialReviews = [] }: HomeReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayReviews = reviews.filter((r) => r.status === 'approved' && r.published !== false && r.showOnHome === true);

  return (
    <div className="space-y-8">
      {/* Top Header with "Add Review" Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Verified Scholar Feedback
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            What Our Students Say About Us
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            Real feedback and ratings from international students who secured top university admissions and student visas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 shrink-0 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Student Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {displayReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Header: Student & Stars */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{rev.name}</span>
                      {rev.verifiedStudent && (
                        <span title="Verified Scholar">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{rev.country}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 shadow-2xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-[10px] font-bold text-slate-800 ml-1">{rev.rating || 5}.0</span>
                  </div>
                </div>

                {/* University & Course Tag */}
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-700">
                  <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold truncate">{rev.university}</span>
                  {rev.program && <span className="text-slate-400 truncate">• {rev.program}</span>}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Date */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Verified Admissions Review</span>
                <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600 font-medium">
            Be the first to share your experience with FCC Global Education!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
          >
            Add Review
          </button>
        </div>
      )}

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Re-fetch reviews to update immediately if approved
          fetch('/api/reviews?home=true')
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.reviews) setReviews(d.reviews);
            })
            .catch(() => {});
        }}
      />
    </div>
  );
}
