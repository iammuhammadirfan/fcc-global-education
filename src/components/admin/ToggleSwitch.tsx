'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  activeColor?: 'emerald' | 'amber' | 'blue';
  disabled?: boolean;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label = '',
  description,
  activeColor = 'emerald',
  disabled = false,
}: ToggleSwitchProps) {
  const isAmber = activeColor === 'amber';

  return (
    <div
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
        checked
          ? isAmber
            ? 'bg-amber-50/90 border-amber-300 shadow-xs'
            : 'bg-emerald-50/90 border-emerald-300 shadow-xs'
          : 'bg-slate-100/90 border-slate-300 hover:border-slate-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">
            {label}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs transition-all ${
              checked
                ? isAmber
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {checked ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>ON</span>
              </>
            ) : (
              <>
                <X className="w-3 h-3 stroke-[3]" />
                <span>OFF</span>
              </>
            )}
          </span>
        </div>
        {description && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* Pill Toggle Switch Button */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onChange(!checked);
        }}
        className={`relative inline-flex shrink-0 items-center h-7 w-12 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-inner ${
          checked
            ? isAmber
              ? 'bg-amber-500 border border-amber-600'
              : 'bg-emerald-500 border border-emerald-600'
            : 'bg-slate-300 border border-slate-400'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5.5 w-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        >
          {checked ? (
            <span
              className={`w-2 h-2 rounded-full ${
                isAmber ? 'bg-amber-600' : 'bg-emerald-600'
              }`}
            />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-400" />
          )}
        </span>
      </button>
    </div>
  );
}
