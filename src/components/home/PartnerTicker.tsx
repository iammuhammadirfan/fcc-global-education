'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, Building, Sparkles } from 'lucide-react';

const defaultPartners = [
  { name: 'University of Oxford', country: 'UK', flag: '🇬🇧', code: 'GB' },
  { name: 'University of Cambridge', country: 'UK', flag: '🇬🇧', code: 'GB' },
  { name: 'Imperial College London', country: 'UK', flag: '🇬🇧', code: 'GB' },
  { name: 'Harvard University', country: 'USA', flag: '🇺🇸', code: 'US' },
  { name: 'Columbia University', country: 'USA', flag: '🇺🇸', code: 'US' },
  { name: 'University College London (UCL)', country: 'UK', flag: '🇬🇧', code: 'GB' },
  { name: 'University of Toronto', country: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'The University of Melbourne', country: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'University of Manchester', country: 'UK', flag: '🇬🇧', code: 'GB' },
  { name: 'Technical University of Munich (TUM)', country: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'McGill University', country: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'Trinity College Dublin', country: 'Ireland', flag: '🇮🇪', code: 'IE' },
  { name: 'University of Sydney', country: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'University of Edinburgh', country: 'UK', flag: '🇬🇧', code: 'GB' },
];

interface PartnerTickerProps {
  universities?: any[];
}

export default function PartnerTicker({ universities = [] }: PartnerTickerProps) {
  const partnersList =
    universities && universities.length > 0
      ? [
          ...universities.map((u) => ({
            name: u.name,
            country: u.country || 'Global',
            flag: '🎓',
            code: (u.country || 'GL').slice(0, 2).toUpperCase(),
          })),
          ...defaultPartners,
        ]
      : defaultPartners;

  // Duplicate the array to create a completely seamless infinite continuous loop
  const infiniteLoop = [...partnersList, ...partnersList];

  return (
    <div className="relative bg-white border-y border-slate-200/90 py-3.5 sm:py-4 overflow-hidden shadow-2xs z-20 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-6 w-full max-w-full overflow-hidden min-w-0">
          
          {/* Left Fixed Badge / Label */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-slate-900 shrink-0 text-center max-w-full shadow-2xs">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950" />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-800 text-center truncate sm:whitespace-normal">
              Official Representatives & Global Alumni Networks
            </span>
          </div>

          {/* Right Sliding Ribbon Marquee Track ("Pati") */}
          <div className="relative flex-1 w-full max-w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="animate-infinite-marquee flex items-center gap-3 py-1 cursor-pointer">
              {infiniteLoop.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 font-semibold text-xs whitespace-nowrap shadow-2xs hover:border-amber-400 hover:bg-amber-50/60 hover:text-amber-900 transition-all shrink-0"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-100/80 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {p.code || '✓'}
                  </span>
                  <span className="text-slate-900 font-medium">{p.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({p.country})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
