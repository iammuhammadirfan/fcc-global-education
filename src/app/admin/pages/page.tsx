'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, Eye, RefreshCw, ShieldAlert, Scale, X
} from 'lucide-react';
import { CustomPage } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

export default function AdminPagesCMS() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm: Partial<CustomPage> = {
    title: '',
    slug: '',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200',
    content: '',
    published: true,
    seoTitle: '',
    seoDescription: ''
  };

  const [form, setForm] = useState<Partial<CustomPage>>(initialForm);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.pages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openAddModal = () => {
    setEditingPage(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (p: CustomPage) => {
    setEditingPage(p);
    setForm(p);
    setIsModalOpen(true);
  };

  const handleSlugGenerate = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug && editingPage ? prev.slug : slug,
      seoTitle: `${title} | FCC Global Education`,
      seoDescription: `Official information and guidelines regarding ${title}.`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      alert('Title, slug, and content are required');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingPage ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchPages();
      } else {
        alert(data.error || 'Failed to save page');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPages(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-amber-400" />
            Legal & Custom Pages CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage Privacy Policy, Terms, Cookie notices, and create custom landing pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPages}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search pages by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Page Title</th>
                <th className="py-3.5 px-4">Slug / Route</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                    Loading pages...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    No custom pages found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {p.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded">
                        /{p.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5 ${
                        p.published
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {p.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={`/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="Edit Page"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg inline-flex items-center transition"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                {editingPage ? `Edit: ${editingPage.title}` : 'Create Custom Page'}
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title || ''}
                    onChange={(e) => handleSlugGenerate(e.target.value)}
                    placeholder="e.g. Privacy Policy or Scholarships Guide"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Slug (Route) *</label>
                  <input
                    type="text"
                    required
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. privacy-policy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Page Hero Banner Image"
                value={form.heroImage || ''}
                onChange={(url) => setForm({ ...form, heroImage: url })}
                placeholder="https://... or upload banner image"
                category="pages"
                dark={true}
                helperText="Upload banner header image for this page (saved to database)"
              />

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Page Body Content (Markdown Supported) *</label>
                <textarea
                  rows={10}
                  required
                  value={form.content || ''}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write body content in markdown or HTML..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">SEO Meta Title</label>
                  <input
                    type="text"
                    value={form.seoTitle || ''}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">SEO Meta Description</label>
                  <input
                    type="text"
                    value={form.seoDescription || ''}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <ToggleSwitch
                  checked={form.published ?? true}
                  onChange={(val) => setForm({ ...form, published: val })}
                  label="Published Live"
                  description="Publish page and make it accessible publicly"
                  activeColor="emerald"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-semibold shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingPage ? 'Save Changes' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
