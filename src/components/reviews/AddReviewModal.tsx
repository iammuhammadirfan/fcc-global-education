'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle2, Building2, Globe, Send, Sparkles } from 'lucide-react';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUniversity?: string;
  defaultCountry?: string;
  onSuccess?: () => void;
}

export default function AddReviewModal({
  isOpen,
  onClose,
  defaultUniversity = '',
  defaultCountry = '',
  onSuccess,
}: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(defaultCountry || 'United Kingdom');
  const [university, setUniversity] = useState(defaultUniversity || '');
  const [program, setProgram] = useState('');
  const [comment, setComment] = useState('');

  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [universitiesList, setUniversitiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch published countries and universities from public API
  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/universities').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data.countries) setCountriesList(data.countries);
          if (data.universities) setUniversitiesList(data.universities);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchOptions();
    setSubmitted(false);
    setErrorMessage('');
  }, [isOpen]);

  // Set defaults when opening with props
  useEffect(() => {
    if (defaultCountry) setCountry(defaultCountry);
    if (defaultUniversity) setUniversity(defaultUniversity);
  }, [defaultCountry, defaultUniversity]);

  if (!isOpen) return null;

  // Filter universities by selected country (if available)
  const availableUniversities = universitiesList.filter(
    (u) => !country || u.country?.toLowerCase() === country.toLowerCase()
  );

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5: return '⭐⭐⭐⭐⭐ Exceptional (5.0)';
      case 4: return '⭐⭐⭐⭐ Very Good (4.0)';
      case 3: return '⭐⭐⭐ Good Experience (3.0)';
      case 2: return '⭐⭐ Needs Improvement (2.0)';
      case 1: return '⭐ Poor (1.0)';
      default: return 'Rate Your Experience';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !comment.trim()) {
      setErrorMessage('Please fill in your name, email, and review comment.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          rating,
          country: country || 'United Kingdom',
          university: university || 'FCC Global Education Counseling',
          program: program.trim() || undefined,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.error || 'Failed to submit review.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200/90 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Submit a Student Review
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Share your authentic university admission & visa experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">
              Review Submitted for Verification!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-800">{name}</strong>! Your review for{' '}
              <strong className="text-slate-800">{university || country}</strong> has been sent to our compliance team. Once approved by admin, it will appear publicly on our homepage and university directory.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Star Rating Section */}
            <div className="text-center p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Overall Experience Rating
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          active
                            ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-700 block">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>

            {/* Student Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zainab Malik"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Country & University Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>Destination Country *</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    const nextCountry = e.target.value;
                    setCountry(nextCountry);
                    setUniversity('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
                >
                  {countriesList.length > 0 ? (
                    countriesList.map((c: any) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Ireland">Ireland</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>University *</span>
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition font-medium"
                >
                  <option value="">
                    {availableUniversities.length > 0
                      ? `Select ${country} University (${availableUniversities.length} Available)...`
                      : `Select ${country} University...`}
                  </option>
                  {availableUniversities.map((u: any) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                  <option value={`Other Accredited University in ${country}`}>
                    ★ Other Accredited University in {country}
                  </option>
                </select>
              </div>
            </div>

            {/* Course / Program */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Degree / Course Program (Optional)
              </label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g. MSc Data Science / BA Economics"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Your Review / Experience *
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your journey: counselor guidance, university offer turnaround, visa mock interviews, and helpful tips for other applicants..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition leading-relaxed"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                🔒 Vetted for privacy & authenticity
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
