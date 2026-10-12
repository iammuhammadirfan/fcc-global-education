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
  Clock
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              FCC Global Education <span className="text-amber-400">Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Secure Administrative Management Console
            </p>
          </div>
        </div>

        {/* Security Assurance Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shadow-inner backdrop-blur-sm">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            256-Bit Encrypted Session
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Protected
          </span>
        </div>

        {/* Login Form Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-7 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {infoMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <span className="font-medium leading-relaxed">{infoMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                  placeholder="name@fccglobaleducation.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
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
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 active:brightness-95 disabled:opacity-50 transition-all cursor-pointer"
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

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reset Admin Credentials</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                For administrative security, credentials can only be reset by a designated Super Administrator from <strong>Admin Panel → Users & Roles</strong> or through server configuration.
              </p>
            </div>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
