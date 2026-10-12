import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Quote, Award, CheckCircle2, ArrowRight, ShieldCheck, 
  Sparkles, CalendarCheck, GraduationCap, Star
} from 'lucide-react';

interface CEOIntroProps {
  ceoData?: {
    enabled?: boolean;
    name?: string;
    title?: string;
    badge?: string;
    heading?: string;
    quote?: string;
    bio?: string;
    photoUrl?: string;
    experienceYears?: string;
    statsLabel?: string;
    credentials?: string[];
    signatureText?: string;
    ctaText?: string;
    ctaHref?: string;
  };
}

export default function CEOIntroSection({ ceoData }: CEOIntroProps) {
  // If explicitly disabled in Admin CMS, return null
  if (ceoData?.enabled === false) {
    return null;
  }

  const name = ceoData?.name || 'Dr. Farhan Chaudhry';
  const title = ceoData?.title || 'Founder & Chief Executive Officer';
  const badge = ceoData?.badge || "Founder's Vision & Leadership";
  const heading = ceoData?.heading || "Empowering Global Aspirations With Proven Expertise & Honesty";
  const quote = ceoData?.quote || "Every student who walks through our doors is not just an application — they are a future leader with unique potential. We exist to open the world's most prestigious university doors for them.";
  const bio = ceoData?.bio || "With over 15 years of distinguished leadership in global education counseling, student visa strategy, and university admissions partnerships, our team has steered thousands of candidates to top-ranked institutions across the UK, USA, Canada, Australia, and Europe.";
  const photoUrl = ceoData?.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80';
  const experienceYears = ceoData?.experienceYears || '15+';
  const statsLabel = ceoData?.statsLabel || 'Years of Global Admissions Leadership';
  const credentials = (ceoData?.credentials && ceoData.credentials.length > 0)
    ? ceoData.credentials
    : [
        'PIER (QEAC) Certified Education Counselor',
        'British Council Certified Global Agent',
        '100% Transparency & Direct University Partnerships',
      ];
  const signatureText = ceoData?.signatureText || name;
  const ctaText = ceoData?.ctaText || 'Book Consultation with Leadership';
  const ctaHref = ceoData?.ctaHref || '/book-appointment';

  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-10 text-slate-900 overflow-hidden shadow-xl border border-slate-200/90 select-none">
      {/* Background soft ambient accents */}
      <div className="absolute -top-10 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: CEO Photo & Authority Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            {/* Outer Glow & Luxury Accent */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-400/30 via-amber-200/20 to-amber-500/20 rounded-2xl blur-sm opacity-80" />

            {/* Main Photo Frame */}
            <div className="relative rounded-2xl bg-white p-2.5 sm:p-3 border border-slate-200/90 shadow-md overflow-hidden">
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* On-Image Name Badge */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] mb-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Leadership</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">{name}</h3>
                  <p className="text-[11px] text-amber-200/90 font-medium">{title}</p>
                </div>
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute top-2 right-2 sm:-top-2.5 sm:-right-2.5 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-slate-200 shadow-md flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-xs">
                  {experienceYears}
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">Years Proven</div>
                  <div className="text-[8.5px] sm:text-[9px] text-slate-500 font-medium leading-tight">Admissions Experience</div>
                </div>
              </div>
            </div>

            {/* Trust Tag below photo */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-600 bg-slate-50/80 py-1.5 px-3 rounded-xl border border-slate-200 shadow-2xs text-center max-w-full">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
              <span>Mentored 5,000+ Students to Global Universities</span>
            </div>
          </div>
        </div>

        {/* Right Column: CEO Message & Introduction Details */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Section Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{badge}</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {heading}
          </h2>

          {/* CEO Highlight Quote Box */}
          <div className="relative rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 p-4 sm:p-5 text-slate-800 space-y-2">
            <Quote className="w-7 h-7 text-amber-500/30 absolute top-3 right-4 pointer-events-none" />
            <p className="text-xs sm:text-sm font-semibold italic text-slate-900 leading-relaxed relative z-10">
              &ldquo;{quote}&rdquo;
            </p>
            <div className="text-xs font-bold text-amber-900 pt-0.5">
              — {name}, <span className="font-normal text-slate-600">{title}</span>
            </div>
          </div>

          {/* Short Bio Paragraph */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {bio}
          </p>

          {/* Professional Credentials Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {credentials.map((cred, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{cred}</span>
              </div>
            ))}
          </div>

          {/* Signature & CTA Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-serif italic text-2xl text-slate-900 font-bold tracking-wide">
                {signatureText}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Founder & Chief Executive Officer
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href={ctaHref}
                prefetch={true}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 active:brightness-95 text-white shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer text-center"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
