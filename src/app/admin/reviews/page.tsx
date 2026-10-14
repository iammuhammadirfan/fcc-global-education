'use client';

import React, { useEffect, useState } from 'react';
import { 
  Star, Search, CheckCircle2, XCircle, Trash2, Edit3, Plus, 
  RefreshCw, Filter, Clock, Home, Building2, Globe, AlertCircle, Eye, X
} from 'lucide-react';
import { Review, University, Country } from '@/lib/types';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'home'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: '',
    email: '',
    rating: 5,
    country: 'United Kingdom',
    university: 'University of Oxford',
    program: '',
    comment: '',
    status: 'approved',
    published: true,
    showOnHome: true,
  };

  const [form, setForm] = useState<any>(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rRes, uRes, cRes] = await Promise.all([
        fetch('/api/admin/reviews'),
        fetch('/api/admin/universities'),
        fetch('/api/admin/countries'),
      ]);
      const rData = await rRes.json();
      const uData = await uRes.json();
      const cData = await cRes.json();

      if (rData.success) setReviews(rData.reviews || []);
      if (uData.success) setUniversities(uData.universities || []);
      if (cData.success) setCountries(cData.countries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    const defaultCountry = countries[0]?.name || 'United Kingdom';
    const countryUnis = universities.filter(
      (u) => u.country?.toLowerCase() === defaultCountry.toLowerCase()
    );
    setForm({
      ...initialForm,
      country: defaultCountry,
      university: countryUnis[0]?.name || universities[0]?.name || 'University of Oxford',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r: Review) => {
    setEditingReview(r);
    const country = r.country || countries[0]?.name || 'United Kingdom';
    const countryUnis = universities.filter(
      (u) => u.country?.toLowerCase() === country.toLowerCase()
    );
    setForm({
      ...r,
      rating: r.rating || 5,
      country,
      university: r.university || countryUnis[0]?.name || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.comment) {
      alert('Name and review comment are required');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingReview ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to save review');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickApprove = async (r: Review) => {
    try {
      const updated = {
        id: r.id,
        status: 'approved',
        published: true,
        showOnHome: true,
      };
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((item) => (item.id === r.id ? { ...item, status: 'approved', published: true, showOnHome: true } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHome = async (r: Review) => {
    try {
      const updated = {
        id: r.id,
        showOnHome: !r.showOnHome,
      };
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((item) => (item.id === r.id ? { ...item, showOnHome: !r.showOnHome } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved' || r.published === true).length;
  const homeCount = reviews.filter((r) => r.showOnHome === true).length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const filterUnis = countryFilter === 'all'
    ? universities
    : universities.filter((u) => u.country?.toLowerCase() === countryFilter.toLowerCase());

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.university?.toLowerCase().includes(search.toLowerCase()) ||
      r.country?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());

    const matchesCountry = countryFilter === 'all' || r.country?.toLowerCase() === countryFilter.toLowerCase();
    const matchesUni = universityFilter === 'all' || r.university?.toLowerCase() === universityFilter.toLowerCase();

    if (!matchesCountry || !matchesUni) return false;

    if (statusFilter === 'pending') return matchesSearch && r.status === 'pending';
    if (statusFilter === 'approved') return matchesSearch && (r.status === 'approved' || r.published === true);
    if (statusFilter === 'rejected') return matchesSearch && r.status === 'rejected';
    if (statusFilter === 'home') return matchesSearch && r.showOnHome === true;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            Student Reviews & Ratings CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review, verify, and publish real student ratings submitted from the website and university pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
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
            Add Review
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Reviews</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{reviews.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-md">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending Verification
          </span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{pendingCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-md">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Active
          </span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{approvedCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-cyan-400" /> On Homepage
          </span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">{homeCount}</span>
        </div>
      </div>

      {/* Filter Tabs, Country/University Dropdowns & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>Pending</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'approved' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('home')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'home' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              On Homepage ({homeCount})
            </button>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Country Filter */}
            <div className="relative min-w-[150px]">
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setUniversityFilter('all');
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="all">🌍 All Countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.flag || '🌍'} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* University Filter (Dependent on Country Filter) */}
            <div className="relative min-w-[180px]">
              <select
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="all">
                  🏛️ {countryFilter === 'all' ? 'All Universities' : `All in ${countryFilter}`}
                </option>
                {filterUnis.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student & Rating</th>
                <th className="py-3 px-4">University & Country</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Homepage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    Loading student reviews...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No reviews found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition">
                    {/* Student & Rating */}
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{r.name}</span>
                          {r.verifiedStudent && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              Verified
                            </span>
                          )}
                        </div>
                        {r.email && (
                          <div className="text-[10px] text-slate-400 font-normal">{r.email}</div>
                        )}
                        <div className="flex items-center gap-0.5 text-amber-400 pt-0.5">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <Star
                              key={st}
                              className={`w-3 h-3 ${st <= (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1 font-bold">({r.rating || 5}.0)</span>
                        </div>
                      </div>
                    </td>

                    {/* University & Country */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{r.university}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span>{r.country}</span>
                        {r.program && <span>• {r.program}</span>}
                      </div>
                    </td>

                    {/* Review Comment */}
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="text-slate-300 text-xs italic line-clamp-2 leading-relaxed">
                        "{r.comment}"
                      </p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {r.status === 'pending' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit animate-pulse">
                          <Clock className="w-3 h-3" /> Pending Approval
                        </span>
                      ) : r.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                    </td>

                    {/* Homepage Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleHome(r)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 ${
                          r.showOnHome
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Home className="w-3 h-3" />
                        <span>{r.showOnHome ? 'On Homepage' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleQuickApprove(r)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition mr-1.5 shadow"
                          title="Verify and Approve Review"
                        >
                          Approve ✓
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(r)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="Edit Review"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg inline-flex items-center transition"
                        title="Delete Review"
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

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {editingReview ? 'Edit Student Review' : 'Add Student Review'}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {/* Rating selection */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Star Rating (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setForm({ ...form, rating: st })}
                      className="p-1 transition hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${st <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-amber-400 font-bold text-sm ml-2">{form.rating} / 5 Stars</span>
                </div>
              </div>

              {/* Student Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Zainab Malik"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Country & University */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Destination Country</label>
                  <select
                    value={form.country || ''}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      const matchingUnis = universities.filter(
                        (u) => u.country?.toLowerCase() === newCountry.toLowerCase()
                      );
                      setForm({
                        ...form,
                        country: newCountry,
                        university: matchingUnis[0]?.name || '',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">University</label>
                    <span className="text-[10px] text-amber-400">
                      {universities.filter((u) => u.country?.toLowerCase() === (form.country || '').toLowerCase()).length} in {form.country}
                    </span>
                  </div>
                  <select
                    value={form.university || ''}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose {form.country} University --</option>
                    {universities
                      .filter((u) => u.country?.toLowerCase() === (form.country || '').toLowerCase())
                      .map((u) => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    <option value="Other">Other / Not in list</option>
                  </select>
                </div>
              </div>

              {/* Program */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Program / Course (Optional)</label>
                <input
                  type="text"
                  value={form.program || ''}
                  onChange={(e) => setForm({ ...form, program: e.target.value })}
                  placeholder="e.g. MSc Data Science / BA Economics"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Student Feedback Comment *</label>
                <textarea
                  rows={4}
                  required
                  value={form.comment || ''}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Detailed student feedback regarding university counseling, visa support, and mock interviews..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Status and Flags */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Approval Status</label>
                  <select
                    value={form.status || 'approved'}
                    onChange={(e) => setForm({ ...form, status: e.target.value, published: e.target.value === 'approved' })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="approved">Approved & Published</option>
                    <option value="pending">Pending Verification</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="pt-2">
                  <ToggleSwitch
                    checked={form.showOnHome ?? true}
                    onChange={(val) => setForm({ ...form, showOnHome: val })}
                    label="Show on Homepage"
                    description="Featured in real reviews section"
                    activeColor="amber"
                  />
                </div>
              </div>

              {/* Action buttons */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingReview ? 'Update Review' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
