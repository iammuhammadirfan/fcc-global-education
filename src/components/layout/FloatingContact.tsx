'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Calendar } from 'lucide-react';

interface FloatingContactProps {
  generalSettings?: any;
}

// Official Authentic WhatsApp SVG Icon
function WhatsAppIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.33C16.32 14.21 15.1 13.61 14.87 13.52C14.65 13.44 14.48 13.4 14.32 13.65C14.15 13.89 13.67 14.47 13.52 14.64C13.38 14.8 13.23 14.82 12.98 14.7C12.73 14.58 11.93 14.31 10.98 13.47C10.24 12.81 9.74 12 9.59 11.75C9.45 11.5 9.58 11.37 9.7 11.24C9.81 11.13 9.95 10.95 10.07 10.81C10.19 10.66 10.24 10.56 10.32 10.39C10.4 10.23 10.36 10.08 10.3 9.96C10.24 9.84 9.75 8.63 9.54 8.14C9.34 7.65 9.14 7.72 8.99 7.71C8.85 7.7 8.69 7.7 8.52 7.7C8.36 7.7 8.09 7.76 7.86 8.01C7.64 8.25 7 8.85 7 10.07C7 11.29 7.89 12.46 8.01 12.63C8.13 12.79 9.75 15.3 12.24 16.37C12.83 16.63 13.29 16.78 13.65 16.9C14.25 17.09 14.79 17.06 15.22 17C15.7 16.93 16.7 16.39 16.91 15.81C17.12 15.22 17.12 14.72 17.05 14.61C16.99 14.49 16.82 14.45 16.57 14.33Z" />
    </svg>
  );
}

export default function FloatingContact({ generalSettings }: FloatingContactProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const whatsappNum = (generalSettings?.whatsapp || '442079460912').replace(/[^0-9]/g, '');
  const companyName = generalSettings?.companyName || 'FCC Global Education';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hello%20${encodeURIComponent(companyName)}%2C%20I%20would%20like%20to%20inquire%20about%20studying%20abroad.`;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Desktop WhatsApp Button with Modern Animations */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <div className="relative flex items-center justify-end">
          {/* Tooltip bubble on click or info */}
          {showTooltip && (
            <div className="absolute bottom-20 right-0 w-80 p-4 rounded-2xl glass-card-dark text-white border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Admissions Counselor Online</span>
                </div>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Close message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Have questions about university admissions, 100% scholarships, or visa rules? Connect instantly with our senior counselor.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Quick Hover Label Tag */}
          <div className="mr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hidden md:block">
            <span className="px-3 py-1.5 rounded-full bg-slate-900/95 text-white text-xs font-bold shadow-xl border border-slate-700/80 whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Chat on WhatsApp
            </span>
          </div>

          {/* Animated WhatsApp Floating Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-500/40 hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer"
            aria-label="Chat with counselor on WhatsApp"
            title="Chat with us on WhatsApp"
          >
            {/* Multi-layered Pulsing Radar Animations */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />
            <span className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-pulse pointer-events-none" />

            {/* Online Status Pill Badge with Ping Indicator */}
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white shadow-xs" />
            </span>

            {/* Authentic WhatsApp SVG Logo with micro hover rotation */}
            <WhatsAppIcon className="w-9 h-9 fill-white relative z-10 group-hover:rotate-12 group-hover:scale-105 transition-all duration-300 drop-shadow-md" />
          </a>
        </div>
      </div>

      {/* Sticky Mobile CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 p-2.5 px-4 flex items-center gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-colors flex-1"
        >
          <WhatsAppIcon className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/book-appointment"
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all flex-[2]"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Free Consultation</span>
        </Link>
      </div>
    </>
  );
}
