'use client';

import React, { useEffect, useState } from 'react';
import { 
  Globe, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, Eye, RefreshCw, MoveUp, MoveDown, Image as ImageIcon, X
} from 'lucide-react';
import { Country } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm: Partial<Country> = {
    name: '',
    slug: '',
    flag: '🌍',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200',
    shortDescription: '',
    longDescription: '',
    tuition: '£15,000 - £35,000 / year',
    livingCost: '£1,000 - £1,300 / month',
    visaInfo: 'Tier 4 / Student Visa, 98% Success Rate',
    workOpportunity: '20 hrs/week during term; Full-time during holidays',
    postStudyWork: '2-3 Years Graduate Route Visa',
    intakes: ['September (Major)', 'January (Secondary)', 'May'],
    scholarships: 'Up to 50% Merit Scholarships Available',
    popularCourses: ['Computer Science', 'Business & Finance', 'Data Analytics', 'Engineering'],
    whyStudy: ['World-class global universities', 'High return on investment', 'Post-study work permit'],
    order: 1,
    published: true,
    seoTitle: '',
    seoDescription: ''
  };

  const [form, setForm] = useState<Partial<Country>>(initialForm);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/countries');
      const data = await res.json();
      if (data.success) {
        const sorted = (data.countries || []).sort(
          (a: any, b: any) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999)
        );
        setCountries(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleQuickOrderChange = async (slugOrId: string, newOrder: number) => {
    setCountries((prev) => {
      const updated = prev.map((c) =>
        c.slug === slugOrId || c.id === slugOrId
          ? { ...c, order: newOrder, sortOrder: newOrder }
          : c
      );
      return updated.sort((a, b) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999));
    });

    try {
      await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slugOrId, id: slugOrId, order: newOrder }),
      });
    } catch (err) {
      console.error('Failed to update country order', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= countries.length) return;

    const newCountries = [...countries];
    const current = newCountries[index];
    const target = newCountries[targetIndex];

    const currentOrder = current.order ?? current.sortOrder ?? index + 1;
    const targetOrder = target.order ?? target.sortOrder ?? targetIndex + 1;

    current.order = targetOrder;
    current.sortOrder = targetOrder;
    target.order = currentOrder === targetOrder ? (direction === 'up' ? targetOrder + 1 : targetOrder - 1) : currentOrder;
    target.sortOrder = target.order;

    newCountries.sort((a, b) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999));
    setCountries(newCountries);

    try {
      await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          items: newCountries.map((c, idx) => ({ id: c.id, slug: c.slug, order: idx + 1 })),
        }),
      });
    } catch (err) {
      console.error('Failed to reorder countries', err);
    }
  };

  const openAddModal = () => {
    setEditingCountry(null);
    setForm({
      ...initialForm,
      order: countries.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Country) => {
    setEditingCountry(c);
    setForm({
      ...c,
      order: c.order ?? c.sortOrder ?? 1,
    });
    setIsModalOpen(true);
  };

  const handleSlugGenerate = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setForm(prev => ({
      ...prev,
      name,
      slug: prev.slug && editingCountry ? prev.slug : slug,
      seoTitle: `Study in ${name} | Admissions & Visa Guide`,
      seoDescription: `Comprehensive guide to top universities, tuition fees, scholarships, and student visa application for studying in ${name}.`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      alert('Country name and slug are required');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingCountry ? 'PUT' : 'POST';
      const cleanOrder = Number(form.order) || 1;
      const res = await fetch('/api/admin/countries', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          order: cleanOrder,
          sortOrder: cleanOrder,
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCountries();
      } else {
        alert(data.error || 'Failed to save country');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (country: Country) => {
    if (!confirm(`Are you sure you want to delete ${country.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/countries?slug=${encodeURIComponent(country.slug)}&id=${encodeURIComponent(country.id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCountries(prev => prev.filter(c => c.id !== country.id && c.slug !== country.slug));
      } else {
        alert(data.error || 'Failed to delete country');
      }
    } catch (err: any) {
      console.error(err);
      alert('Delete error: ' + (err?.message || 'Network error'));
    }
  };

  const togglePublish = async (country: Country) => {
    try {
      const updated = { ...country, published: !country.published };
      const res = await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setCountries(prev => prev.map(c => c.id === country.id ? updated : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-7 h-7 text-amber-400" />
            Study Destinations CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage international study destinations, visa details, living costs, and country landing pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCountries}
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
            Add Destination
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search country by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Countries Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Slug / URL</th>
                <th className="py-3.5 px-4">Tuition & Visa</th>
                <th className="py-3.5 px-4">PSW Rights</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                    Loading study destinations...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No study destinations found. Click &quot;Add Destination&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((c, index) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                            title="Move Destination Up"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === filtered.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                            title="Move Destination Down"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="number"
                          min={1}
                          value={c.order ?? c.sortOrder ?? index + 1}
                          onChange={(e) => handleQuickOrderChange(c.slug || c.id, parseInt(e.target.value) || 1)}
                          className="w-14 px-1.5 py-1 text-center bg-slate-950 border border-slate-700 hover:border-amber-500/60 focus:border-amber-500 rounded-lg text-amber-400 font-black text-xs focus:outline-none transition"
                          title="Display order number on Homepage (1 = first)"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{c.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded">
                        /destinations/{c.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      <div>{c.tuition}</div>
                      <div className="text-slate-500 text-[11px]">{c.visaInfo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      <span className="bg-slate-800 px-2 py-1 rounded text-[11px] text-slate-300">
                        {c.postStudyWork}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublish(c)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition flex items-center gap-1.5 ${
                          c.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {c.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {c.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={`/destinations/${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="Edit Country"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg inline-flex items-center transition"
                        title="Delete Country"
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

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                {editingCountry ? `Edit Destination: ${editingCountry.name}` : 'Add New Study Destination'}
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
              {/* Row 1: Name, Flag, Slug */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name || ''}
                    onChange={(e) => handleSlugGenerate(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Emoji Flag / Icon</label>
                  <input
                    type="text"
                    value={form.flag || ''}
                    onChange={(e) => setForm({ ...form, flag: e.target.value })}
                    placeholder="e.g. 🇬🇧 or 🇦🇺"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Slug (URL path) *</label>
                  <input
                    type="text"
                    required
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. united-kingdom"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Hero Image */}
              <ImageUploadInput
                label="Hero Banner Image"
                value={form.heroImage || ''}
                onChange={(url) => setForm({ ...form, heroImage: url })}
                placeholder="https://... or upload destination image"
                category="destinations"
                dark={true}
                helperText="Upload landscape banner image for this study destination (saved to database)"
              />

              {/* Descriptions */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Short Highlight Description</label>
                <textarea
                  rows={2}
                  value={form.shortDescription || ''}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="e.g. Home to world-leading universities with flexible post-study work opportunities."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Detailed Country Overview (Markdown or text)</label>
                <textarea
                  rows={4}
                  value={form.longDescription || ''}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  placeholder="Comprehensive introduction about higher education system, student lifestyle, and intake seasons..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Financial & Visa Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Average Tuition Range</label>
                  <input
                    type="text"
                    value={form.tuition || ''}
                    onChange={(e) => setForm({ ...form, tuition: e.target.value })}
                    placeholder="e.g. £15,000 - £35,000 / year"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Estimated Living Expenses</label>
                  <input
                    type="text"
                    value={form.livingCost || ''}
                    onChange={(e) => setForm({ ...form, livingCost: e.target.value })}
                    placeholder="e.g. £1,000 - £1,300 / month"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Visa & Approval Highlights</label>
                  <input
                    type="text"
                    value={form.visaInfo || ''}
                    onChange={(e) => setForm({ ...form, visaInfo: e.target.value })}
                    placeholder="e.g. Student Route Visa, 98% approval rate"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Post-Study Work Permit (PSW)</label>
                  <input
                    type="text"
                    value={form.postStudyWork || ''}
                    onChange={(e) => setForm({ ...form, postStudyWork: e.target.value })}
                    placeholder="e.g. 2 - 3 Years Graduate Visa"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Lists: Popular Courses and Why Study */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Popular Courses (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(form.popularCourses) ? form.popularCourses.join(', ') : ''}
                    onChange={(e) => setForm({ ...form, popularCourses: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Computer Science, MBA, Engineering, Healthcare"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Intakes (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(form.intakes) ? form.intakes.join(', ') : ''}
                    onChange={(e) => setForm({ ...form, intakes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="September (Fall), January (Spring), May"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Order & Publish */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="pt-2">
                  <ToggleSwitch
                    checked={form.published ?? true}
                    onChange={(val) => setForm({ ...form, published: val })}
                    label="Published on Website"
                    description="Make this country destination live and accessible to students"
                    activeColor="emerald"
                  />
                </div>
              </div>

              {/* Form Actions */}
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
                  {submitting ? 'Saving...' : editingCountry ? 'Save Changes' : 'Create Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
