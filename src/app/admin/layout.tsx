'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Globe,
  Building,
  Briefcase,
  Award,
  Video,
  FileText,
  HelpCircle,
  FolderOpen,
  Compass,
  LayoutTemplate,
  Sliders,
  LogOut,
  Menu,
  X,
  Search,
  ExternalLink,
  Shield,
  Bell,
  CheckCircle2,
  FileCheck,
  Share2,
  GraduationCap,
  ShieldCheck,
  Star,
  Info,
  Mail,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navSections = [
  {
    title: 'Core CRM',
    links: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Leads & Inquiries', href: '/admin/leads', icon: Users, badge: 'CRM' },
      { label: 'Appointments', href: '/admin/appointments', icon: Calendar, badge: 'Live' },
      { label: 'Audience & Broadcast', href: '/admin/broadcast', icon: Mail, badge: 'Email' },
      { label: 'AI Counselor Bot', href: '/admin/ai-bot', icon: Sparkles, badge: 'Groq AI' },
    ],
  },
  {
    title: 'Destinations & Academics',
    links: [
      { label: 'Countries CMS', href: '/admin/countries', icon: Globe },
      { label: 'Universities CMS', href: '/admin/universities', icon: Building },
      { label: 'Services CMS', href: '/admin/services', icon: Briefcase },
    ],
  },
  {
    title: 'Media & Social Proof',
    links: [
      { label: 'Student Reviews', href: '/admin/reviews', icon: Star, badge: 'Reviews' },
      { label: 'Visa Success Proofs', href: '/admin/visa-success', icon: ShieldCheck, badge: 'Proofs' },
      { label: 'Student Videos', href: '/admin/videos', icon: Video, badge: 'Videos' },
      { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
    ],
  },
  {
    title: 'Content & Publishing',
    links: [
      { label: 'About Page CMS', href: '/admin/about', icon: Info, badge: 'Full Page' },
      { label: 'Team Counselors', href: '/admin/team', icon: Users },
      { label: 'FAQs CMS', href: '/admin/faqs', icon: HelpCircle },
      { label: 'Custom & Legal Pages', href: '/admin/pages', icon: FileCheck },
    ],
  },
  {
    title: 'Site Customizer',
    links: [
      { label: 'Homepage Sections', href: '/admin/homepage', icon: LayoutTemplate },
      { label: 'Navigation Menu', href: '/admin/navigation', icon: Compass },
      { label: 'Footer Settings', href: '/admin/footer', icon: Share2 },
      { label: 'SEO Management', href: '/admin/seo', icon: Search },
      { label: 'Global Settings', href: '/admin/settings', icon: Sliders },
      { label: 'Admin Users & Roles', href: '/admin/users', icon: Shield },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(isLoginPage);
  const [user, setUser] = useState<{ name: string; email: string; role: string }>({
    name: 'Admin',
    email: 'admin@fccglobaleducation.com',
    role: 'Super Admin',
  });

  // Global search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }

    // Check if the current browser tab still has an active session
    if (typeof window !== 'undefined') {
      const isTabSessionActive = sessionStorage.getItem('admin_tab_session');
      if (!isTabSessionActive) {
        // Tab was closed or opened fresh -> force server logout and redirect to login
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
          router.replace('/admin/login');
        });
        return;
      }
    }

    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          if (typeof window !== 'undefined') sessionStorage.removeItem('admin_tab_session');
          router.replace('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
          setAuthChecked(true);
        } else {
          if (typeof window !== 'undefined') sessionStorage.removeItem('admin_tab_session');
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') sessionStorage.removeItem('admin_tab_session');
        router.replace('/admin/login');
      });

    fetch('/api/admin/settings?type=general')
      .then((r) => r.json())
      .then((d) => {
        if (d?.general) setGeneralSettings(d.general);
        else if (d?.settings?.general) setGeneralSettings(d.settings.general);
      })
      .catch(() => {});
  }, [isLoginPage, router]);

  // Handle global search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setSearchResults(d.results || []);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 5-Minute Inactivity Auto-Logout Tracker (Mouse / Keyboard / Scroll / Click)
  useEffect(() => {
    if (isLoginPage || !authChecked) return;

    let inactivityTimeout: NodeJS.Timeout;
    const INACTIVITY_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

    const performInactivityLogout = async () => {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_tab_session');
        }
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // ignore
      }
      router.replace('/admin/login?reason=inactivity');
    };

    const resetTimer = () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(performInactivityLogout, INACTIVITY_LIMIT_MS);
    };

    // Start initial timer
    resetTimer();

    // Throttled activity listener to prevent excessive resets
    let lastRecordedActivity = Date.now();
    const onUserActivity = () => {
      const now = Date.now();
      if (now - lastRecordedActivity > 1000) {
        lastRecordedActivity = now;
        resetTimer();
      }
    };

    const trackedEvents = ['mousemove', 'keydown', 'click'];
    trackedEvents.forEach((event) => {
      window.addEventListener(event, onUserActivity, { passive: true });
    });

    return () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      trackedEvents.forEach((event) => {
        window.removeEventListener(event, onUserActivity);
      });
    };
  }, [isLoginPage, authChecked, router]);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_tab_session');
      }
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Verifying Security Session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden admin-shell bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white admin-header border-b border-slate-200 z-30 sticky top-0 shadow-xs">
        <div className="flex items-center gap-2">
          {generalSettings?.logoUrl && generalSettings.logoUrl !== '/logo.svg' ? (
            <img src={generalSettings.logoUrl} alt="Logo" className="h-7 w-auto object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
              AG
            </div>
          )}
          <span className="font-bold text-slate-900 tracking-tight text-sm">
            {generalSettings?.companyName || 'FCC Global Education'} <span className="text-amber-600">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* SaaS Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white admin-sidebar border-r border-slate-200 flex flex-col justify-between z-40 transition-transform duration-300 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5 max-w-[190px]">
              {generalSettings?.logoUrl && generalSettings.logoUrl !== '/logo.svg' ? (
                <img
                  src={generalSettings.logoUrl}
                  alt={generalSettings?.companyName || 'Logo'}
                  className="h-8 max-w-[42px] object-contain shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
                  <GraduationCap className="w-5 h-5 text-slate-950" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 tracking-tight truncate flex items-center gap-1">
                  {generalSettings?.companyName ? (
                    generalSettings.companyName
                  ) : (
                    <>FCC<span className="text-amber-600">CMS</span></>
                  )}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase truncate">
                  Admin Workspace
                </span>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              title="Open public website in new tab"
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav List */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {sec.title}
                </div>
                {sec.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      onClick={() => {
                        if (sidebarOpen) setSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span className="truncate">{link.label}</span>
                      </div>
                      {link.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isActive
                              ? 'bg-slate-950 text-amber-400'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User footer & logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-amber-700 font-semibold uppercase truncate tracking-wider">
                  {user?.role?.replace('_', ' ') || 'Super Admin'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 md:h-screen md:overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 admin-header bg-white/95 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 backdrop-blur-md shadow-xs">
          {/* Quick search button */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors w-48 sm:w-72"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="truncate">Search leads, countries, universities...</span>
              <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all shadow-xs"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/admin/leads"
              className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </Link>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-600" />
              <input
                type="text"
                autoFocus
                placeholder="Search across all CMS data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 font-medium"
              >
                ESC
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  {searchQuery ? 'No matching records found' : 'Type to search across leads, appointments, countries, universities, and blogs.'}
                </div>
              ) : (
                searchResults.map((item, i) => (
                  <Link
                    key={i}
                    href={item.url}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          {item.type}
                        </span>
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold">Open →</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
