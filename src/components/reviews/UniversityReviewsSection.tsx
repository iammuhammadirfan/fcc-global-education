'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, Award, Quote, Sparkles } from 'lucide-react';
import { Review } from '@/lib/types';
import AddReviewModal from './AddReviewModal';

interface UniversityReviewsSectionProps {
  universityName: string;
  countryName: string;
  initialReviews?: Review[];
}

export default function UniversityReviewsSection({
  universityName,
  countryName,
  initialReviews = [],
}: UniversityReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter approved reviews for this university
  const uLower = universityName.toLowerCase().trim();
  const matchedReviews = reviews.filter(
    (r) =>
      (r.status === 'approved' || r.published === true) &&
      (r.university?.toLowerCase() === uLower ||
        r.universitySlug?.toLowerCase() === uLower.replace(/[^a-z0-9]+/g, '-'))
  );

  const avgRating = matchedReviews.length > 0
    ? (matchedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / matchedReviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-slate-50/90 border border-slate-200/90 p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Verified Student Reviews
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Experiences at {universityName}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
              Genuine reviews from FCC scholars who applied, interviewed, and enrolled at {universityName}.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {matchedReviews.length > 0 && (
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 flex items-center gap-1">
                  <span>{avgRating}</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-500 font-semibold">
                  {matchedReviews.length} Verified {matchedReviews.length === 1 ? 'Review' : 'Reviews'}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Review {universityName}</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards List */}
        {matchedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verifiedStudent && (
                          <span title="Verified Admission">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </h4>
                      {rev.program && (
                        <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[200px]">
                          {rev.program}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Admitted Scholar</span>
                  <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Are You an Alumnus or Student at {universityName}?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Be the first to share your firsthand admission experience and help prospective scholars from your home country.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-sm"
              >
                Write First Review for {universityName}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultUniversity={universityName}
        defaultCountry={countryName}
        onSuccess={() => {
          fetch(`/api/reviews?university=${encodeURIComponent(universityName)}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.reviews) setReviews(d.reviews);
            })
            .catch(() => {});
        }}
      />
    </section>
  );
}
