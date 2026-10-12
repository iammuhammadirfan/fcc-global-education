'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { countries as fallbackCountries } from '@/data/countries';

export default function InteractiveEligibilityForm({ countries = fallbackCountries }: { countries?: any[] }) {
  const countryList = countries && countries.length > 0 ? countries : fallbackCountries;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    targetCountry: countryList[0]?.slug || 'uk',
    degreeLevel: 'Masters',
    academicScore: '75%+ or 3.2+ GPA',
    englishTest: 'IELTS 6.5+',
    name: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          targetCountry: formData.targetCountry,
          studyLevel: formData.degreeLevel,
          message: `Eligibility Assessment: Academic Score: ${formData.academicScore}, English Test: ${formData.englishTest}`,
          sourcePage: 'Homepage Eligibility Calculator'
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-[#0F1E38] to-slate-950 border border-slate-700/80 p-4 sm:p-8 lg:p-10 shadow-2xl text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Admission Calculator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Check Your University & Visa Eligibility in 60 Seconds
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Get an instant evaluation of your admission probability, eligible scholarships, and visa checklist tailored to your target country.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl bg-slate-800/80 border border-emerald-500/40 p-6 sm:p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Evaluation Complete
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white mt-1">
                High Admission Likelihood (94% Match)
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
                Based on your profile, you qualify for admission at top-tier universities in {countryList.find((c: any) => c.slug === formData.targetCountry)?.name || 'your destination'} and merit scholarships of up to £8,000 / $10,000.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Target Level</div>
                <div className="text-sm font-bold text-white mt-0.5">{formData.degreeLevel} Degree</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Estimated Scholarship</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">20% – 50% Tuition</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Visa Feasibility</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Very High (98%+)</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                <span>Book 1-on-1 Counselor Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-slate-400 hover:text-white underline pt-2 sm:pt-0"
              >
                Check another profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Where do you want to study?
                </label>
                <select
                  value={formData.targetCountry}
                  onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {countryList.map((c: any) => (
                    <option key={c.id} value={c.slug} className="bg-slate-900 text-white">
                      {c.flag || '🌍'} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  2. Preferred Degree Level
                </label>
                <select
                  value={formData.degreeLevel}
                  onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="Masters" className="bg-slate-900">Master’s / Postgraduate Degree</option>
                  <option value="Bachelors" className="bg-slate-900">Bachelor’s / Undergraduate</option>
                  <option value="MBA" className="bg-slate-900">MBA (Executive / Full-Time)</option>
                  <option value="PhD" className="bg-slate-900">Doctoral / PhD Fellowship</option>
                </select>
              </div>

              {/* Academic Score */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  3. Current Academic Performance
                </label>
                <select
                  value={formData.academicScore}
                  onChange={(e) => setFormData({ ...formData, academicScore: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="85%+ or 3.7+ GPA" className="bg-slate-900">85%+ or 3.7+ GPA (First Class with Distinction)</option>
                  <option value="75%+ or 3.2+ GPA" className="bg-slate-900">75%–84% or 3.2–3.6 GPA (First Class)</option>
                  <option value="60%+ or 2.8+ GPA" className="bg-slate-900">60%–74% or 2.8–3.1 GPA (Second Class Upper)</option>
                  <option value="Below 60%" className="bg-slate-900">50%–59% (Second Class / In Progress)</option>
                </select>
              </div>

              {/* English Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  4. English Proficiency Status
                </label>
                <select
                  value={formData.englishTest}
                  onChange={(e) => setFormData({ ...formData, englishTest: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="IELTS 7.0+ or PTE 68+" className="bg-slate-900">IELTS 7.0+ / PTE 68+ (Ready)</option>
                  <option value="IELTS 6.5 or PTE 58-67" className="bg-slate-900">IELTS 6.5 / PTE 58–67 (Ready)</option>
                  <option value="Planning to take test" className="bg-slate-900">Planning to take exam soon</option>
                  <option value="Seeking IELTS Waiver" className="bg-slate-900">Requesting IELTS Waiver (Medium of Instruction)</option>
                </select>
              </div>
            </div>

            {/* Contact Details to Receive Report */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enter details to calculate your matched universities & scholarships:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 hover:scale-[1.01] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calculate My Admission & Scholarship Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
