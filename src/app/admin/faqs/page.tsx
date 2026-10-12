'use client';

import React, { useEffect, useState } from 'react';
import { 
  HelpCircle, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, RefreshCw, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { FAQItem } from '@/lib/types';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm: any = {
    question: '',
    answer: '',
    category: 'Admissions',
    order: 1,
    published: true
  };

  const [form, setForm] = useState<any>(initialForm);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setForm({
      ...initialForm,
      order: faqs.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (f: FAQItem) => {
    setEditingFaq(f);
    setForm(f);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      alert('Question and answer are required');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingFaq ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert(data.error || 'Failed to save FAQ');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (faq: FAQItem) => {
    try {
      const updated = { ...faq, published: !faq.published };
      const res = await fetch('/api/admin/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(prev => prev.map(f => f.id === faq.id ? updated : f));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = Array.from(new Set(faqs.map(f => f.category || 'General')));

  const filtered = faqs.filter(f => {
    const matchesSearch = 
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-amber-400" />
            Frequently Asked Questions CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage FAQs for admissions, visas, scholarships, and international student queries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFaqs}
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
            Add FAQ
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
        >
          <option value="all">All Categories ({faqs.length})</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Loading FAQs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
            No FAQs found matching your search.
          </div>
        ) : (
          filtered.map(f => (
            <div key={f.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">#{f.order || 0}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-medium">
                    {f.category || 'General'}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-base">{f.question}</h3>
                <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{f.answer}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                <button
                  onClick={() => togglePublish(f)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                    f.published
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {f.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {f.published ? 'Published' : 'Hidden'}
                </button>
                <button
                  onClick={() => openEditModal(f)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                  title="Edit FAQ"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                {editingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    required
                    value={form.category || 'Admissions'}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Admissions, Visa, Scholarships, Accommodation"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Question *</label>
                <input
                  type="text"
                  required
                  value={form.question || ''}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. When should I start applying for the September intake?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={form.answer || ''}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Provide helpful, accurate answer for prospective students..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <ToggleSwitch
                  checked={form.published ?? true}
                  onChange={(val) => setForm({ ...form, published: val })}
                  label="Published on FAQ Page"
                  description="Make this question visible to visitors"
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
                  {submitting ? 'Saving...' : editingFaq ? 'Save FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
