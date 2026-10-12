import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, Award, MapPin, Quote } from 'lucide-react';

interface SuccessStoryCardProps {
  story: any;
}

export default function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  const photo =
    story.studentPhoto ||
    story.avatar ||
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80';
  const name = story.studentName || story.name || 'Verified Scholar';
  const education =
    story.previousEducation ||
    story.cgpa ||
    (story.program ? 'Enrolled Student' : 'Verified Academic Profile');
  const country = story.country || 'International';
  const countrySlug =
    story.countrySlug ||
    (country ? country.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'destinations');
  const university = story.university || 'Partner University';
  const program = story.program || 'Admitted Degree Program';
  const scholarship = story.scholarshipAmount || story.scholarship;
  const visaResult =
    story.visaResult || (story.country ? `${story.country} Student Visa Approved` : 'Student Visa Approved');
  const testimonial = story.testimonial || story.comment || '';
  const intake = story.intake || 'Fall 2025';
  const rating = Math.min(5, Math.max(1, Number(story.rating) || 5));

  return (
    <div className="group rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 lg:p-7 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden w-full max-w-full">
      {/* Top Background Pattern */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-100/40 via-amber-50/20 to-transparent rounded-bl-full pointer-events-none" />

      <div className="space-y-3.5 relative z-10 w-full min-w-0">
        {/* Student Profile Header */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
            <Image
              src={photo}
              alt={name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
              {name}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">{education}</p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Admitted University & Program */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-sky-50/40 border border-slate-100/80 space-y-1.5 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-xs gap-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate min-w-0 flex-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{university}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200/80 shrink-0 shadow-2xs">
              {country}
            </span>
          </div>
          <div className="text-xs font-bold text-amber-800 truncate">{program}</div>
          {scholarship && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 mt-1 max-w-full">
              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{scholarship}</span>
            </div>
          )}
        </div>

        {/* Visa Result Pill */}
        {visaResult && (
          <div className="max-w-full overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs max-w-full">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{visaResult}</span>
            </div>
          </div>
        )}

        {/* Testimonial Quote */}
        <div className="relative pt-1">
          <Quote className="w-5 h-5 text-slate-200 absolute -top-2 -left-1 transform -scale-x-100 shrink-0" />
          <p className="text-xs text-slate-600 italic leading-relaxed pl-4 line-clamp-4">
            &ldquo;{testimonial}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4 gap-2">
        <span className="truncate text-[11px] sm:text-xs">Intake: {intake}</span>
        <Link
          href={`/destinations/${countrySlug}`}
          className="text-amber-600 font-bold hover:text-amber-700 hover:underline flex items-center gap-1 transition-colors shrink-0 text-[11px] sm:text-xs"
        >
          <span>Study in {country}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
