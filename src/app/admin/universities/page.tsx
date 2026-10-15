'use client';

import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, Eye, RefreshCw, Filter, Building2, MapPin, 
  Award, DollarSign, BookOpen, FileCheck, Star, HelpCircle,
  ExternalLink, Layers, X, MoveUp, MoveDown
} from 'lucide-react';
import { University, Country } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

interface ScholarshipItem {
  title: string;
  amount: string;
  eligibility: string;
  deadline: string;
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'academics' | 'financials'>('basic');

  const defaultScholarship: ScholarshipItem = {
    title: 'International Student Merit Scholarship',
    amount: 'Up to £5,000 / year',
    eligibility: 'Merit-based for international students with high GPA.',
    deadline: 'Rolling / Intake Deadlines',
  };

  const initialForm: any = {
    name: '',
    slug: '',
    country: 'United Kingdom',
    city: 'Campus City',
    worldRank: 50,
    rankingBadge: 'QS World #50',
    acceptanceRate: '65%',
    order: 1,
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200',
    overview: '',
    highlights: 'World-class academic faculty & state-of-the-art labs\nHigh graduate employability with dedicated career mentoring\nGlobal alumni network across multinational enterprises',
    popularPrograms: 'Computer Science & Software, Business Administration (MBA), Data Analytics, Finance',
    entryAcademic: 'Minimum 65% – 70% in prior degree or qualification.',
    entryEnglish: 'IELTS Academic 6.5 overall (minimum 6.0 in each component) or TOEFL equivalent.',
    entryStandardized: 'Subject aptitude test (if mandated by department).',
    tuitionUg: '£18,000 – £28,000 / year',
    tuitionPg: '£20,000 – £32,000 / year',
    livingCostEstimate: '£1,100 – £1,500 / month',
    scholarships: [defaultScholarship],
    officialRep: true,
    featured: false,
    published: true,
    website: 'https://',
    seoTitle: '',
    seoDescription: ''
  };

  const [form, setForm] = useState<any>(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, cRes] = await Promise.all([
        fetch('/api/admin/universities'),
        fetch('/api/admin/countries')
      ]);
      const uData = await uRes.json();
      const cData = await cRes.json();
      if (uData.success) {
        const sorted = (uData.universities || []).sort(
          (a: any, b: any) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999)
        );
        setUniversities(sorted);
      }
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

  const handleQuickOrderChange = async (slugOrId: string, newOrder: number) => {
    setUniversities((prev) => {
      const updated = prev.map((u) =>
        u.slug === slugOrId || u.id === slugOrId
          ? { ...u, order: newOrder, sortOrder: newOrder }
          : u
      );
      return updated.sort((a, b) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999));
    });

    try {
      await fetch('/api/admin/universities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slugOrId, id: slugOrId, order: newOrder, sortOrder: newOrder }),
      });
    } catch (err) {
      console.error('Failed to update university order', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= universities.length) return;

    const newUnis = [...universities];
    const current = newUnis[index];
    const target = newUnis[targetIndex];

    const currentOrder = current.order ?? current.sortOrder ?? index + 1;
    const targetOrder = target.order ?? target.sortOrder ?? targetIndex + 1;

    current.order = targetOrder;
    current.sortOrder = targetOrder;
    target.order = currentOrder === targetOrder ? (direction === 'up' ? targetOrder + 1 : targetOrder - 1) : currentOrder;
    target.sortOrder = target.order;

    newUnis.sort((a, b) => (a.order ?? a.sortOrder ?? 999) - (b.order ?? b.sortOrder ?? 999));
    setUniversities(newUnis);

    try {
      await fetch('/api/admin/universities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          items: newUnis.map((u, idx) => ({ id: u.id, slug: u.slug, order: idx + 1 })),
        }),
      });
    } catch (err) {
      console.error('Failed to reorder universities', err);
    }
  };

  const openAddModal = () => {
    setEditingUni(null);
    setForm({
      ...initialForm,
      order: universities.length + 1,
      country: countries[0]?.name || 'United Kingdom',
      scholarships: [{ ...defaultScholarship }]
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setEditingUni(u);

    // Extract Tuition
    const ug = typeof u.tuition === 'object' && u.tuition
      ? u.tuition.undergraduate || ''
      : (typeof u.tuition === 'string' ? u.tuition : (u.tuitionRange || ''));
    const pg = typeof u.tuition === 'object' && u.tuition
      ? u.tuition.postgraduate || ''
      : (typeof u.tuition === 'string' ? u.tuition : '');

    // Extract Highlights
    const hl = Array.isArray(u.highlights)
      ? u.highlights.join('\n')
      : (typeof u.highlights === 'string' ? u.highlights : '');

    // Extract Programs
    const progs = Array.isArray(u.popularPrograms)
      ? u.popularPrograms.join(', ')
      : (typeof u.popularPrograms === 'string' ? u.popularPrograms : '');

    // Extract Requirements
    const reqAcademic = typeof u.entryRequirements === 'object' && u.entryRequirements
      ? u.entryRequirements.academic || ''
      : (typeof u.entryRequirements === 'string' ? u.entryRequirements : '');
    const reqEnglish = typeof u.entryRequirements === 'object' && u.entryRequirements
      ? u.entryRequirements.english || ''
      : '';
    const reqStandard = typeof u.entryRequirements === 'object' && u.entryRequirements
      ? u.entryRequirements.standardizedTests || ''
      : '';

    // Extract Scholarships
    let schList: ScholarshipItem[] = [];
    if (Array.isArray(u.scholarships) && u.scholarships.length > 0) {
      schList = u.scholarships.map((s: any) => {
        if (typeof s === 'string') {
          return { title: 'Merit Grant', amount: 'Partial Tuition', eligibility: s, deadline: 'Rolling' };
        }
        return {
          title: s.title || 'Scholarship',
          amount: s.amount || '',
          eligibility: s.eligibility || '',
          deadline: s.deadline || ''
        };
      });
    } else if (typeof u.scholarships === 'string' && u.scholarships.trim()) {
      schList = [{ title: 'Academic Scholarships', amount: 'Partial Tuition', eligibility: u.scholarships, deadline: 'Rolling' }];
    } else {
      schList = [{ ...defaultScholarship }];
    }

    setForm({
      ...u,
      id: u.id,
      name: u.name || '',
      slug: u.slug || '',
      country: u.country || 'United Kingdom',
      city: u.city || '',
      worldRank: u.worldRank || '',
      rankingBadge: u.rankingBadge || (u.ranking ? u.ranking : (u.worldRank ? `QS World #${u.worldRank}` : '')),
      acceptanceRate: u.acceptanceRate || '65%',
      order: u.order ?? u.sortOrder ?? 1,
      logo: u.logo || '',
      image: u.image || u.coverImage || '',
      overview: u.overview || u.description || '',
      highlights: hl,
      popularPrograms: progs,
      entryAcademic: reqAcademic,
      entryEnglish: reqEnglish,
      entryStandardized: reqStandard,
      tuitionUg: ug,
      tuitionPg: pg,
      livingCostEstimate: u.livingCostEstimate || '',
      scholarships: schList,
      officialRep: u.officialRep ?? true,
      featured: u.featured ?? false,
      published: u.published ?? true,
      website: u.website || '',
      seoTitle: u.seoTitle || '',
      seoDescription: u.seoDescription || ''
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSlugGenerate = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setForm((prev: any) => ({
      ...prev,
      name,
      slug: prev.slug && editingUni ? prev.slug : slug,
      seoTitle: `${name} Admissions, Ranking & Tuition Guide`,
      seoDescription: `Official study abroad information for ${name}. Explore tuition fees, ranking, entry requirements, and scholarships.`
    }));
  };

  const addScholarshipField = () => {
    setForm((prev: any) => ({
      ...prev,
      scholarships: [...(prev.scholarships || []), { title: '', amount: '', eligibility: '', deadline: '' }]
    }));
  };

  const removeScholarshipField = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      scholarships: prev.scholarships.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateScholarshipField = (index: number, field: keyof ScholarshipItem, val: string) => {
    setForm((prev: any) => {
      const updated = [...(prev.scholarships || [])];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, scholarships: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.country) {
      alert('Please fill required fields (Name, Slug, Country)');
      return;
    }

    setSubmitting(true);
    try {
      // Format payload properly
      const cleanOrder = Number(form.order) || 1;
      const payload = {
        ...form,
        order: cleanOrder,
        sortOrder: cleanOrder,
        image: form.image || form.coverImage,
        coverImage: form.image || form.coverImage,
        overview: form.overview || form.description,
        description: form.overview || form.description,
        rankingBadge: form.rankingBadge || (form.worldRank ? `QS World #${form.worldRank}` : '#50 QS World'),
        tuition: {
          undergraduate: form.tuitionUg || '$25,000 / year',
          postgraduate: form.tuitionPg || form.tuitionUg || '$28,000 / year',
        },
        tuitionRange: `${form.tuitionUg || '$20,000'} - ${form.tuitionPg || '$30,000'}`,
        livingCostEstimate: form.livingCostEstimate || '$1,200 / month',
        highlights: typeof form.highlights === 'string'
          ? form.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : form.highlights,
        popularPrograms: typeof form.popularPrograms === 'string'
          ? form.popularPrograms.split(',').map((s: string) => s.trim()).filter(Boolean)
          : form.popularPrograms,
        entryRequirements: {
          academic: form.entryAcademic || 'Minimum academic qualifications required.',
          english: form.entryEnglish || 'Standard English language proficiency required.',
          standardizedTests: form.entryStandardized || '',
        },
        scholarships: form.scholarships && form.scholarships.length > 0 ? form.scholarships : [defaultScholarship],
      };

      const method = editingUni ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/universities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to save university');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (targetId: string, slug?: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    try {
      const res = await fetch(`/api/admin/universities?slug=${slug || targetId}&id=${targetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUniversities(prev => prev.filter(u => u.id !== targetId && u.slug !== (slug || targetId)));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (uni: University) => {
    try {
      const updated = { ...uni, published: !uni.published };
      const res = await fetch('/api/admin/universities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setUniversities(prev => prev.map(u => u.id === uni.id ? updated : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = universities.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || u.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-amber-400" />
            Partner Universities CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage partner institutions, course offerings, rankings, tuition, entry requirements, and dedicated profiles.
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
            Add University
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search universities by name, city, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-500 transition"
          >
            <option value="all">All Countries ({universities.length})</option>
            {countries.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-28">Order</th>
                <th className="py-3 px-4">University</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Ranking</th>
                <th className="py-3 px-4">Tuition</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Loading institutions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No universities found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((u, index) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                            title="Move University Up"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === filtered.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                            title="Move University Down"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="number"
                          min={1}
                          value={u.order ?? u.sortOrder ?? index + 1}
                          onChange={(e) => handleQuickOrderChange(u.slug || u.id, parseInt(e.target.value) || 1)}
                          className="w-14 px-1.5 py-1 text-center bg-slate-950 border border-slate-700 hover:border-amber-500/60 focus:border-amber-500 rounded-lg text-amber-400 font-black text-xs focus:outline-none transition"
                          title="Display order number on Homepage (1 = first)"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image || u.logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100'}
                          alt={u.name}
                          className="w-10 h-7 rounded object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.officialRep && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                                Partner
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-500 font-mono">/universities/{u.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{u.country}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{u.city}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-amber-400 font-medium">
                        {u.rankingBadge || (u.worldRank ? `QS #${u.worldRank}` : '—')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {typeof u.tuition === 'object' && u.tuition ? u.tuition.postgraduate || u.tuition.undergraduate : (typeof u.tuition === 'string' ? u.tuition : '—')}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.featured ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1 w-fit">
                          <Star className="w-3 h-3 fill-amber-400" /> Featured
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublish(u)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition ${
                          u.published !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {u.published !== false ? (
                          <><CheckCircle2 className="w-3 h-3" /> Active</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={`/universities/${u.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="View Public Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg inline-flex items-center transition mr-1"
                        title="Edit University"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.slug)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg inline-flex items-center transition"
                        title="Delete University"
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

      {/* Comprehensive Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  {editingUni ? `Edit University: ${editingUni.name}` : 'Add New Partner University'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure academic profile, entrance criteria, tuition costs, and distinction badges.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-4 font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'basic'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Basic Info & Media</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('academics')}
                className={`py-3 px-4 font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'academics'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Academics & Requirements</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('financials')}
                className={`py-3 px-4 font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'financials'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>3. Tuition & Scholarships</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* TAB 1: BASIC INFO & MEDIA */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* Row 1: Name & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">University Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name || ''}
                        onChange={(e) => handleSlugGenerate(e.target.value)}
                        placeholder="e.g. University of Oxford"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Slug (URL path) *</label>
                      <input
                        type="text"
                        required
                        value={form.slug || ''}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="e.g. oxford"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 2: Country, City, Acceptance Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Country Destination *</label>
                      <select
                        value={form.country || ''}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        {countries.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">City / Location</label>
                      <input
                        type="text"
                        value={form.city || ''}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Oxford, England"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Acceptance Rate</label>
                      <input
                        type="text"
                        value={form.acceptanceRate || ''}
                        onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })}
                        placeholder="e.g. 14.2% Acceptance Rate"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Row 3: World Rank, Ranking Badge & Display Order */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">QS World Rank (Number)</label>
                      <input
                        type="number"
                        value={form.worldRank || ''}
                        onChange={(e) => setForm({ ...form, worldRank: e.target.value })}
                        placeholder="e.g. 3"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Ranking Display Badge</label>
                      <input
                        type="text"
                        value={form.rankingBadge || ''}
                        onChange={(e) => setForm({ ...form, rankingBadge: e.target.value })}
                        placeholder="e.g. QS World #3 | Times Higher Ed #1"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Display Order (Homepage)</label>
                      <input
                        type="number"
                        min={1}
                        value={form.order || 1}
                        onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                        placeholder="1"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Overview */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Institution Overview</label>
                    <textarea
                      rows={3}
                      value={form.overview || ''}
                      onChange={(e) => setForm({ ...form, overview: e.target.value })}
                      placeholder="Comprehensive overview of academic heritage, collegiate system, research reputation, and global alumni network..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  {/* Images Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploadInput
                      label="University Crest / Logo"
                      value={form.logo || ''}
                      onChange={(url) => setForm({ ...form, logo: url })}
                      placeholder="https://... or upload crest logo"
                      category="universities"
                      dark={true}
                      helperText="Square emblem or official badge"
                    />
                    <ImageUploadInput
                      label="Campus Cover Photo"
                      value={form.image || ''}
                      onChange={(url) => setForm({ ...form, image: url })}
                      placeholder="https://... or upload campus photo"
                      category="universities"
                      dark={true}
                      helperText="Campus landmark photo for hero banner and directory cards"
                    />
                  </div>

                  {/* Website & Status Toggles */}
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="officialRep"
                        checked={form.officialRep ?? true}
                        onChange={(e) => setForm({ ...form, officialRep: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                      />
                      <label htmlFor="officialRep" className="text-slate-300 font-semibold cursor-pointer">
                        Official Partner Institution
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={form.featured ?? false}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                      />
                      <label htmlFor="featured" className="text-slate-300 font-semibold cursor-pointer">
                        Featured on Homepage
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="published"
                        checked={form.published ?? true}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                      />
                      <label htmlFor="published" className="text-slate-300 font-semibold cursor-pointer">
                        Published (Active)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACADEMICS & ENTRY REQUIREMENTS */}
              {activeTab === 'academics' && (
                <div className="space-y-4">
                  {/* Institutional Distinctions (Why Study Here?) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">
                        Institutional Distinctions / Why Study Here? (1 line per point)
                      </label>
                      <span className="text-[10px] text-amber-400 font-medium">Rendered as checklist cards on page</span>
                    </div>
                    <textarea
                      rows={4}
                      value={form.highlights || ''}
                      onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                      placeholder={"World-famous one-on-one tutorial pedagogy\n38 historic constituent colleges with self-governing communities\nBodleian Library housing over 13 million printed volumes\nMassive global alumni network with direct industry pipelines"}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Each line entered here will appear as a distinctive bullet point in the "Why Study at [University]?" section.
                    </p>
                  </div>

                  {/* Flagship Academic Disciplines / Popular Programs */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Flagship Academic Disciplines / Popular Programs (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.popularPrograms || ''}
                      onChange={(e) => setForm({ ...form, popularPrograms: e.target.value })}
                      placeholder="e.g. Philosophy, Politics and Economics (PPE), Computer Science & Advanced Software, MSc Financial Economics (MFE)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Tags displayed on university cards and flagship disciplines grid.
                    </p>
                  </div>

                  {/* Admission & Entry Requirements Section */}
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-200 font-bold border-b border-slate-800 pb-2">
                      <FileCheck className="w-4 h-4 text-blue-400" />
                      <span>Admission & Entry Requirements</span>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Academic Minimums</label>
                      <textarea
                        rows={2}
                        value={form.entryAcademic || ''}
                        onChange={(e) => setForm({ ...form, entryAcademic: e.target.value })}
                        placeholder="e.g. AAA to A*A*A at A-level (or 38–40 IB points / 90%+ in High School Board exams). For Masters: UK First Class or 2:1 equivalent (3.7+ CGPA)."
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">English Language Proficiency</label>
                      <textarea
                        rows={2}
                        value={form.entryEnglish || ''}
                        onChange={(e) => setForm({ ...form, entryEnglish: e.target.value })}
                        placeholder="e.g. IELTS Academic: 7.5 overall with minimum 7.0 in each sub-component (or TOEFL iBT 110)."
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Standardized Testing (Optional)</label>
                      <input
                        type="text"
                        value={form.entryStandardized || ''}
                        onChange={(e) => setForm({ ...form, entryStandardized: e.target.value })}
                        placeholder="e.g. UCAT, LNAT, MAT, or TSA depending on undergraduate program."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TUITION, LIVING COSTS & SCHOLARSHIPS */}
              {activeTab === 'financials' && (
                <div className="space-y-4">
                  {/* Tuition & Living Cost Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Undergraduate Tuition</label>
                      <input
                        type="text"
                        value={form.tuitionUg || ''}
                        onChange={(e) => setForm({ ...form, tuitionUg: e.target.value })}
                        placeholder="e.g. £28,950 – £44,240 / year"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Postgraduate / Masters Tuition</label>
                      <input
                        type="text"
                        value={form.tuitionPg || ''}
                        onChange={(e) => setForm({ ...form, tuitionPg: e.target.value })}
                        placeholder="e.g. £30,050 – £48,500 / year"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Estimated Living Cost</label>
                      <input
                        type="text"
                        value={form.livingCostEstimate || ''}
                        onChange={(e) => setForm({ ...form, livingCostEstimate: e.target.value })}
                        placeholder="e.g. £1,290 – £1,840 / month"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Scholarships List */}
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-slate-200 font-bold">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Scholarships & Grants</span>
                      </div>
                      <button
                        type="button"
                        onClick={addScholarshipField}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[11px] font-semibold flex items-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3" /> Add Scholarship
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(form.scholarships || []).map((sch: ScholarshipItem, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/90 space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Scholarship #{idx + 1}
                            </span>
                            {form.scholarships.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeScholarshipField(idx)}
                                className="text-red-400 hover:text-red-300 text-[11px] font-semibold"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text"
                                value={sch.title || ''}
                                onChange={(e) => updateScholarshipField(idx, 'title', e.target.value)}
                                placeholder="Scholarship Title (e.g. Clarendon Fund Scholarships)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={sch.amount || ''}
                                onChange={(e) => updateScholarshipField(idx, 'amount', e.target.value)}
                                placeholder="Amount (e.g. 100% Tuition + Annual Living Grant)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                value={sch.eligibility || ''}
                                onChange={(e) => updateScholarshipField(idx, 'eligibility', e.target.value)}
                                placeholder="Eligibility (e.g. Outstanding academic merit; all nationalities)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={sch.deadline || ''}
                                onChange={(e) => updateScholarshipField(idx, 'deadline', e.target.value)}
                                placeholder="Deadline (e.g. December / January)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'financials' ? 'academics' : 'basic')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    >
                      ← Previous Tab
                    </button>
                  )}
                  {activeTab !== 'financials' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'basic' ? 'academics' : 'financials')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Next: {activeTab === 'basic' ? 'Academics →' : 'Financials →'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
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
                    {submitting ? 'Saving...' : editingUni ? 'Save University Profile' : 'Publish University'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
