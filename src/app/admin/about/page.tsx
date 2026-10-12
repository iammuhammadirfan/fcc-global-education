'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Info, Save, RefreshCw, Eye, CheckCircle2, AlertCircle,
  Plus, Trash2, Edit3, ArrowRight, Sparkles, Target, Compass,
  HeartHandshake, Users, ShieldCheck, Award, FileText, Check,
  ExternalLink, Layers
} from 'lucide-react';
import { AboutPageSettings, AboutValueItem, AboutFeaturePillar } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

const DEFAULT_SETTINGS: AboutPageSettings = {
  heroBadge: 'Who We Are & What We Stand For',
  heroTitle: 'Empowering the Next Generation of',
  heroTitleHighlight: 'Global Leaders',
  heroDescription: 'Founded on the belief that world-class education transforms trajectories, FCC Global Education bridges ambitious international scholars with the world’s most prestigious universities through ethical, data-driven, and high-touch mentorship.',
  stats: {
    stat1Value: '25,000+',
    stat1Label: 'Students Placed Globally',
    stat2Value: '98.6%',
    stat2Label: 'Verified Visa Success',
    stat3Value: '850+',
    stat3Label: 'Direct Partner Universities',
    stat4Value: '$14.2M+',
    stat4Label: 'Scholarships Won by Students',
  },
  storyBadge: 'Our Story',
  storyTitle: 'Built on Academic Integrity, Driven by Student Triumph',
  storyParagraph1: 'FCC Global Education began with a clear realization: international education counseling was broken. Most traditional agencies pushed students toward low-tier, commission-heavy private institutions without regard for academic fit or career trajectory.',
  storyParagraph2: 'We set out to create an elite advisory modeled on collegiate fellowship committees. By hiring counselors with degrees from Oxford, Harvard, LSE, and TUM, we brought deep academic rigor to the application process. Today, we stand as one of the most respected independent educational consultancies with official university representations and direct alumni chapters spanning 20+ countries.',
  storyImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
  storyImageBadge: 'Founded by International Academics',
  storyImageCaption: 'Over a decade of university admissions excellence across UK, USA, Canada, & Australia.',
  storyPillars: [
    {
      title: 'Ethical Counsel',
      description: 'Zero commission steering. We recommend universities that truly align with your goals.',
    },
    {
      title: 'Audit-Grade Visas',
      description: 'Immigration specialists verify all financial dossiers before submission.',
    },
  ],
  missionTitle: 'Our Mission',
  missionDescription: 'To democratize access to the world’s top educational institutions by providing rigorous profiling, uncompromised writing guidance, transparent visa compliance, and relentless scholarship advocacy for every deserving student.',
  visionTitle: 'Our Vision',
  visionDescription: 'To be the world’s most trusted overseas education authority, known for elevating students into global thinkers, innovative problem solvers, and lifelong alumni leaders in their host societies.',
  valuesBadge: 'Guiding Principles',
  valuesTitle: 'Our Non-Negotiable Values',
  values: [
    {
      id: 'val-1',
      title: '1. Absolute Transparency',
      description: 'Honest chances assessment. If a program is unrealistic or overpriced, we give you unfiltered truth, not false promises.',
    },
    {
      id: 'val-2',
      title: '2. Academic Rigor',
      description: 'We treat every application like an academic submission, ensuring essays are intellectually rich and free of boilerplate clichés.',
    },
    {
      id: 'val-3',
      title: '3. Zero Plagiarism',
      description: 'Every personal statement is crafted from original student interviews and verified via Turnitin and AI-detection tools.',
    },
    {
      id: 'val-4',
      title: '4. Lifelong Support',
      description: 'Our care extends well past the airport gate into local housing, tax registration, and graduate job hunting.',
    },
  ],
  teamBadge: 'Expert Advisory Council',
  teamTitle: 'Meet Our Senior Counselors & Visa Directors',
  teamDescription: 'Our counselors possess real credentials from the world’s leading universities and legal immigration bodies.',
  showTeam: true,
  ctaBadge: 'Begin Your Journey Today',
  ctaTitle: 'Connect Directly with a Senior Admissions Counselor',
  ctaDescription: 'Schedule a personalized, one-on-one session to evaluate your transcripts and identify matched universities with high scholarship likelihood.',
  ctaPrimaryButtonText: 'Book Free Profile Evaluation',
  ctaPrimaryButtonLink: '/book-appointment',
  ctaSecondaryButtonText: 'View Our Services',
  ctaSecondaryButtonLink: '/services',
  seoTitle: 'About Us | FCC Global Education Consultants',
  seoDescription: 'Learn about FCC Global Education’s story, leadership, global university accreditations, ethical counseling values, and 98.6% visa approval track record.',
};

export default function AdminAboutPage() {
  const [settings, setSettings] = useState<AboutPageSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'mission' | 'values' | 'team' | 'cta' | 'seo'>('hero');
  const [newValueModal, setNewValueModal] = useState(false);
  const [newValTitle, setNewValTitle] = useState('');
  const [newValDesc, setNewValDesc] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/about');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
          stats: { ...DEFAULT_SETTINGS.stats, ...(data.settings.stats || {}) },
          storyPillars: data.settings.storyPillars || DEFAULT_SETTINGS.storyPillars,
          values: data.settings.values || DEFAULT_SETTINGS.values,
        });
      }
    } catch (err) {
      console.error('Error fetching about page settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('Error saving settings: ' + (data.error || 'Failed'));
      }
    } catch (err) {
      console.error('Error saving about settings:', err);
      alert('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all About page settings to defaults? This will overwrite unsaved changes.')) {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  // Value Items Handlers
  const handleAddValue = () => {
    if (!newValTitle.trim()) return;
    const item: AboutValueItem = {
      id: `val-${Date.now()}`,
      title: newValTitle.trim(),
      description: newValDesc.trim(),
    };
    setSettings((prev) => ({
      ...prev,
      values: [...(prev.values || []), item],
    }));
    setNewValTitle('');
    setNewValDesc('');
    setNewValueModal(false);
  };

  const handleUpdateValue = (id: string, field: 'title' | 'description', val: string) => {
    setSettings((prev) => ({
      ...prev,
      values: (prev.values || []).map((v) => (v.id === id ? { ...v, [field]: val } : v)),
    }));
  };

  const handleDeleteValue = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      values: (prev.values || []).map((v) => v).filter((v) => v.id !== id),
    }));
  };

  // Story Pillars Handlers
  const handleUpdatePillar = (index: number, field: 'title' | 'description', val: string) => {
    setSettings((prev) => {
      const pillars = [...(prev.storyPillars || [])];
      if (pillars[index]) {
        pillars[index] = { ...pillars[index], [field]: val };
      }
      return { ...prev, storyPillars: pillars };
    });
  };

  const handleAddPillar = () => {
    setSettings((prev) => ({
      ...prev,
      storyPillars: [...(prev.storyPillars || []), { title: 'New Highlight', description: 'Brief explanation of this pillar.' }],
    }));
  };

  const handleDeletePillar = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      storyPillars: (prev.storyPillars || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading About Page CMS Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header & Actions Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-900/5 border border-amber-500/20 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              Full Page CMS Control
            </span>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              Live Route: /about
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            About Us Page Customizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Full control over every text block, banner, story narrative, statistics, core values, and buttons.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:text-amber-700 hover:border-amber-400 transition-all shadow-xs"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all"
            title="Reset to defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">About Page updated successfully!</p>
              <p className="text-xs text-emerald-700">All updates are now live on the public /about page.</p>
            </div>
          </div>
          <Link
            href="/about"
            target="_blank"
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Open live page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto shadow-inner">
        {[
          { id: 'hero', label: '1. Hero & Statistics', icon: Sparkles },
          { id: 'story', label: '2. Our Story & Pillars', icon: FileText },
          { id: 'mission', label: '3. Mission & Vision', icon: Target },
          { id: 'values', label: '4. Core Values', icon: Award },
          { id: 'team', label: '5. Team Council', icon: Users },
          { id: 'cta', label: '6. Pre-Footer CTA', icon: ArrowRight },
          { id: 'seo', label: '7. SEO & Meta', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & STATISTICS */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hero Header Banner Content</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Top-most title, pill badge, and introduction paragraph.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={settings.heroBadge || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. WHO WE ARE & WHAT WE STAND FOR"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Title Text
                </label>
                <input
                  type="text"
                  value={settings.heroTitle || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Empowering the Next Generation of"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                  Highlighted Title Text (Orange Accent)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleHighlight || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitleHighlight: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Global Leaders"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={settings.heroDescription || ''}
                  onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  placeholder="Hero introductory paragraph explaining the agency purpose..."
                />
              </div>
            </div>
          </div>

          {/* 4 Statistics Cards */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" />
                <span>4 Hero Highlight Statistics Cards</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Edit values and titles shown in the 4 hero stat tiles.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Stat 1 (Amber)</span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Value / Number</label>
                  <input
                    type="text"
                    value={settings.stats?.stat1Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat1Value: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat1Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat1Label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Stat 2 (Emerald)</span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Value / Number</label>
                  <input
                    type="text"
                    value={settings.stats?.stat2Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat2Value: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat2Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat2Label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-3">
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">Stat 3 (Cyan)</span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Value / Number</label>
                  <input
                    type="text"
                    value={settings.stats?.stat3Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat3Value: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat3Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat3Label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Stat 4 (Dark)</span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Value / Number</label>
                  <input
                    type="text"
                    value={settings.stats?.stat4Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat4Value: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat4Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats!, stat4Label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OUR STORY & PILLARS */}
      {activeTab === 'story' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Our Story Narrative & Media</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Control the story text, founder image, badge, and caption.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Story Section Badge
                </label>
                <input
                  type="text"
                  value={settings.storyBadge || ''}
                  onChange={(e) => setSettings({ ...settings, storyBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Our Story"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Story Headline
                </label>
                <input
                  type="text"
                  value={settings.storyTitle || ''}
                  onChange={(e) => setSettings({ ...settings, storyTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Built on Academic Integrity, Driven by Student Triumph"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Story Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={settings.storyParagraph1 || ''}
                  onChange={(e) => setSettings({ ...settings, storyParagraph1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  placeholder="First narrative paragraph..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Story Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={settings.storyParagraph2 || ''}
                  onChange={(e) => setSettings({ ...settings, storyParagraph2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  placeholder="Second narrative paragraph..."
                />
              </div>

              {/* Story Image & Overlay Controls */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-900 block">Story Section Image & Overlay Box</span>
                
                <ImageUploadInput
                  label="Story Cover Image"
                  value={settings.storyImage || ''}
                  onChange={(url) => setSettings({ ...settings, storyImage: url })}
                  category="general"
                  helperText="High resolution counselor/campus photo displayed alongside the story narrative."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Image Overlay Badge</label>
                    <input
                      type="text"
                      value={settings.storyImageBadge || ''}
                      onChange={(e) => setSettings({ ...settings, storyImageBadge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900"
                      placeholder="e.g. Founded by International Academics"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Image Overlay Caption</label>
                    <input
                      type="text"
                      value={settings.storyImageCaption || ''}
                      onChange={(e) => setSettings({ ...settings, storyImageCaption: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900"
                      placeholder="e.g. Over a decade of admissions excellence..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story Feature Pillars */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Story Highlight Pillar Cards</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Two cards displayed under the story text (e.g. Ethical Counsel & Audit-Grade Visas).</p>
              </div>
              <button
                type="button"
                onClick={handleAddPillar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-300 text-xs font-bold hover:bg-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(settings.storyPillars || []).map((pillar, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pillar #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePillar(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Pillar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MISSION & VISION */}
      {activeTab === 'mission' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span>Our Mission & Vision Statements</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Control the dedicated Mission (amber icon) and Vision (cyan icon) cards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mission Card Editor */}
              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Mission Statement Card</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Heading</label>
                  <input
                    type="text"
                    value={settings.missionTitle || ''}
                    onChange={(e) => setSettings({ ...settings, missionTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                    placeholder="Our Mission"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mission Description</label>
                  <textarea
                    rows={4}
                    value={settings.missionDescription || ''}
                    onChange={(e) => setSettings({ ...settings, missionDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                    placeholder="Explain the organization mission..."
                  />
                </div>
              </div>

              {/* Vision Card Editor */}
              <div className="p-5 rounded-2xl bg-cyan-50/40 border border-cyan-200/80 space-y-4">
                <div className="flex items-center gap-2 text-cyan-700 font-bold text-xs uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-cyan-600" />
                  <span>Vision Statement Card</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Heading</label>
                  <input
                    type="text"
                    value={settings.visionTitle || ''}
                    onChange={(e) => setSettings({ ...settings, visionTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                    placeholder="Our Vision"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vision Description</label>
                  <textarea
                    rows={4}
                    value={settings.visionDescription || ''}
                    onChange={(e) => setSettings({ ...settings, visionDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                    placeholder="Explain the long-term vision..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CORE VALUES */}
      {activeTab === 'values' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Guiding Principles & Core Values (Complete CRUD)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage the cards representing ethical principles and values.</p>
              </div>

              <button
                type="button"
                onClick={() => setNewValueModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Value</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Values Section Badge
                </label>
                <input
                  type="text"
                  value={settings.valuesBadge || ''}
                  onChange={(e) => setSettings({ ...settings, valuesBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Guiding Principles"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Values Section Title
                </label>
                <input
                  type="text"
                  value={settings.valuesTitle || ''}
                  onChange={(e) => setSettings({ ...settings, valuesTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Our Non-Negotiable Values"
                />
              </div>
            </div>

            {/* List of Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(settings.values || []).map((val, idx) => (
                <div key={val.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      Value #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteValue(val.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete Value"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Value Title / Heading</label>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => handleUpdateValue(val.id, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Value Description</label>
                    <textarea
                      rows={2}
                      value={val.description}
                      onChange={(e) => handleUpdateValue(val.id, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TEAM COUNCIL */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Expert Advisory Council / Team Section</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Control the heading, description, and visibility of the Team section on /about.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <ToggleSwitch
                  checked={settings.showTeam !== false}
                  onChange={(checked) => setSettings({ ...settings, showTeam: checked })}
                  label="Display Team Section on /about Page"
                  description="Toggle off if you want to temporarily hide the counselors section on the public About page."
                  activeColor="emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={settings.teamBadge || ''}
                  onChange={(e) => setSettings({ ...settings, teamBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Expert Advisory Council"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Headline Title
                </label>
                <input
                  type="text"
                  value={settings.teamTitle || ''}
                  onChange={(e) => setSettings({ ...settings, teamTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Meet Our Senior Counselors & Visa Directors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={settings.teamDescription || ''}
                  onChange={(e) => setSettings({ ...settings, teamDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  placeholder="Description explaining the counselor credentials..."
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Need to add, edit, or remove individual Team Counselors?</p>
                  <p className="text-[11px] text-amber-700">Team counselor photos, bios, degrees, and LinkedIn links are managed in the Team Counselors CMS.</p>
                </div>
              </div>
              <Link
                href="/admin/team"
                className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors whitespace-nowrap"
              >
                Manage Team Counselors →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PRE-FOOTER CTA */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-amber-500" />
                <span>Pre-Footer Call-to-Action Banner</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Control the dark call-to-action box and buttons shown before the footer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  CTA Badge
                </label>
                <input
                  type="text"
                  value={settings.ctaBadge || ''}
                  onChange={(e) => setSettings({ ...settings, ctaBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Begin Your Journey Today"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  CTA Headline Title
                </label>
                <input
                  type="text"
                  value={settings.ctaTitle || ''}
                  onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Connect Directly with a Senior Admissions Counselor"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  CTA Description Text
                </label>
                <textarea
                  rows={2}
                  value={settings.ctaDescription || ''}
                  onChange={(e) => setSettings({ ...settings, ctaDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  placeholder="Description..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Button Text (Gold Gradient)
                </label>
                <input
                  type="text"
                  value={settings.ctaPrimaryButtonText || ''}
                  onChange={(e) => setSettings({ ...settings, ctaPrimaryButtonText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. Book Free Profile Evaluation"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Button Link URL
                </label>
                <input
                  type="text"
                  value={settings.ctaPrimaryButtonLink || ''}
                  onChange={(e) => setSettings({ ...settings, ctaPrimaryButtonLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-mono"
                  placeholder="/book-appointment"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={settings.ctaSecondaryButtonText || ''}
                  onChange={(e) => setSettings({ ...settings, ctaSecondaryButtonText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="e.g. View Our Services"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Secondary Button Link URL
                </label>
                <input
                  type="text"
                  value={settings.ctaSecondaryButtonLink || ''}
                  onChange={(e) => setSettings({ ...settings, ctaSecondaryButtonLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-mono"
                  placeholder="/services"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SEO & META */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>About Us Page SEO & Meta Tags</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Control search engine title tags and meta descriptions for the /about route.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Browser Title Tag (Meta Title)
                </label>
                <input
                  type="text"
                  value={settings.seoTitle || ''}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                  placeholder="About Us | FCC Global Education Consultants"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.seoDescription || ''}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  placeholder="Summary of page for Google and social previews..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Value */}
      {newValueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Add New Core Value / Principle</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewValueModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Number</label>
                <input
                  type="text"
                  value={newValTitle}
                  onChange={(e) => setNewValTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                  placeholder="e.g. 5. Ethical Excellence"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newValDesc}
                  onChange={(e) => setNewValDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  placeholder="Describe this principle and what it means for students..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setNewValueModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddValue}
                disabled={!newValTitle.trim()}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-50"
              >
                Add Value
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
