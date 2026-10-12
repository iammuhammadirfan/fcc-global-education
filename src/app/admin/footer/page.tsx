'use client';

import React, { useEffect, useState } from 'react';
import { 
  PanelBottom, Save, RefreshCw, CheckCircle2, 
  Plus, Trash2, Edit3, Globe, Phone, Mail, MapPin
} from 'lucide-react';
import { FooterConfig, FooterLink } from '@/lib/types';

export default function AdminFooterPage() {
  const [footer, setFooter] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/footer');
      const data = await res.json();
      if (data.success && data.footer) {
        setFooter(data.footer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footer) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footer)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        alert(data.error || 'Failed to save footer');
      }
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLinkChange = (section: 'quickLinks' | 'destinations' | 'services', index: number, field: 'name' | 'href', value: string) => {
    if (!footer) return;
    const newLinks = [...footer[section]];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooter({ ...footer, [section]: newLinks });
  };

  const handleAddLink = (section: 'quickLinks' | 'destinations' | 'services') => {
    if (!footer) return;
    const newLinks = [...footer[section], { name: 'New Link', href: '/' }];
    setFooter({ ...footer, [section]: newLinks });
  };

  const handleDeleteLink = (section: 'quickLinks' | 'destinations' | 'services', index: number) => {
    if (!footer) return;
    const newLinks = footer[section].filter((_: any, idx: number) => idx !== index);
    setFooter({ ...footer, [section]: newLinks });
  };

  if (loading || !footer) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
        Loading footer configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PanelBottom className="w-7 h-7 text-amber-400" />
            Website Footer CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage company footer description, accreditation disclaimer, contact cards, and link columns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save Footer'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Footer settings updated successfully!
        </div>
      )}

      {/* Brand & Description */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Brand Narrative & Legal Copyright</h2>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Company Footer Summary</label>
            <textarea
              rows={2}
              value={footer.companyDescription || ''}
              onChange={(e) => setFooter({ ...footer, companyDescription: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Accreditation Disclaimer</label>
            <textarea
              rows={2}
              value={footer.disclaimer || ''}
              onChange={(e) => setFooter({ ...footer, disclaimer: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Copyright Line</label>
              <input
                type="text"
                value={footer.copyright || ''}
                onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Newsletter Prompt Text</label>
              <input
                type="text"
                value={footer.newsletterText || ''}
                onChange={(e) => setFooter({ ...footer, newsletterText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Link Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['quickLinks', 'destinations', 'services'] as const).map(section => (
          <div key={section} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white capitalize">{section.replace(/([A-Z])/g, ' $1')}</h3>
              <button
                type="button"
                onClick={() => handleAddLink(section)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                title="Add link"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {footer[section].map((link: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleLinkChange(section, idx, 'name', e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => handleLinkChange(section, idx, 'href', e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteLink(section, idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
