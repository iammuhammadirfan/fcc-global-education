'use client';

import React, { useEffect, useState } from 'react';
import { 
  Award, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, RefreshCw, Star, ExternalLink, X
} from 'lucide-react';
import { SuccessStory } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const initialForm: Partial<SuccessStory> = {
    name: '',
    studentName: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    country: 'United Kingdom',
    university: 'University of Oxford',
    program: 'MSc Advanced Computer Science',
    scholarship: '£10,000 Global Award',
    scholarshipAmount: '£10,000 Global Award',
    visaGrantTime: '12 Days Visa Granted',
    visaResult: '12 Days Visa Granted',
    testimonial: 'FCC Global Education guided me through university shortlisting and visa filing with incredible precision.',
    quote: 'From application to visa stamp, the experience was seamless.',
    rating: 5,
    featured: true,
    published: true,
    videoUrl: ''
  };

  const [form, setForm] = useState<Partial<SuccessStory>>(initialForm);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stories');
      const data = await res.json();
      if (data.success) {
        setStories(data.stories || data.successStories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openAddModal = () => {
    setEditingStory(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (s: SuccessStory) => {
    setEditingStory(s);
    const studentName = s.studentName || s.name || '';
    const studentPhoto = s.studentPhoto || s.image || '';
    const visaResult = s.visaGrantTime || s.visaResult || '';
    const scholarship = s.scholarship || s.scholarshipAmount || '';

    setForm({
      ...s,
      name: studentName,
      studentName,
      image: studentPhoto,
      studentPhoto,
      visaGrantTime: visaResult,
      visaResult,
      scholarship,
      scholarshipAmount: scholarship,
      testimonial: s.testimonial || s.quote || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentName = form.studentName?.trim() || form.name?.trim() || '';
    const university = form.university?.trim() || '';
    const country = form.country?.trim() || '';

    if (!studentName || !university || !country) {
      alert('Please fill student name, university, and country');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        id: editingStory?.id || undefined,
        name: studentName,
        studentName,
        university,
        country,
        image: form.image || form.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        studentPhoto: form.studentPhoto || form.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        visaGrantTime: form.visaGrantTime || form.visaResult || 'Visa Granted',
        visaResult: form.visaResult || form.visaGrantTime || 'Visa Granted',
        scholarship: form.scholarship || form.scholarshipAmount || '',
        scholarshipAmount: form.scholarship || form.scholarshipAmount || '',
        testimonial: form.testimonial || form.quote || '',
        quote: form.testimonial || form.quote || '',
      };

      const method = editingStory ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/stories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
        fetchStories();
      } else {
        alert(data.error || 'Failed to save story');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;
    try {
      const res = await fetch(`/api/admin/stories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStories(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (story: SuccessStory) => {
    try {
      const updated = { ...story, published: story.published === false ? true : false };
      const res = await fetch('/api/admin/stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setStories(prev => prev.map(s => s.id === story.id ? { ...s, published: updated.published } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = stories.filter(s => {
    const studentName = s.studentName || s.name || '';
    const university = s.university || '';
    const country = s.country || '';
    const program = s.program || '';
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      studentName.toLowerCase().includes(q) ||
      university.toLowerCase().includes(q) ||
      country.toLowerCase().includes(q) ||
      program.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Success Stories CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Student testimonials, university admits, visa grants, and scholarship success records displayed on website.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="/success-stories"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>View Live Page</span>
          </a>
          <button
            type="button"
            onClick={fetchStories}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ Add Story</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Success story saved successfully and updated live on the website!</span>
        </div>
      )}

      {/* Search Bar with Instant Clear */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, university, program, or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 shadow-2xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">University & Country</th>
                <th className="py-3 px-4">Program & Visa</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading success stories...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    {search ? (
                      <div className="space-y-2">
                        <p>No success stories match &ldquo;{search}&rdquo;</p>
                        <button
                          type="button"
                          onClick={() => setSearch('')}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                        >
                          Clear Search Filter
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>No success stories found in database.</p>
                        <button
                          type="button"
                          onClick={openAddModal}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
                        >
                          + Add First Student Story
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const studentName = s.studentName || s.name || 'Student';
                  const studentPhoto = s.studentPhoto || s.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400';
                  const visaText = s.visaGrantTime || s.visaResult || 'Visa Granted';
                  const isPub = s.published !== false;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={studentPhoto} 
                            alt={studentName} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs" 
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{studentName}</div>
                            {s.featured && (
                              <span className="text-[10px] text-amber-600 font-bold">★ Featured on Home</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-xs">{s.university}</div>
                        <div className="text-[11px] text-slate-500">{s.country}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="font-medium text-slate-800">{s.program || 'Degree Program'}</div>
                        <div className="text-emerald-700 font-semibold text-[11px]">{visaText}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-amber-500 text-xs gap-1 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{s.rating || 5}.0</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => togglePublish(s)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                          {isPub ? 'Published' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg inline-flex items-center transition mr-1 cursor-pointer"
                          title="Edit Story"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center transition cursor-pointer"
                          title="Delete Story"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                {editingStory ? `Edit Story: ${editingStory.studentName || editingStory.name}` : 'Add Student Success Story'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name || form.studentName || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value, studentName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Country Destination *</label>
                  <input
                    type="text"
                    required
                    value={form.country || ''}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. United Kingdom, Australia, USA"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">University Admitted *</label>
                  <input
                    type="text"
                    required
                    value={form.university || ''}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    placeholder="e.g. University of Oxford"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Degree & Program</label>
                  <input
                    type="text"
                    value={form.program || ''}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    placeholder="e.g. MSc Data Science"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Student Photo with Direct Upload */}
              <div>
                <ImageUploadInput
                  label="Student Photo (Upload or URL)"
                  value={form.image || form.studentPhoto || ''}
                  onChange={(url) => setForm({ ...form, image: url, studentPhoto: url })}
                  placeholder="Upload student photo or enter URL..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Visa Grant Highlight</label>
                  <input
                    type="text"
                    value={form.visaGrantTime || form.visaResult || ''}
                    onChange={(e) => setForm({ ...form, visaGrantTime: e.target.value, visaResult: e.target.value })}
                    placeholder="e.g. 10 Days Visa Approved"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Scholarship Awarded (optional)</label>
                  <input
                    type="text"
                    value={form.scholarship || form.scholarshipAmount || ''}
                    onChange={(e) => setForm({ ...form, scholarship: e.target.value, scholarshipAmount: e.target.value })}
                    placeholder="e.g. £8,000 Vice Chancellor Award"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Testimonial Quote / Review</label>
                <textarea
                  rows={3}
                  value={form.testimonial || form.quote || ''}
                  onChange={(e) => setForm({ ...form, testimonial: e.target.value, quote: e.target.value })}
                  placeholder="Student review of the consultancy guidance and visa process..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured ?? false}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                  <span className="text-slate-700 font-bold text-xs">Featured on Homepage</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published ?? true}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className="text-slate-700 font-bold text-xs">
                    {form.published ? 'Published Live' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingStory ? 'Save Changes' : 'Create & Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
