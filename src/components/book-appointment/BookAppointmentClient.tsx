'use client';

import { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  Building2,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const defaultConsultationTypes = [
  {
    id: 'free-initial',
    title: 'Free Initial Profile Evaluation',
    duration: '30 Mins',
    desc: 'Comprehensive review of your transcripts, eligibility check, and high-level country shortlisting.',
    badge: '100% Free',
  },
  {
    id: 'uni-selection',
    title: 'University Selection & Profiling',
    duration: '45 Mins',
    desc: 'Deep-dive into 6–10 tailored Dream, Target, and Safe institutions with course syllabus comparisons.',
    badge: 'Popular',
  },
  {
    id: 'visa-consult',
    title: 'Visa & Compliance Consultation',
    duration: '45 Mins',
    desc: 'Financial document audit, 28-day holding rules, blocked accounts, and consular interview preparation.',
    badge: 'High Priority',
  },
  {
    id: 'scholarship-aid',
    title: 'Scholarship & Financial Aid Strategy',
    duration: '45 Mins',
    desc: 'Targeted assessment for merit bursaries, Chevening, Fulbright, DAAD, and departmental fellowships.',
    badge: 'Merit-Focused',
  },
];

const defaultTimeSlots = [
  '09:30 AM – 10:00 AM',
  '11:00 AM – 11:30 AM',
  '02:00 PM – 02:30 PM',
  '03:30 PM – 04:00 PM',
  '05:00 PM – 05:30 PM',
  '06:30 PM – 07:00 PM',
];

export default function BookAppointmentClient({
  countries,
  appointmentSettings,
}: {
  countries: any[];
  appointmentSettings: any;
}) {
  const rawConsultationTypes =
    Array.isArray(appointmentSettings?.consultationTypes) && appointmentSettings.consultationTypes.length > 0
      ? appointmentSettings.consultationTypes
      : defaultConsultationTypes;

  const consultationTypes = rawConsultationTypes.map((item: any, idx: number) => {
    if (typeof item === 'string') {
      const match = defaultConsultationTypes.find(
        (d) => d.title.toLowerCase() === item.toLowerCase() || d.id === item
      );
      if (match) return match;
      return {
        id: `type-${idx}`,
        title: item,
        duration: '30-45 Mins',
        desc: 'Comprehensive 1-on-1 counseling session tailored to your academic qualifications and study abroad aspirations.',
        badge: idx === 0 ? '100% Free' : 'Recommended',
      };
    }
    const title = item.title || item.name || 'Admissions Consultation';
    const match = defaultConsultationTypes.find(
      (d) => d.title.toLowerCase() === title.toLowerCase() || d.id === item.id
    );
    return {
      id: item.id || `type-${idx}`,
      title,
      duration: item.duration || match?.duration || '30 Mins',
      desc: item.desc || item.description || match?.desc || 'Personalized strategic advisory with a certified study abroad counselor.',
      badge: item.badge || match?.badge || (idx === 0 ? '100% Free' : ''),
    };
  });

  const availableTimeSlots =
    Array.isArray(appointmentSettings?.timeSlots) && appointmentSettings.timeSlots.length > 0
      ? appointmentSettings.timeSlots
      : defaultTimeSlots;

  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedType, setSelectedType] = useState(
    consultationTypes[0]?.title || 'Free Initial Profile Evaluation'
  );
  const [meetingMode, setMeetingMode] = useState<'video' | 'in_person'>('video');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState(availableTimeSlots[0] || '11:00 AM – 11:30 AM');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    targetCountry: countries[0]?.name || 'United Kingdom',
    studyLevel: 'Masters',
    message: '',
  });

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          studentName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          targetCountry: formData.targetCountry,
          country: formData.targetCountry,
          studyLevel: formData.studyLevel,
          consultationType: selectedType,
          preferredDate: selectedDate,
          date: selectedDate,
          preferredTime: selectedTime,
          time: selectedTime,
          meetingMode,
          format: meetingMode === 'video' ? '1-on-1 Private Video Call' : 'In-Person Office Visit',
          message: formData.message,
        }),
      });
      setConfirmed(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // safe fallback
      }
    } catch (err) {
      console.error(err);
      setConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Book Appointment' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
              1-on-1 Confidential Mentorship
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Schedule Your Free{' '}
              <span className="text-amber-600">
                Admissions Strategy Call
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Book a direct video consultation with a certified senior counselor. We will analyze your academic transcripts, test scores, target destination, and scholarship feasibility.
            </p>
          </div>
        </div>
      </section>

      {/* Main Booking Interface */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmed ? (
          /* Confirmation Screen */
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-14 text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Your Consultation is Scheduled!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                A calendar invitation and Google Meet video conference link have been dispatched to <strong>{formData.email}</strong>.
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-xl mx-auto text-left space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-bold text-slate-900">{formData.fullName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Consultation Session:</span>
                <span className="font-bold text-amber-600">{selectedType}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-900">
                  {selectedDate} at {selectedTime} (GMT)
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Target Destination:</span>
                <span className="font-bold text-slate-900">{formData.targetCountry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Format:</span>
                <span className="font-bold flex items-center gap-1.5">
                  {meetingMode === 'video' ? (
                    <>
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                        1-on-1 Private Video Call
                      </span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                        In-Person Office Visit (London Office)
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/442079460912?text=Hello%20FCC Global Education%2C%20I%20just%20booked%20a%20consultation%20for%20${encodeURIComponent(formData.fullName)}%20on%20${selectedDate}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg"
              >
                <span>Confirm Appointment via WhatsApp</span>
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-step Booking Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 lg:p-12 shadow-sm space-y-8 sm:space-y-10"
          >
            {/* Step 1: Select Consultation Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Select Consultation Type
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {consultationTypes.map((type: any) => (
                  <div
                    key={type.id || type.title}
                    onClick={() => setSelectedType(type.title)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      selectedType === type.title
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-900">
                          {type.title}
                        </span>
                        {type.badge && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            {type.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {type.desc}
                      </p>
                    </div>
                    {type.duration && (
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{type.duration}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Meeting Mode: Online Video vs In-Person Office Visit */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between flex-wrap gap-1">
                <span>Select Consultation Meeting Format</span>
                <span className="text-[11px] text-amber-600 font-semibold">
                  {meetingMode === 'video' ? 'Virtual Video Conference' : 'FCC Global Headquarters'}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                  onClick={() => setMeetingMode('video')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    meetingMode === 'video'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${meetingMode === 'video' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>1-on-1 Private Video Call</span>
                      {meetingMode === 'video' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Selected</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Google Meet video link dispatched automatically to your email address.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setMeetingMode('in_person')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    meetingMode === 'in_person'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${meetingMode === 'in_person' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>In-Person Office Visit</span>
                      {meetingMode === 'in_person' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Selected</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Meet senior advisors at our London Headquarters (Mayfair) or regional center.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Date & Time Selection */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Choose Preferred Date & Time Slot
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-amber-500" />
                    <span>Preferred Consultation Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Available Monday through Saturday
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Select Time Slot (GMT / UK Time)</span>
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot: string, idx: number) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center truncate ${
                          selectedTime === slot
                            ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Candidate Information */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Your Profile Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Sterling"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (For Calendar Link) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+44 7700 900123"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Study Destination *
                  </label>
                  <select
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  >
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.flag || '🌍'} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Study Level *
                  </label>
                  <select
                    value={formData.studyLevel}
                    onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Masters">Master’s / Postgraduate</option>
                    <option value="Bachelors">Bachelor’s / Undergraduate</option>
                    <option value="MBA">MBA Program</option>
                    <option value="PhD">Doctoral / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Any Questions for the Counselor?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scholarship options, IELTS waiver"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 hover:scale-[1.01] active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{submitting ? 'Confirming Appointment...' : 'Confirm & Book My Consultation'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-center text-[11px] text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero obligations. All student information is kept strictly confidential under GDPR.</span>
              </div>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
