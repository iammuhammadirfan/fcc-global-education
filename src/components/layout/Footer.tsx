'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Send,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { countries as fallbackCountries } from '@/data/countries';
import { services as fallbackServices } from '@/data/services';

interface FooterProps {
  footerSettings?: any;
  generalSettings?: any;
  countries?: any[];
  services?: any[];
}

export default function Footer({ footerSettings, generalSettings, countries = fallbackCountries, services = fallbackServices }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  const companyDesc = footerSettings?.description || generalSettings?.shortDescription || 'Premier international education consultancy facilitating world-class admissions, scholarship strategy, and visa success across top-tier universities in the UK, USA, Canada, Australia, and Europe.';
  const displayAddress = generalSettings?.address || 'Level 4, 30 St Mary Axe, London EC3A 8EP, UK';
  const displayPhone = generalSettings?.phone || '+44 (0) 20 7946 0912';
  const displayEmail = generalSettings?.email || 'admissions@fccglobaleducation.com';
  const copyright = generalSettings?.copyrightText || `© ${new Date().getFullYear()} FCC Global Education Consultants Ltd. All Rights Reserved.`;
  const displayCountries = (countries && countries.length > 0 ? countries : fallbackCountries).slice(0, 8);

  const phoneHeading = generalSettings?.phoneHeading || 'Head Office Helpline';
  const europeHeading = generalSettings?.europeHeading || 'Europe Consultancy';
  const europePhone = generalSettings?.europePhone || displayPhone;
  const australiaHeading = generalSettings?.australiaHeading || 'Australia Consultancy';
  const australiaPhone = generalSettings?.australiaPhone || '+61 (0) 3 9000 1234';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/90 pt-16 pb-24 sm:pb-12 relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Consultation CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border border-slate-200 p-6 sm:p-10 mb-12 sm:mb-16 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Official University Representative
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get Insider Admissions Insights & Scholarship Alerts
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl">
                Join 25,000+ students receiving our monthly digest on university deadlines, visa policy shifts, and exclusive tuition waivers.
              </p>
            </div>
            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span>Thank you for subscribing! Your admissions starter guide is on its way.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 flex-shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-slate-200">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {generalSettings?.logoUrl && generalSettings.logoUrl.trim() !== '' && generalSettings.logoUrl !== '/logo.svg' ? (
                <div className="relative flex items-center shrink-0">
                  <img
                    src={generalSettings.logoUrl}
                    alt={generalSettings?.companyName || 'Brand Logo'}
                    className="h-9 sm:h-10 w-auto max-h-12 object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <GraduationCap className="w-6 h-6 text-slate-950" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  {generalSettings?.companyName ? (
                    generalSettings.companyName
                  ) : (
                    <>Aura<span className="text-amber-600">Global</span></>
                  )}
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
                  {generalSettings?.tagline || 'Education Consultants'}
                </span>
              </div>
            </Link>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              {companyDesc}
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{displayAddress}</span>
              </div>
              {/* Primary Head Office Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-800 block">{phoneHeading}:</span>
                  <a href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-700 font-semibold text-slate-700 block">
                    {displayPhone}
                  </a>
                </div>
              </div>
              {/* Europe Consultancy Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-800 block">{europeHeading}:</span>
                  <a href={`tel:${europePhone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-700 font-semibold text-slate-700 block">
                    {europePhone}
                  </a>
                </div>
              </div>
              {/* Australia Consultancy Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-800 block">{australiaHeading}:</span>
                  <a href={`tel:${australiaPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-700 font-semibold text-slate-700 block">
                    {australiaPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-0.5">
                <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`mailto:${displayEmail}`} className="hover:text-amber-700 font-medium">
                  {displayEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Destinations */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-cyan-600" />
              <span>Destinations</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {displayCountries.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/destinations/${c.slug}`}
                    className="text-slate-600 hover:text-amber-700 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>{c.flag}</span>
                    <span>Study in {c.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/destinations"
                  className="text-amber-700 hover:underline font-bold flex items-center gap-1"
                >
                  <span>View All 12 Countries</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Explore & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  About Our Leadership
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Admissions Consulting
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  University Directory
                </Link>
              </li>
              <li>
                <Link href="/visa-success" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Visa Success Strategy
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Student Reviews & Videos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Admissions FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Contact Counselor
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-amber-700 hover:text-amber-800 font-bold transition-colors flex items-center gap-1">
                  <span>HTML Sitemap & Directory</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Accreditations & Trust */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Accreditations
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-[11px]">British Council Certified</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Advanced Education Agent #BC-8921</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-[11px]">PIER Qualified Counselor</div>
                <div className="text-[10px] text-slate-500 mt-0.5">QEAC Certified #G1048</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-[11px]">ICEF Agency Status</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Audited Global Partner #IAS-4920</div>
              </div>
            </div>
          </div>
        </div>



        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span>{copyright}</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <a
              href="https://wa.me/923235502570?text=Hello%20MJDeveloper%2C%20I%20am%20contacting%20you%20regarding%20web%20development."
              target="_blank"
              rel="noopener noreferrer"
              title="Chat with MJDeveloper on WhatsApp (+92 323 5502570)"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-900 border border-emerald-200/90 transition-all font-semibold shadow-2xs group"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Developed by <strong className="font-bold text-emerald-700 underline decoration-emerald-400">MJDeveloper</strong></span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
            <Link href="/sitemap" className="hover:text-amber-700 font-semibold transition-colors">
              Site Map
            </Link>
            <Link href="/sitemap.xml" target="_blank" className="hover:text-amber-700 transition-colors font-mono">
              sitemap.xml
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-slate-900 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/admin" className="hover:text-amber-700 font-semibold transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.077-1.116-.062-.647-.216-1.571-.782-2.531-1.742-.96-.96-1.526-1.884-1.742-2.531-.139-.418-.107-.805-.062-1.116.05-.333.419-1.026.824-1.17.144-.051.299-.077.447-.077.108 0 .216.005.313.016.143.016.273.088.358.204.248.337.595 1.109.65 1.229.055.12.062.249-.009.38-.071.131-.144.204-.263.337l-.234.256c-.083.088-.172.18-.088.324.288.495.845 1.258 1.492 1.776.541.433.993.593 1.206.689.144.065.235.055.323-.044l.322-.387c.108-.13.242-.162.368-.113.126.049.914.431 1.072.509.158.078.263.118.301.183.038.065.038.375-.106.78z" />
    </svg>
  );
}
