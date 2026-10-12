'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, Save, RefreshCw, CheckCircle2, Globe, 
  Share2, ShieldCheck, BarChart3
} from 'lucide-react';
import { SeoSettings } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const fetchSeo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings?type=seo');
      const data = await res.json();
      if (data.success && data.seo) {
        setSeo(data.seo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'seo', seo })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        alert(data.error || 'Failed to save SEO settings');
      }
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !seo) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
        Loading SEO configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Search className="w-7 h-7 text-amber-400" />
            Global SEO & Metadata CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Optimize search engine rankings, OpenGraph sharing cards, Google Search Console, and Webmaster tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          SEO metadata updated successfully!
        </div>
      )}

      {/* Meta Titles and Descriptions */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-400" />
          Default Search Engine Metadata
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Default Website Meta Title</label>
            <input
              type="text"
              value={seo.defaultTitle || ''}
              onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] text-slate-500 mt-1">Recommended length: 50-60 characters ({seo.defaultTitle?.length || 0} characters)</div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Title Template Format</label>
            <input
              type="text"
              value={seo.titleTemplate || ''}
              onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
              placeholder="%s | FCC Global Education"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Global Meta Description</label>
            <textarea
              rows={3}
              value={seo.defaultDescription || ''}
              onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] text-slate-500 mt-1">Recommended length: 140-160 characters ({seo.defaultDescription?.length || 0} characters)</div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Meta Keywords (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(seo.keywords) ? seo.keywords.join(', ') : ''}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Social Share Cards */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-amber-400" />
          Social Share (OpenGraph & Twitter Cards)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadInput
            label="OG Social Share Image (1200x630px)"
            value={seo.ogImage || ''}
            onChange={(url) => setSeo({ ...seo, ogImage: url })}
            placeholder="https://... or upload OG banner"
            category="general"
            dark={true}
            helperText="Preview image shown when links are shared on Facebook, LinkedIn, etc."
          />
          <ImageUploadInput
            label="Twitter / X Card Image"
            value={seo.twitterImage || ''}
            onChange={(url) => setSeo({ ...seo, twitterImage: url })}
            placeholder="https://... or upload twitter card"
            category="general"
            dark={true}
            helperText="Preview image shown on Twitter / X cards"
          />
        </div>
      </div>

      {/* Webmaster Verifications & Analytics */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          Webmaster Verification & Tracking Tags
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Google Search Console Verification Token</label>
            <input
              type="text"
              value={seo.googleSiteVerification || ''}
              onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
              placeholder="e.g. googled6a237890..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Google Analytics / GTM ID</label>
            <input
              type="text"
              value={seo.googleAnalyticsId || ''}
              onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
              placeholder="e.g. G-XXXXXXXXXX"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
