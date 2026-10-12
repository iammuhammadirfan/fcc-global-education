'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '@/data/types';

interface AccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number;
}

export default function Accordion({ items, defaultOpenIndex = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.id}
            className={`rounded-2xl transition-all duration-200 border ${
              isOpen
                ? 'bg-white border-amber-400/40 shadow-md ring-1 ring-amber-400/20'
                : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3 pr-4">
                <HelpCircle
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isOpen ? 'text-amber-500' : 'text-slate-400'
                  }`}
                />
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-amber-500' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                <p>{item.answer}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Category: {item.category}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
