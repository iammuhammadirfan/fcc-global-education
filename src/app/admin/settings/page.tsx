'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Save, RefreshCw, CheckCircle2, Building, 
  Share2, Calendar, Mail, Database, Download,
  Upload, Image as ImageIcon, Trash2, Navigation, Eye, EyeOff, Sparkles, ExternalLink,
  Send, AlertCircle, Key, Server, Shield, Check, HelpCircle, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { GeneralSettings, SocialLinks, EmailSettings, AppointmentSettings, NavigationConfig, AiChatSettings } from '@/lib/types';
import { DEFAULT_AI_CHAT_SETTINGS } from '@/lib/ai-constants';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'navigation' | 'appointments' | 'social' | 'email' | 'backup' | 'ai-bot'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // States
  const [general, setGeneral] = useState<GeneralSettings | null>(null);
  const [navigation, setNavigation] = useState<NavigationConfig | null>(null);
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [appointments, setAppointments] = useState<AppointmentSettings | null>(null);
  const [email, setEmail] = useState<EmailSettings | null>(null);

  // Email SMTP Testing & GoDaddy Setup States
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; error?: string } | null>(null);
  const [showGodaddyGuide, setShowGodaddyGuide] = useState(true);

  // AI Chatbot & Groq API States
  const [aiBot, setAiBot] = useState<AiChatSettings>(DEFAULT_AI_CHAT_SETTINGS);
  const [showGroqKeyInSettings, setShowGroqKeyInSettings] = useState(false);
  const [testingGroqInSettings, setTestingGroqInSettings] = useState(false);
  const [groqTestResultInSettings, setGroqTestResultInSettings] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    reply?: string;
  } | null>(null);
  const [newQuestionInSettings, setNewQuestionInSettings] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings?type=all');
      const data = await res.json();
      if (data.success || data.settings) {
        const generalData = data.general || data.settings?.general;
        const navData = data.navigation || data.settings?.navigation;
        const socialData = data.social || data.settings?.social;
        const appointmentsData = data.appointments || data.settings?.appointments;
        const emailData = data.email || data.settings?.email;

        if (generalData) setGeneral(generalData);
        if (navData) setNavigation(navData);
        if (socialData) setSocial(socialData);
        if (appointmentsData) setAppointments(appointmentsData);
        if (emailData) {
          const preparedEmail = {
            ...emailData,
            smtpUser: emailData.smtpUser || '',
            smtpPass: emailData.smtpPass || '',
            replyToEmail: emailData.replyToEmail || emailData.senderEmail || '',
            adminNotificationEmail: emailData.adminNotificationEmail || emailData.senderEmail || '',
          };
          setEmail(preparedEmail);
          setTestEmailAddress(preparedEmail.adminNotificationEmail || preparedEmail.senderEmail || '');
        }

        // Fetch AI Chatbot settings
        try {
          const aiRes = await fetch('/api/admin/ai-bot');
          const aiData = await aiRes.json();
          if (aiData.success && aiData.settings) {
            setAiBot(aiData.settings);
          }
        } catch (e) {
          console.warn('[AI Bot Fetch Warning]:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      let payload: any = {};
      if (activeTab === 'general' && general) {
        payload = { type: 'general', general };
      } else if (activeTab === 'navigation' && navigation) {
        payload = { type: 'navigation', navigation };
      } else if (activeTab === 'social' && social) {
        payload = { type: 'social', social };
      } else if (activeTab === 'appointments' && appointments) {
        payload = { type: 'appointments', appointments };
      } else if (activeTab === 'email' && email) {
        payload = { type: 'email', email };
      } else if (activeTab === 'ai-bot' && aiBot) {
        payload = { section: 'ai_chat', type: 'ai_chat', data: aiBot };
        await fetch('/api/admin/ai-bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_settings', settings: aiBot })
        });
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // 1-Click GoDaddy Presets Helper
  const applyPreset = (preset: 'godaddy_cpanel' | 'godaddy_secureserver' | 'godaddy_m365' | 'gmail') => {
    if (!email) return;
    const domainMatch = email.senderEmail?.includes('@') ? email.senderEmail.split('@')[1] : 'yourdomain.com';

    if (preset === 'godaddy_cpanel') {
      setEmail({
        ...email,
        smtpHost: `mail.${domainMatch}`,
        smtpPort: 465,
        smtpUser: email.smtpUser || email.senderEmail || `admissions@${domainMatch}`,
      });
    } else if (preset === 'godaddy_secureserver') {
      setEmail({
        ...email,
        smtpHost: 'smtpout.secureserver.net',
        smtpPort: 465,
        smtpUser: email.smtpUser || email.senderEmail || `admissions@${domainMatch}`,
      });
    } else if (preset === 'godaddy_m365') {
      setEmail({
        ...email,
        smtpHost: 'smtp.office365.com',
        smtpPort: 587,
        smtpUser: email.smtpUser || email.senderEmail || `admissions@${domainMatch}`,
      });
    } else if (preset === 'gmail') {
      setEmail({
        ...email,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
      });
    }
  };

  // Test Groq Key Handler in Settings
  const handleTestGroqInSettings = async () => {
    if (!aiBot.groqApiKey?.trim()) {
      alert('Please enter your Groq API Key first (starts with "gsk_...").');
      return;
    }
    setTestingGroqInSettings(true);
    setGroqTestResultInSettings(null);
    try {
      const res = await fetch('/api/admin/ai-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_groq',
          groqApiKey: aiBot.groqApiKey,
          model: aiBot.model,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.model && data.model !== aiBot.model) {
          setAiBot((prev) => ({ ...prev, model: data.model }));
        }
        setGroqTestResultInSettings({
          success: true,
          message: data.message || 'Groq API connection validated successfully!',
          latencyMs: data.latencyMs,
          reply: data.reply,
        });
      } else {
        setGroqTestResultInSettings({
          success: false,
          message: data.error || 'Groq API authentication failed. Please check the API key.',
        });
      }
    } catch (err: any) {
      setGroqTestResultInSettings({
        success: false,
        message: err?.message || 'Network error while contacting Groq.',
      });
    } finally {
      setTestingGroqInSettings(false);
    }
  };

  const handleTestEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      alert('Please enter a valid recipient email address for testing.');
      return;
    }
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: testEmailAddress,
          settings: email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message: data.message || `Test email successfully dispatched to ${testEmailAddress}!`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to dispatch test email. Please check your credentials.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Network error occurred while testing SMTP connection.',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !general) return;

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.media?.url) {
        // Update both logo and faviconUrl if faviconUrl is empty
        const updated = {
          ...general,
          logoUrl: data.media.url,
          faviconUrl: general.faviconUrl || data.media.url,
        };
        setGeneral(updated);
        // auto save general settings
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'general', general: updated })
        });
      } else {
        alert(data.error || 'Failed to upload logo');
      }
    } catch (err) {
      console.error(err);
      alert('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !general) return;

    try {
      setUploadingFavicon(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.media?.url) {
        const updated = { ...general, faviconUrl: data.media.url };
        setGeneral(updated);
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'general', general: updated })
        });
      } else {
        alert(data.error || 'Failed to upload tab icon');
      }
    } catch (err) {
      console.error(err);
      alert('Icon upload failed');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleToggleNavItem = async (index: number) => {
    if (!navigation || !navigation.items) return;
    const newItems = [...navigation.items];
    const current = newItems[index];
    newItems[index] = {
      ...current,
      enabled: current.enabled === false ? true : false,
    };
    const updated = { ...navigation, items: newItems };
    setNavigation(updated);

    try {
      await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = async (type: 'leads' | 'appointments') => {
    try {
      const res = await fetch(`/api/admin/backup?export=${type}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fccglobal-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportJSON = async () => {
    try {
      const res = await fetch('/api/admin/backup?export=json');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fccglobal-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !general || !social || !appointments || !email) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
        <p className="font-semibold text-sm">Loading Platform Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-600" />
            Global Platform & Brand Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company brand details, browser tab icon, header navigation pages, booking availability, and email settings.
          </p>
        </div>
        {activeTab !== 'backup' && (
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:brightness-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings updated successfully! Changes reflect across the website immediately.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'general', label: 'Company Profile & Logo', icon: Building },
          { id: 'navigation', label: 'Header Pages (ON / OFF)', icon: Navigation },
          { id: 'appointments', label: 'Booking & Calendar', icon: Calendar },
          { id: 'social', label: 'Social Channels', icon: Share2 },
          { id: 'email', label: 'Email & SMTP', icon: Mail },
          { id: 'ai-bot', label: 'AI Chatbot (Groq API)', icon: Sparkles },
          { id: 'backup', label: 'Data & Backup', icon: Database },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL & LOGO & FAVICON */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Logo & Tab Icon Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  Website Logo & Browser Tab Icon (Favicon)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload your brand logo and favicon to display across the Header navbar, browser tabs, and footer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Logo */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800">Primary Brand Logo</div>
                <div className="h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-3 overflow-hidden">
                  {general.logoUrl && general.logoUrl.trim() !== '' && general.logoUrl !== '/logo.svg' ? (
                    <img
                      src={general.logoUrl}
                      alt="Brand Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-slate-500 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      <span>Default Brand Logo</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                    <input
                      type="file"
                      accept="image/*,.svg"
                      className="hidden"
                      disabled={uploadingLogo}
                      onChange={handleLogoUpload}
                    />
                  </label>
                  {general.logoUrl && general.logoUrl !== '/logo.svg' && (
                    <button
                      type="button"
                      onClick={() => setGeneral({ ...general, logoUrl: '/logo.svg' })}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Browser Tab Icon (Favicon) */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800">Browser Tab Icon (Favicon)</div>
                <div className="h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-3 overflow-hidden">
                  {general.faviconUrl || general.logoUrl ? (
                    <div className="flex items-center gap-3 bg-slate-200/80 px-4 py-2 rounded-lg border border-slate-300">
                      <img
                        src={general.faviconUrl || general.logoUrl}
                        alt="Tab Icon Preview"
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">
                        {general.companyName || 'FCC Global Education'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      <span>Default Tab Icon</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{uploadingFavicon ? 'Uploading...' : 'Custom Favicon'}</span>
                    <input
                      type="file"
                      accept="image/*,.ico,.svg"
                      className="hidden"
                      disabled={uploadingFavicon}
                      onChange={handleFaviconUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setGeneral({ ...general, faviconUrl: general.logoUrl || '' })}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition"
                  >
                    Sync With Logo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">
            Company & Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Consultancy Name</label>
              <input
                type="text"
                value={general.companyName}
                onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Tagline / Subtitle</label>
              <input
                type="text"
                value={general.tagline || ''}
                onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                placeholder="World-Class Study Abroad Counseling"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Primary Phone Number</label>
              <input
                type="text"
                value={general.phone}
                onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">WhatsApp Number</label>
              <input
                type="text"
                value={general.whatsapp}
                onChange={(e) => setGeneral({ ...general, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Official Email</label>
              <input
                type="email"
                value={general.email}
                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Office Working Hours</label>
              <input
                type="text"
                value={general.officeHours}
                onChange={(e) => setGeneral({ ...general, officeHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <label className="block text-slate-700 font-bold">Headquarters Address</label>
            <input
              type="text"
              value={general.address}
              onChange={(e) => setGeneral({ ...general, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>
        </form>
      )}

      {/* TAB 2: HEADER NAVIGATION PAGES ON / OFF */}
      {activeTab === 'navigation' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-600" />
                Header Menu Pages Visibility Controls
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle any page ON or OFF to control whether it appears in the public website header.
              </p>
            </div>
            <Link
              href="/admin/navigation"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
            >
              <span>Full Navigation CMS</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>

          {navigation?.items && navigation.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {navigation.items.map((item: any, idx: number) => {
                const isEnabled = item.enabled !== false;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isEnabled
                        ? 'bg-white border-emerald-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold border border-amber-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{item.href}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleNavItem(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                        isEnabled
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>ON</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                          <span>OFF</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p>No navigation items found. Open the Full Navigation CMS to load defaults.</p>
              <Link href="/admin/navigation" className="mt-2 inline-block text-amber-600 font-bold hover:underline">
                Go to Navigation CMS →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Consultation Slots & Calendar Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Session Duration (minutes)</label>
              <input
                type="number"
                value={appointments.slotDurationMinutes}
                onChange={(e) => setAppointments({ ...appointments, slotDurationMinutes: parseInt(e.target.value) || 30 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Working Hours Start</label>
              <input
                type="text"
                value={appointments.workingHoursStart}
                onChange={(e) => setAppointments({ ...appointments, workingHoursStart: e.target.value })}
                placeholder="10:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Working Hours End</label>
              <input
                type="text"
                value={appointments.workingHoursEnd}
                onChange={(e) => setAppointments({ ...appointments, workingHoursEnd: e.target.value })}
                placeholder="06:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <label className="block text-slate-700 font-bold">Consultation Options (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(appointments.consultationTypes) ? appointments.consultationTypes.join(', ') : ''}
              onChange={(e) => setAppointments({ ...appointments, consultationTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>

          <div className="text-xs space-y-1.5">
            <label className="block text-slate-700 font-bold">Default Meeting Link (Google Meet / Zoom)</label>
            <input
              type="text"
              value={appointments.defaultMeetingLink}
              onChange={(e) => setAppointments({ ...appointments, defaultMeetingLink: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
            />
          </div>
        </form>
      )}

      {/* TAB 4: SOCIAL */}
      {activeTab === 'social' && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Social Media Profile Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.keys(social).map((network) => (
              <div key={network}>
                <label className="block text-slate-700 mb-1.5 font-bold capitalize">{network}</label>
                <input
                  type="text"
                  value={(social as any)[network] || ''}
                  onChange={(e) => setSocial({ ...social, [network]: e.target.value })}
                  placeholder={`https://${network}.com/...`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                />
              </div>
            ))}
          </div>
        </form>
      )}

      {/* TAB 5: EMAIL & GODADDY SETUP & TEST EMAIL */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          {/* Quick Setup Presets Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-300/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    GoDaddy & Custom Domain Email 1-Click Presets
                  </h3>
                  <p className="text-xs text-slate-600">
                    Click any preset below to auto-fill the recommended host and port for your provider:
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGodaddyGuide(!showGodaddyGuide)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>GoDaddy Setup Guide</span>
                {showGodaddyGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => applyPreset('godaddy_cpanel')}
                className="p-3 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-700">
                  <span>GoDaddy cPanel</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                    Port 465 SSL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  mail.yourdomain.com
                </p>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('godaddy_secureserver')}
                className="p-3 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-700">
                  <span>GoDaddy Secureserver</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">
                    Port 465 SSL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  smtpout.secureserver.net
                </p>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('godaddy_m365')}
                className="p-3 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-700">
                  <span>GoDaddy MS 365</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded">
                    Port 587 TLS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  smtp.office365.com
                </p>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('gmail')}
                className="p-3 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-700">
                  <span>Gmail / Workspace</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                    Port 465 SSL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  smtp.gmail.com
                </p>
              </button>
            </div>

            {/* GoDaddy Step-by-Step Guide Accordion Content */}
            {showGodaddyGuide && (
              <div className="mt-3 p-4 rounded-xl bg-white/90 border border-amber-200 text-xs text-slate-700 space-y-2.5 animate-in fade-in duration-150">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>GoDaddy Hosting se Custom Email setup karne ke Asaan Steps:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed text-slate-600">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-extrabold text-amber-700">1. GoDaddy me Email Create Karein:</span>
                    <p className="mt-0.5">
                      GoDaddy cPanel me login karein ➔ <strong>Email Accounts</strong> me jayein ➔ <strong>+ Create</strong> par click karein (e.g. <code className="bg-amber-100 px-1 rounded text-slate-900 font-mono">admissions@yourdomain.com</code>) aur strong password set karein.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-extrabold text-amber-700">2. Outgoing Server Details:</span>
                    <p className="mt-0.5">
                      SMTP Host me <code className="bg-amber-100 px-1 rounded text-slate-900 font-mono">mail.yourdomain.com</code> ya <code className="bg-amber-100 px-1 rounded text-slate-900 font-mono">smtpout.secureserver.net</code> likhein. Port <code className="bg-amber-100 px-1 rounded text-slate-900 font-mono">465</code> (SSL) behtareen rehta hai.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-extrabold text-amber-700">3. Username & Password Enter Karein:</span>
                    <p className="mt-0.5">
                      <strong>SMTP Username</strong> me apna complete email address dalein aur <strong>SMTP Password</strong> me wahi password dalein jo aapne GoDaddy me banaya tha.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-extrabold text-amber-700">4. Save karein aur Test Email bhejein:</span>
                    <p className="mt-0.5">
                      Neechay <strong>Save Settings</strong> par click karein aur phir <strong>Send Test Email</strong> section me apna personal email daal kar verify karein ke email deliver ho rahi hai!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main SMTP Configuration Form */}
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-600" />
                  <span>Sender & SMTP Server Credentials</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure your outgoing mail authentication details for lead alerts, confirmations, and mass broadcasts.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Sender Name */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Sender Display Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={email.senderName || ''}
                  onChange={(e) => setEmail({ ...email, senderName: e.target.value })}
                  placeholder="e.g. FCC Global Education Admissions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Recipients will see this name in their inbox.</p>
              </div>

              {/* Sender Email */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Sender Email Address <span className="text-amber-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email.senderEmail || ''}
                  onChange={(e) => setEmail({ ...email, senderEmail: e.target.value })}
                  placeholder="admissions@yourdomain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Official "From" address (must match your domain).</p>
              </div>

              {/* SMTP Host */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  SMTP Server Host <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={email.smtpHost || ''}
                  onChange={(e) => setEmail({ ...email, smtpHost: e.target.value })}
                  placeholder="e.g. mail.yourdomain.com or smtpout.secureserver.net"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-mono font-medium focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Outgoing mail server address.</p>
              </div>

              {/* SMTP Port */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold flex items-center justify-between">
                  <span>SMTP Port <span className="text-amber-600">*</span></span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {Number(email.smtpPort) === 465 ? 'SSL (Secure)' : 'TLS / STARTTLS'}
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={email.smtpPort || 465}
                    onChange={(e) => setEmail({ ...email, smtpPort: parseInt(e.target.value) || 465 })}
                    placeholder="465 or 587"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-mono font-medium focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setEmail({ ...email, smtpPort: 465 })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                      Number(email.smtpPort) === 465
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    465 (SSL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail({ ...email, smtpPort: 587 })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                      Number(email.smtpPort) === 587
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    587 (TLS)
                  </button>
                </div>
              </div>

              {/* SMTP Username */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  SMTP Username / Email <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={email.smtpUser || ''}
                  onChange={(e) => setEmail({ ...email, smtpUser: e.target.value })}
                  placeholder="admissions@yourdomain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Full email address created in GoDaddy / cPanel.</p>
              </div>

              {/* SMTP Password */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  SMTP Password <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSmtpPassword ? 'text' : 'password'}
                    required
                    value={email.smtpPass || ''}
                    onChange={(e) => setEmail({ ...email, smtpPass: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-mono font-medium focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showSmtpPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">The email account password set in your hosting.</p>
              </div>

              {/* Reply-To Email */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Reply-To Email Address
                </label>
                <input
                  type="email"
                  value={email.replyToEmail || ''}
                  onChange={(e) => setEmail({ ...email, replyToEmail: e.target.value })}
                  placeholder="support@yourdomain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Where student replies will be directed.</p>
              </div>

              {/* Admin Notification Recipient */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Admin Notification Recipient Email <span className="text-amber-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email.adminNotificationEmail || ''}
                  onChange={(e) => setEmail({ ...email, adminNotificationEmail: e.target.value })}
                  placeholder="admin@yourdomain.com or your-personal@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Where admin alerts for new leads & bookings will arrive.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save SMTP Settings'}</span>
              </button>
            </div>
          </form>

          {/* Dedicated Section: LIVE SEND TEST EMAIL */}
          <div className="bg-white border-2 border-slate-900/10 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Live Test Email Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test your GoDaddy SMTP connection and verify live email delivery into an actual inbox.
                  </p>
                </div>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
                Live Dispatch
              </span>
            </div>

            <form onSubmit={handleTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recipient Email Address for Test:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="e.g. your-personal@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={testingEmail}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer min-w-[190px]"
                  >
                    {testingEmail ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying & Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Test Email Now</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Enter any active email address (e.g. your personal Gmail/Yahoo) to receive the test verification email.
                </p>
              </div>

              {/* Real-time Test Result Alert */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl border text-xs animate-in fade-in duration-200 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold">
                        {testResult.success
                          ? 'SMTP Authentication & Delivery Succeeded!'
                          : 'SMTP Connection / Authentication Failed:'}
                      </div>
                      <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                        {testResult.message}
                      </p>
                      {!testResult.success && (
                        <div className="pt-2 text-[11px] text-slate-600 space-y-1 border-t border-rose-200/80 mt-2">
                          <p className="font-bold text-rose-800">Troubleshooting Tips for GoDaddy:</p>
                          <p>• Verify that the email account exists in GoDaddy cPanel Email Accounts.</p>
                          <p>• Check if the password entered matches your GoDaddy email password.</p>
                          <p>• If using Port 465 (SSL), try switching to Host <code className="bg-rose-100 px-1 rounded font-mono">mail.yourdomain.com</code> or <code className="bg-rose-100 px-1 rounded font-mono">smtpout.secureserver.net</code>.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: BACKUP & DATA */}
      {activeTab === 'backup' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              Database Backups & Data Export
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Download your complete database snapshot or export spreadsheets of leads and appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="font-bold text-slate-900 text-xs">Full Database Dump</div>
              <p className="text-[11px] text-slate-500">Complete JSON backup of all tables, pages, users, settings, and CRM records.</p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON Backup
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="font-bold text-slate-900 text-xs">Student Leads CSV</div>
              <p className="text-[11px] text-slate-500">Export student leads, contact info, destination countries, and notes.</p>
              <button
                onClick={() => handleExportCSV('leads')}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export Leads (.csv)
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="font-bold text-slate-900 text-xs">Appointments CSV</div>
              <p className="text-[11px] text-slate-500">Export consultation bookings, meeting timings, and student details.</p>
              <button
                onClick={() => handleExportCSV('appointments')}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export Appointments (.csv)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AI CHATBOT (GROQ API) IN GLOBAL SETTINGS */}
      {activeTab === 'ai-bot' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-300/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  AI Admissions Counselor & Groq API Integration
                </h3>
                <p className="text-xs text-slate-600">
                  Manage the 24/7 AI chatbot on your website, enter your free Groq API key, and test answers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/ai-bot"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Open Full AI Sandbox</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Free Groq API Key & Model Setup
                </h2>
              </div>

              {/* Master Live Switch */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Chatbot on Website:</span>
                <input
                  type="checkbox"
                  checked={aiBot.enabled}
                  onChange={(e) => setAiBot({ ...aiBot, enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
                <span className={`text-[11px] font-extrabold ${aiBot.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {aiBot.enabled ? 'Active (ON)' : 'Disabled (OFF)'}
                </span>
              </label>
            </div>

            <div className="space-y-4 text-xs">
              {/* Groq API Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-bold">
                    Groq API Key <span className="text-amber-600">*</span>
                  </label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline inline-flex items-center gap-1"
                  >
                    <span>Get Free API Key at console.groq.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showGroqKeyInSettings ? 'text' : 'password'}
                    value={aiBot.groqApiKey || ''}
                    onChange={(e) => setAiBot({ ...aiBot, groqApiKey: e.target.value })}
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKeyInSettings(!showGroqKeyInSettings)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showGroqKeyInSettings ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter your free Groq API key here. Agar khali chhorein to bot local database knowledge engine se answers deta rahega.
                </p>
              </div>

              {/* Model & Test */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">AI Model</label>
                  <select
                    value={aiBot.model || 'llama-3.1-8b-instant'}
                    onChange={(e) => setAiBot({ ...aiBot, model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                  >
                    <option value="llama-3.1-8b-instant">
                      Llama 3.1 8B Instant (Recommended - 100% Free & Ultra Fast)
                    </option>
                    <option value="llama-3.3-70b-versatile">
                      Llama 3.3 70B Versatile (Meta 70B)
                    </option>
                    <option value="llama-3.1-70b-versatile">
                      Llama 3.1 70B Versatile
                    </option>
                    <option value="llama3-70b-8192">
                      Llama 3 70B (8192 Context)
                    </option>
                    <option value="llama3-8b-8192">
                      Llama 3 8B (8192 Context)
                    </option>
                    <option value="mixtral-8x7b-32768">
                      Mixtral 8x7B (Large Context 32k)
                    </option>
                    <option value="gemma2-9b-it">Gemma 2 9B (Google)</option>
                    <option value="deepseek-r1-distill-llama-70b">
                      DeepSeek R1 Distill Llama 70B
                    </option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestGroqInSettings}
                      disabled={testingGroqInSettings}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer flex-1"
                    >
                      {testingGroqInSettings ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing API...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Test Groq Connection</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {groqTestResultInSettings && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    groqTestResultInSettings.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {groqTestResultInSettings.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-bold">
                      {groqTestResultInSettings.success
                        ? `Groq API Connected Successfully (${groqTestResultInSettings.latencyMs}ms)!`
                        : groqTestResultInSettings.message}
                    </span>
                  </div>
                  {!groqTestResultInSettings.success && aiBot.model !== 'llama-3.1-8b-instant' && (
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setAiBot({ ...aiBot, model: 'llama-3.1-8b-instant' });
                          setGroqTestResultInSettings(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Switch to Llama 3.1 8B Instant (100% Free on all Groq accounts)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bot Identity */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">
                    Counselor Bot Name
                  </label>
                  <input
                    type="text"
                    value={aiBot.botName || ''}
                    onChange={(e) => setAiBot({ ...aiBot, botName: e.target.value })}
                    placeholder="e.g. FCC AI Admissions Counselor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">
                    Welcome Message on Open
                  </label>
                  <input
                    type="text"
                    value={aiBot.welcomeMessage || ''}
                    onChange={(e) => setAiBot({ ...aiBot, welcomeMessage: e.target.value })}
                    placeholder="Hello! How can I assist you with admissions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium focus:bg-white"
                  />
                </div>
              </div>

              {/* System Prompt Instructions */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  System Prompt Instructions (AI Brain)
                </label>
                <textarea
                  rows={4}
                  value={aiBot.systemPrompt || ''}
                  onChange={(e) => setAiBot({ ...aiBot, systemPrompt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 font-medium focus:bg-white resize-y"
                />
              </div>

              {/* Suggested Questions */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Suggested Questions / FAQ Chips (Shown to Visitors)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newQuestionInSettings}
                    onChange={(e) => setNewQuestionInSettings(e.target.value)}
                    placeholder="Add a new chip question..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newQuestionInSettings.trim()) return;
                      setAiBot({
                        ...aiBot,
                        suggestedQuestions: [...(aiBot.suggestedQuestions || []), newQuestionInSettings.trim()],
                      });
                      setNewQuestionInSettings('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(aiBot.suggestedQuestions || []).map((q, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200 text-[11px]"
                    >
                      <span>{q}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAiBot({
                            ...aiBot,
                            suggestedQuestions: (aiBot.suggestedQuestions || []).filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save AI Bot Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
