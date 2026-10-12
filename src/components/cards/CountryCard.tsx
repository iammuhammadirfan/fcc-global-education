import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, DollarSign, Award, GraduationCap } from 'lucide-react';
import { Country } from '@/data/types';

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Country Hero Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <Image
          src={country.heroImage}
          alt={`Study in ${country.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
          <span className="text-base">{country.flag}</span>
          <span>{country.region}</span>
        </div>

        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-md">
          {country.visaSuccessRate} Visa Rate
        </div>

        {/* Bottom Country Title in Image */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-between">
            <span>{country.name}</span>
            <span className="text-xs font-normal text-slate-300 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {country.currency}
            </span>
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {country.overview}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              <span>Avg Tuition</span>
            </div>
            <div className="font-semibold text-slate-900 mt-0.5 truncate text-[11px]">
              {country.averageTuition.split('/')[0]}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              <span>Post-Study Work</span>
            </div>
            <div className="font-semibold text-slate-900 mt-0.5 truncate text-[11px]">
              {country.postStudyWork.split('(')[0]}
            </div>
          </div>
        </div>

        {/* Top Universities Preview */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-500" />
            <span>Top Universities</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {country.topUniversityNames.slice(0, 3).map((uni, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium truncate max-w-[200px]"
              >
                {uni}
              </span>
            ))}
            {country.topUniversityNames.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
                +{country.topUniversityNames.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2">
          <Link
            href={`/destinations/${country.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 transition-colors group/btn"
          >
            <span>Explore {country.name}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
