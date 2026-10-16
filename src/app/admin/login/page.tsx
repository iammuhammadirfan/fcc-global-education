'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  GraduationCap,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState<string>('/uploads/FCC_Global_Education_Logo__1__1791173041145.png');
  const [logoFailed, setLogoFailed] = useState(false);
  const [companyName, setCompanyName] = useState<string>('FCC Global Education');

  // Fetch brand logo & company settings
  useEffect(() => {
    fetch('/api/admin/settings?type=general')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (data.general?.logoUrl && data.general.logoUrl.trim() !== '' && data.general.logoUrl !== '/logo.svg') {
          setLogoUrl(data.general.logoUrl);
        }
        if (data.general?.companyName) {
          setCompanyName(data.general.companyName);
        }
      })
      .catch(() => {});
  }, []);

  // Check if redirected due to inactivity
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reason') === 'inactivity') {
        setInfoMessage(
          'Your administrative session has timed out due to 5 minutes of inactivity for security reasons. Please re-authenticate to continue. (Screen will automatically reload if login is not completed).'
        );

        // Auto reload screen if not logged in
        const reloadTimer = setTimeout(() => {
          window.location.reload();
        }, 5 * 60 * 1000);

        return () => clearTimeout(reloadTimer);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Access denied.');
        setLoading(false);
        return;
      }

      // Mark tab session active so closing the tab automatically terminates session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_tab_session', 'active');
      }

      // Successful login -> Navigate to Admin Dashboard
      router.replace('/admin');
    } catch {
      setError('A network error occurred. Please verify your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none bg-[#F5F8FC]">
      {/* Soft Academic Gradient background layers - visibly rich dual-tone matching reference */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 8% 22%, rgba(253, 230, 138, 0.85) 0%, rgba(254, 243, 199, 0.65) 25%, transparent 55%),
            radial-gradient(circle at 92% 22%, rgba(186, 230, 253, 0.9) 0%, rgba(199, 210, 254, 0.6) 28%, transparent 55%),
            radial-gradient(circle at 12% 85%, rgba(254, 240, 138, 0.6) 0%, rgba(254, 243, 199, 0.3) 30%, transparent 50%),
            radial-gradient(circle at 88% 85%, rgba(191, 219, 254, 0.7) 0%, rgba(224, 231, 255, 0.4) 30%, transparent 50%),
            linear-gradient(135deg, #FEF9EE 0%, #F8FAFC 50%, #EDF5FF 100%)
          `,
        }}
      />

      <div className="w-full max-w-md space-y-5 relative z-10">
        {/* Brand Header with Main Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            {!logoFailed && logoUrl ? (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center justify-center max-w-[260px] hover:shadow-lg transition">
                <img
                  src={logoUrl}
                  alt={companyName}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback1) {
                      target.dataset.fallback1 = 'true';
                      target.src = '/uploads/FCC_Global_Education_Logo__1__1791173041145.png';
                    } else if (!target.dataset.fallback2) {
                      target.dataset.fallback2 = 'true';
                      target.src = '/uploads/FCC_Global_Education_Logo__1__1791178438060.png';
                    } else if (!target.dataset.fallback3) {
                      target.dataset.fallback3 = 'true';
                      target.src = '/logo.png';
                    } else {
                      setLogoFailed(true);
                    }
                  }}
                  className="h-10 sm:h-12 w-auto max-h-14 object-contain"
                />
              </div>
            ) : (
              <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20">
                <GraduationCap className="w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              FCC Global Education <span className="text-amber-600">Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center justify-center gap-1.5 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Secure Administrative Management Console
            </p>
          </div>
        </div>

        {/* Security Assurance Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-white/95 border border-slate-200/90 text-[11px] text-slate-600 flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            256-Bit Encrypted Session
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Protected
          </span>
        </div>

        {/* Login Form Card */}
        <div className="rounded-[1.8rem] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xl shadow-slate-200/60">
          {infoMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span className="font-medium leading-relaxed">{infoMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F0F5FA] border border-[#DCE7F2] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email.trim() || '');
                    setForgotError('');
                    setForgotSuccess(false);
                    setForgotModal(true);
                  }}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F0F5FA] border border-[#DCE7F2] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:brightness-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-amber-600 font-semibold transition-colors inline-flex items-center gap-1.5">
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Interactive Modal */}
      {forgotModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setForgotModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl relative text-slate-900">
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Reset Admin Password</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Enter your administrator email address. We will email you a secure link to reset your credentials.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">Reset Email Dispatched!</h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-1">
                      A password reset link has been dispatched to <strong className="text-slate-900">{forgotEmail}</strong>. Please check your inbox and spam folder.
                    </p>
                    {devResetUrl && (
                      <div className="pt-2.5 mt-2 border-t border-emerald-200">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                          Local Reset Link:
                        </span>
                        <Link
                          href={devResetUrl}
                          className="text-xs text-amber-700 hover:text-amber-800 underline font-semibold flex items-center gap-1 mt-1 break-all"
                        >
                          <span>Open Password Reset Page</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!forgotEmail.trim()) {
                    setForgotError('Please enter your email address.');
                    return;
                  }
                  setForgotLoading(true);
                  setForgotError('');
                  try {
                    const res = await fetch('/api/auth/forgot-password', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail.trim() }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setForgotSuccess(true);
                      if (data.resetUrl) {
                        setDevResetUrl(data.resetUrl);
                      }
                    } else {
                      setForgotError(data.error || 'Failed to dispatch reset email.');
                    }
                  } catch {
                    setForgotError('Connection error. Please try again.');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="space-y-3.5"
              >
                {forgotError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Administrator Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
