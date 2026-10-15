'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import UniversityCard from '@/components/cards/UniversityCard';
import { University } from '@/lib/types';

interface ExpandableUniversitiesProps {
  universities: University[];
}

export default function ExpandableUniversities({ universities }: ExpandableUniversitiesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleUniversities = isExpanded ? universities : universities.slice(0, 6);
  const remainingCount = Math.max(0, universities.length - 6);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleUniversities.map((uni) => (
          <UniversityCard key={uni.id} university={uni} />
        ))}
      </div>

      {universities.length > 6 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-sm border-2 border-slate-200 hover:border-slate-900 transition-all shadow-sm hover:shadow-lg cursor-pointer group select-none"
          >
            {isExpanded ? (
              <>
                <span>Show Fewer Universities (Top 6)</span>
                <ChevronUp className="w-4 h-4 text-amber-500 group-hover:text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                <span>View More Universities</span>
                <span className="text-xs font-black bg-amber-100 group-hover:bg-amber-400 text-amber-900 group-hover:text-slate-950 px-2 py-0.5 rounded-full transition-colors">
                  +{remainingCount} More
                </span>
                <ChevronDown className="w-4 h-4 text-amber-500 group-hover:text-amber-400 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
