'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Save,
  Check,
  X,
  Clock,
  Sparkles,
  FileText,
  Layers,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Compass,
  GraduationCap,
  FileCheck,
  Award,
  Stamp,
  PenTool,
  Languages,
  Building2,
  PlaneTakeoff,
  HeartHandshake,
  BookOpen,
  Users,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { Service, ServicesPageSettings } from '@/lib/types';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

const ICON_PRESETS = [
  'Compass',
  'GraduationCap',
  'FileCheck',
  'Award',
  'Stamp',
  'PenTool',
  'Languages',
  'Building2',
  'PlaneTakeoff',
  'HeartHandshake',
  'BookOpen',
  'Users',
  'ShieldCheck',
  'FileText',
  'Globe',
  'Briefcase',
  'Sparkles',
  'HelpCircle',
];

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'content'>('services');

  // Services Directory State
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New deliverable & benefit input state in modal
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const initialForm = {
    title: '',
    slug: '',
    icon: 'Compass',
    shortDesc: '',
    fullDesc: '',
    turnaroundTime: '3–5 business days',
    targetAudience: 'Undergraduates, Graduates & Working Professionals',
    deliverables: ['1-on-1 Counseling Session', 'Personalized Roadmap', 'Document Checklist'],
    benefits: ['Expert Guidance', 'High Visa Rate', 'Zero Processing Delays'],
    sortOrder: 1,
    active: true,
  };

  const [form, setForm] = useState<any>(initialForm);

  // Page Headings & Sections State
  const [settings, setSettings] = useState<ServicesPageSettings>({
    heroBadge: 'End-to-End International Education Suite',
    heroTitle: 'Bespoke Services for Every Stage of',
    heroTitleHighlight: 'Your Global Journey',
    heroDescription:
      'From academic profiling and Turnitin-verified SOP editing to our audited 98.6% visa advisory and overseas accommodation booking, discover our full spectrum of specialized student services.',
    spotlightBadge: 'Featured Deep-Dive',
    spotlightCtaText: 'Book Free Consultation for this Service',
    spotlightCtaLink: '/book-appointment',
    whatsappCtaText: 'Chat with Service Lead on WhatsApp',
    whatsappNumber: '+442079460912',
    selectorTitle: 'Select Service to Inspect:',
    portfolioBadge: 'Complete Portfolio',
    portfolioTitle: 'Explore All {count} Specialized Advisory Services',
    portfolioSubtitle:
      'Every service is led by certified specialists with direct experience in university admissions and international immigration law.',
    serviceCtaText: 'Get Service Consultation',
    serviceCtaLink: '/book-appointment',
    ctaBadge: 'Tailored Mentorship',
    ctaTitle: 'Not Sure Which Service You Need First?',
    ctaDescription:
      'Book a complimentary 30-minute diagnostic session. Our senior counselor will evaluate your profile and chart a custom roadmap covering all required services.',
    ctaButtonText: 'Book Free Diagnostic Session',
    ctaButtonLink: '/book-appointment',
  });

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch Services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Page Settings
  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const res = await fetch('/api/admin/services/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchSettings();
  }, []);

  // Modal open handlers
  const openAddModal = () => {
    setEditingService(null);
    setForm({
      ...initialForm,
      sortOrder: services.length + 1,
    });
    setNewDeliverable('');
    setNewBenefit('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingService(s);
    setForm({
      id: s.id,
      slug: s.slug || '',
      originalSlug: s.slug || '',
      title: s.title || '',
      icon: s.icon || 'GraduationCap',
      shortDesc: s.shortDesc || s.shortDescription || '',
      fullDesc: s.fullDesc || s.fullDescription || '',
      turnaroundTime: s.turnaroundTime || s.turnaround || '3–5 business days',
      targetAudience: s.targetAudience || 'All international students',
      deliverables: Array.isArray(s.deliverables) ? [...s.deliverables] : [],
      benefits: Array.isArray(s.benefits) ? [...s.benefits] : [],
      sortOrder: s.sortOrder !== undefined ? s.sortOrder : (s.order || 1),
      active: s.active !== undefined ? Boolean(s.active) : true,
    });
    setNewDeliverable('');
    setNewBenefit('');
    setIsModalOpen(true);
  };

  const handleSlugGenerate = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm((prev: any) => ({
      ...prev,
      title,
      slug: editingService ? prev.slug : slug,
    }));
  };

  // Add / Remove Deliverables
  const handleAddDeliverable = () => {
    if (!newDeliverable.trim()) return;
    setForm((prev: any) => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), newDeliverable.trim()],
    }));
    setNewDeliverable('');
  };

  const handleRemoveDeliverable = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_: any, i: number) => i !== idx),
    }));
  };

  // Add / Remove Benefits
  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setForm((prev: any) => ({
      ...prev,
      benefits: [...(prev.benefits || []), newBenefit.trim()],
    }));
    setNewBenefit('');
  };

  const handleRemoveBenefit = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      benefits: prev.benefits.filter((_: any, i: number) => i !== idx),
    }));
  };

  // Submit Add / Edit
  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.slug?.trim()) {
      alert('Service title and slug are required');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingService ? 'PUT' : 'POST';
      const payload = {
        ...form,
        originalSlug: editingService?.slug,
      };

      const res = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert(data.error || 'Failed to save service');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving service');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Service
  const handleDelete = async (service: any) => {
    const identifier = service.id || service.slug;
    if (!confirm(`Are you sure you want to delete "${service.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(identifier)}&slug=${encodeURIComponent(service.slug || '')}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s.id !== service.id && s.slug !== service.slug));
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete service');
    }
  };

  // Toggle Active / Inactive
  const toggleActive = async (service: any) => {
    const updatedStatus = !service.active;
    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s.id === service.id || s.slug === service.slug ? { ...s, active: updatedStatus } : s))
    );

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          slug: service.slug,
          active: updatedStatus,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback on failure
        setServices((prev) =>
          prev.map((s) => (s.id === service.id || s.slug === service.slug ? { ...s, active: !updatedStatus } : s))
        );
        alert(data.error || 'Failed to toggle status');
      }
    } catch (err) {
      console.error(err);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id || s.slug === service.slug ? { ...s, active: !updatedStatus } : s))
      );
    }
  };

  // Save Page Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/services/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to save page settings');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtering services
  const filtered = services.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.slug?.toLowerCase().includes(search.toLowerCase()) ||
      (s.shortDesc || s.shortDescription || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = services.filter((s) => s.active !== false).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-amber-400" />
            Admissions & Visa Services CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Fully configure every service item, turnaround timelines, deliverables, benefits, and the entire public page layout.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === 'content' ? (
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingSettings ? 'Saving Settings...' : saveSuccess ? 'Saved Live!' : 'Save Page Content'}</span>
            </button>
          ) : (
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Service
            </button>
          )}

          <button
            onClick={() => {
              fetchServices();
              fetchSettings();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            Refresh
          </button>

          <a
            href="/services"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'services'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Services Directory ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'content'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Page Headings & Sections CMS</span>
        </button>
      </div>

      {/* TAB 1: SERVICES DIRECTORY */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">Total Services</span>
              <p className="text-2xl font-black text-white mt-1">{services.length}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-emerald-400 font-medium">Active & Live</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">Inactive / Draft</span>
              <p className="text-2xl font-black text-slate-400 mt-1">{inactiveCount}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-amber-400 font-medium">Turnaround Standard</span>
              <p className="text-sm font-bold text-white mt-2 truncate">24h – 5 Days</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services by title, slug, or description keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Services Table */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-16">Order</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Slug Anchor</th>
                    <th className="py-3.5 px-4">Turnaround</th>
                    <th className="py-3.5 px-4">Deliverables</th>
                    <th className="py-3.5 px-4">Benefits</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                        Loading services directory...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No services found matching your search. Click &quot;Add New Service&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, idx) => {
                      const turnaround = s.turnaroundTime || s.turnaround || '3–5 business days';
                      const shortText = s.shortDesc || s.shortDescription || '';
                      const orderNum = s.sortOrder !== undefined ? s.sortOrder : (s.order !== undefined ? s.order : idx + 1);

                      return (
                        <tr key={s.id || s.slug} className="hover:bg-slate-800/30 transition">
                          <td className="py-3.5 px-4 text-xs font-mono font-bold text-amber-400">
                            #{orderNum}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span className="p-1 rounded bg-slate-800 text-amber-400 text-xs font-mono">
                                {s.icon || 'GraduationCap'}
                              </span>
                              <span>{s.title}</span>
                            </div>
                            {shortText && (
                              <div className="text-xs text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                                {shortText}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`/services#${s.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono text-amber-400/90 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded transition inline-flex items-center gap-1"
                            >
                              <span>/services#{s.slug}</span>
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>{turnaround}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-400">
                            <span className="bg-slate-800/50 px-2 py-0.5 rounded">
                              {s.deliverables?.length || 0} items
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-400">
                            <span className="bg-slate-800/50 px-2 py-0.5 rounded">
                              {s.benefits?.length || 0} items
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleActive(s)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                                s.active !== false
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                              }`}
                            >
                              {s.active !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {s.active !== false ? 'Active' : 'Hidden'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1 cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(s)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg inline-flex items-center transition cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAGE HEADINGS & SECTIONS CMS */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Section 1: Hero Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Hero Banner Section
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controls the top hero header shown on the /services page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Hero Tag / Badge
                </label>
                <input
                  type="text"
                  value={settings.heroBadge || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  placeholder="e.g. End-to-End International Education Suite"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Main Headline Prefix
                </label>
                <input
                  type="text"
                  value={settings.heroTitle || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  placeholder="e.g. Bespoke Services for Every Stage of"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1">
                  Headline Highlight (Colored Amber)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleHighlight || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitleHighlight: e.target.value })}
                  placeholder="e.g. Your Global Journey"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Hero Paragraph Description
              </label>
              <textarea
                rows={3}
                value={settings.heroDescription || ''}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                placeholder="From academic profiling and Turnitin-verified SOP editing to..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Interactive Spotlight / Deep-Dive */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                Interactive Spotlight & Deep-Dive Section
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Controls the featured service inspector card with turnaround time, deliverables checklist, and booking buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Spotlight Tag Badge
                </label>
                <input
                  type="text"
                  value={settings.spotlightBadge || ''}
                  onChange={(e) => setSettings({ ...settings, spotlightBadge: e.target.value })}
                  placeholder="e.g. Featured Deep-Dive"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Sidebar Selector Title
                </label>
                <input
                  type="text"
                  value={settings.selectorTitle || ''}
                  onChange={(e) => setSettings({ ...settings, selectorTitle: e.target.value })}
                  placeholder="e.g. Select Service to Inspect:"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Primary Consultation Button Text
                </label>
                <input
                  type="text"
                  value={settings.spotlightCtaText || ''}
                  onChange={(e) => setSettings({ ...settings, spotlightCtaText: e.target.value })}
                  placeholder="e.g. Book Free Consultation for this Service"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Primary Consultation Button Link (Href)
                </label>
                <input
                  type="text"
                  value={settings.spotlightCtaLink || ''}
                  onChange={(e) => setSettings({ ...settings, spotlightCtaLink: e.target.value })}
                  placeholder="e.g. /book-appointment"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  WhatsApp Button Text
                </label>
                <input
                  type="text"
                  value={settings.whatsappCtaText || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappCtaText: e.target.value })}
                  placeholder="e.g. Chat with Service Lead on WhatsApp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  WhatsApp Contact Number or Direct Link
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="e.g. +442079460912 or https://wa.me/442079460912"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Portfolio Grid Header */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Portfolio Grid Header & Card Actions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Controls the title and description above the 3-column service cards grid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Portfolio Top Badge
                </label>
                <input
                  type="text"
                  value={settings.portfolioBadge || ''}
                  onChange={(e) => setSettings({ ...settings, portfolioBadge: e.target.value })}
                  placeholder="e.g. Complete Portfolio"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Portfolio Heading Template
                </label>
                <input
                  type="text"
                  value={settings.portfolioTitle || ''}
                  onChange={(e) => setSettings({ ...settings, portfolioTitle: e.target.value })}
                  placeholder="e.g. Explore All {count} Specialized Advisory Services"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-500">
                  Tip: Use {'{count}'} to dynamically display total active services.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Portfolio Subtitle / Summary
              </label>
              <textarea
                rows={2}
                value={settings.portfolioSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, portfolioSubtitle: e.target.value })}
                placeholder="Every service is led by certified specialists with direct experience..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Card CTA Button Text
                </label>
                <input
                  type="text"
                  value={settings.serviceCtaText || ''}
                  onChange={(e) => setSettings({ ...settings, serviceCtaText: e.target.value })}
                  placeholder="e.g. Get Service Consultation"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Card CTA Button Link (Href)
                </label>
                <input
                  type="text"
                  value={settings.serviceCtaLink || ''}
                  onChange={(e) => setSettings({ ...settings, serviceCtaLink: e.target.value })}
                  placeholder="e.g. /book-appointment"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Pre-Footer CTA */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Pre-Footer Conversion Banner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Controls the dark conversion banner shown above the footer on the /services page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Banner Badge
                </label>
                <input
                  type="text"
                  value={settings.ctaBadge || ''}
                  onChange={(e) => setSettings({ ...settings, ctaBadge: e.target.value })}
                  placeholder="e.g. Tailored Mentorship"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Banner Main Heading
                </label>
                <input
                  type="text"
                  value={settings.ctaTitle || ''}
                  onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                  placeholder="e.g. Not Sure Which Service You Need First?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Banner Description
              </label>
              <textarea
                rows={2}
                value={settings.ctaDescription || ''}
                onChange={(e) => setSettings({ ...settings, ctaDescription: e.target.value })}
                placeholder="Book a complimentary 30-minute diagnostic session..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Banner Action Button Text
                </label>
                <input
                  type="text"
                  value={settings.ctaButtonText || ''}
                  onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                  placeholder="e.g. Book Free Diagnostic Session"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Banner Action Button Link (Href)
                </label>
                <input
                  type="text"
                  value={settings.ctaButtonLink || ''}
                  onChange={(e) => setSettings({ ...settings, ctaButtonLink: e.target.value })}
                  placeholder="e.g. /book-appointment"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Sticky / Save Bottom Action */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">
              Changes will update live across the entire Services page immediately.
            </span>
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingSettings ? 'Saving Settings...' : saveSuccess ? 'Saved Live!' : 'Save Page Content'}</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL: ADD / EDIT SERVICE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Counseling Service'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title || ''}
                    onChange={(e) => handleSlugGenerate(e.target.value)}
                    placeholder="e.g. Visa Consultancy & Mock Interviews"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. visa-consultancy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Turnaround & Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Turnaround Timeline</label>
                  <input
                    type="text"
                    value={form.turnaroundTime || ''}
                    onChange={(e) => setForm({ ...form, turnaroundTime: e.target.value })}
                    placeholder="e.g. 2–3 Business Days"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Target Audience</label>
                  <input
                    type="text"
                    value={form.targetAudience || ''}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                    placeholder="e.g. Prospective Bachelor’s & Master’s Students"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Lucide Icon (Pick Preset or Enter Custom)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {ICON_PRESETS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1 transition cursor-pointer ${
                        form.icon === ic
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{ic}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.icon || 'GraduationCap'}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g. GraduationCap, Compass, FileCheck"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Short Card Description */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Short Description (Shown on cards & directory)
                </label>
                <textarea
                  rows={2}
                  value={form.shortDesc || ''}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  placeholder="Concise overview summarizing the primary benefit for students..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Detailed Full Description */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Detailed Full Description (Shown in featured deep-dive)
                </label>
                <textarea
                  rows={3}
                  value={form.fullDesc || ''}
                  onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                  placeholder="Complete explanation of counseling process, expert review steps, and guarantees..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Deliverables Builder */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-semibold">
                  Key Deliverables & Protections Checklist
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {form.deliverables?.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Add deliverable (e.g. Personalized University Strategy Dossier)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Benefits Builder */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-semibold">
                  Student Benefits (Displayed as bullet points on cards)
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {form.benefits?.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    placeholder="Add student benefit (e.g. 98.6% verified visa success rate)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Order & Active Switch */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Display Order</label>
                  <input
                    type="number"
                    value={form.sortOrder || 1}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="pt-2">
                  <ToggleSwitch
                    checked={form.active !== false}
                    onChange={(val) => setForm({ ...form, active: val })}
                    label="Service Status"
                    description="Live and available for students to explore"
                    activeColor="emerald"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
