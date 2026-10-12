'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function ContactClient({
  countries,
  generalSettings,
}: {
  countries: any[];
  generalSettings: any;
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentCountry: '',
    targetCountry: countries[0]?.name || 'United Kingdom',
    studyLevel: 'Masters',
    program: '',
    message: '',
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
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          currentCountry: formData.currentCountry,
          targetCountry: formData.targetCountry,
          studyLevel: formData.studyLevel,
          program: formData.program,
          message: formData.message,
          sourcePage: '/contact',
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const phone = generalSettings?.phone || '+44 (0) 20 7946 0912';
  const email = generalSettings?.email || 'admissions@fccglobaleducation.com';
  const address = generalSettings?.address || 'Level 4, 30 St Mary Axe, London EC3A 8EP, United Kingdom';
  const whatsappNum = (generalSettings?.whatsapp || phone).replace(/[^0-9]/g, '');

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
              Direct Global Advisory Channels
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Get in Touch with Our{' '}
              <span className="text-amber-600">
                Senior Advisors
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Have questions regarding university admission criteria, upcoming application deadlines, scholarship eligibility, or student visa compliance? Reach out across our global offices.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid: Form + Office Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 lg:p-10 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Direct Inquiry
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Send an Admissions Inquiry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your academic profile below and an assigned counselor will reply within 4 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950">Inquiry Received Successfully</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you, <span className="font-semibold">{formData.fullName}</span>. An admissions counselor specializing in {formData.targetCountry} has been notified and will reach out to {formData.email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-emerald-700 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah.j@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +44 7911 123456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Current Country */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Current Country *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pakistan, India, Nigeria..."
                      value={formData.currentCountry}
                      onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Destination */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Study Destination *
                    </label>
                    <select
                      value={formData.targetCountry}
                      onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.flag || '🌍'} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Study Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Study Level *
                    </label>
                    <select
                      value={formData.studyLevel}
                      onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="Masters">Master’s / Postgraduate</option>
                      <option value="Bachelors">Bachelor’s / Undergraduate</option>
                      <option value="MBA">MBA Program</option>
                      <option value="PhD">Doctoral / PhD Fellowship</option>
                    </select>
                  </div>
                </div>

                {/* Interested Program */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Course or Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MSc Data Science, Mechanical Engineering, LLM"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    How Can We Assist You?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your educational background, test scores, target universities, or any specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Send Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Global Office Cards & Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Box */}
            <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white pb-3 border-b border-slate-800">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Head Office Phone:</span>
                    <a href={`tel:${phone}`} className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                      {phone}
                    </a>
                    <span className="text-slate-500 block mt-0.5">Mon–Fri: 9:00 AM – 6:30 PM GMT</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                  <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Admissions Desk:</span>
                    <a href={`mailto:${email}`} className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Instant WhatsApp Helpline:</span>
                    <a
                      href={`https://wa.me/${whatsappNum}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-emerald-400 hover:underline"
                    >
                      {phone} (Chat Now)
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/book-appointment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                >
                  <span>Book Formal 30-Minute Video Appointment</span>
                  <Send className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Global Branch Offices */}
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Our Physical Presence
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>🇬🇧 London Global Headquarters</span>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold">Primary</span>
                </div>
                <p className="text-slate-600">{address}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs space-y-1">
                <div className="font-bold text-slate-900">🇨🇦 Toronto Liaison Office</div>
                <p className="text-slate-600">Suite 1800, 100 University Ave, Toronto, ON M5J 1V6, Canada</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs space-y-1">
                <div className="font-bold text-slate-900">🇦🇺 Melbourne Counseling Center</div>
                <p className="text-slate-600">Level 12, 120 Collins Street, Melbourne VIC 3000, Australia</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs space-y-1">
                <div className="font-bold text-slate-900">🇦🇪 Dubai Regional Hub</div>
                <p className="text-slate-600">Level 14, Boulevard Plaza Tower 1, Downtown Dubai, UAE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Visual Interactive Mockup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Visit Us in Person
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Global Headquarters ({address.split(',')[1]?.trim() || 'London'})
              </h3>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80"
              alt="City location map"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
            <div className="relative z-10 text-center p-6 rounded-2xl glass-card-dark border border-white/10 max-w-md">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold shadow-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">FCC Global Education HQ</h4>
              <p className="text-xs text-slate-300 mt-1">
                {address}
              </p>
              <div className="text-[11px] text-amber-400 mt-2 font-semibold">
                Central Station (3 min walk)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
