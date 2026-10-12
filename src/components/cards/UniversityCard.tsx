import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Award, CheckCircle2, BookOpen } from 'lucide-react';
import { University } from '@/data/types';

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* University Campus Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <Image
          src={university.image}
          alt={university.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* World Rank Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold flex items-center gap-1 shadow-md">
          <Award className="w-3.5 h-3.5" />
          <span>QS Rank #{university.worldRank}</span>
        </div>

        {/* Acceptance rate badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[11px] font-semibold">
          {university.acceptanceRate} Acceptance
        </div>

        {/* Country & City Tag on Bottom of Image */}
        <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{university.city}</span>
          </span>
          <span className="font-semibold">{university.country}</span>
        </div>
      </div>

      {/* University Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
              {university.name}
            </h3>
            {university.officialRep && (
              <span className="flex-shrink-0" title="Official Partner Institution">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {university.overview}
          </p>
        </div>

        {/* Popular Courses */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-slate-400" />
            <span>Popular Programs</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(university.popularPrograms)
              ? university.popularPrograms
              : typeof university.popularPrograms === 'string'
              ? (university.popularPrograms as string).split(',').map((s: string) => s.trim())
              : ['Undergraduate Programs', 'Postgraduate Programs']
            ).slice(0, 2).map((prog: string, idx: number) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium truncate max-w-[240px]"
              >
                {prog}
              </span>
            ))}
          </div>
        </div>

        {/* Tuition & Cost Info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Tuition (from)</span>
              {(() => {
                const rawTuition = (university as any).tuition;
                if (typeof rawTuition === 'object' && rawTuition !== null) {
                  return (rawTuition.postgraduate || rawTuition.undergraduate || '$20,000/yr').split('–')[0].split('-')[0].trim();
                }
                if (typeof rawTuition === 'string') {
                  return rawTuition.split('–')[0].split('-')[0].trim();
                }
                return '$20,000 / year';
              })()}
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Living Cost</span>
            <span className="font-medium text-slate-700">
              {university.livingCostEstimate
                ? university.livingCostEstimate.split('–')[0].split('-')[0].trim() + '/mo'
                : '$1,200 / mo'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            href={`/universities/${university.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white transition-all group/btn"
          >
            <span>View University Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
