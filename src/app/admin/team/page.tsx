'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, RefreshCw, Mail, Award, X, Check, ArrowRight,
  ShieldCheck, GraduationCap, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { TeamMember } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const initialFormState = {
    name: '',
    role: '',
    experience: '10+ Years in International Higher Education',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: '',
    credentialsText: '',
    specializationsText: '',
    sortOrder: 1,
    active: true,
  };

  const [form, setForm] = useState(initialFormState);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.success) {
        // Accept either team or teamMembers key
        const list = Array.isArray(data.team) ? data.team : (Array.isArray(data.teamMembers) ? data.teamMembers : []);
        setTeam(list);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setForm({
      ...initialFormState,
      sortOrder: team.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: TeamMember) => {
    setEditingMember(m);
    setForm({
      name: m.name || '',
      role: m.role || '',
      experience: m.experience || '',
      image: m.image || '',
      bio: m.bio || '',
      credentialsText: Array.isArray(m.credentials) ? m.credentials.join('\n') : (m.credentials || ''),
      specializationsText: Array.isArray(m.specializations) ? m.specializations.join(', ') : (m.specializations || m.specialization || ''),
      sortOrder: m.sortOrder || m.order || 1,
      active: m.active !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      alert('Counselor name and position/role are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...(editingMember ? { id: editingMember.id } : {}),
        name: form.name.trim(),
        role: form.role.trim(),
        experience: form.experience.trim(),
        image: form.image.trim(),
        bio: form.bio.trim(),
        credentials: form.credentialsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        specializations: form.specializationsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        sortOrder: Number(form.sortOrder || 1),
        active: form.active,
      };

      const method = editingMember ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFeedbackMsg({
          type: 'success',
          text: editingMember ? 'Counselor profile updated successfully!' : 'New counselor profile added successfully!',
        });
        setTimeout(() => setFeedbackMsg(null), 3500);
        fetchTeam();
      } else {
        alert(data.error || 'Failed to save counselor profile.');
      }
    } catch (err) {
      console.error('Error submitting counselor:', err);
      alert('A network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ type: 'success', text: `${name} has been deleted.` });
        setTimeout(() => setFeedbackMsg(null), 3500);
        fetchTeam();
      } else {
        alert(data.error || 'Failed to delete counselor.');
      }
    } catch (err) {
      console.error('Error deleting counselor:', err);
      alert('Failed to delete counselor.');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL dummy team members? The counselors section will be completely empty until you add your real team.')) {
      return;
    }
    try {
      setLoading(true);
      // Delete all members
      for (const m of team) {
        await fetch(`/api/admin/team?id=${m.id}`, { method: 'DELETE' });
      }
      setFeedbackMsg({ type: 'success', text: 'All dummy team members deleted.' });
      setTimeout(() => setFeedbackMsg(null), 3500);
      fetchTeam();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (member: TeamMember) => {
    try {
      const updated = { ...member, active: !member.active };
      const res = await fetch('/api/admin/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        fetchTeam();
      }
    } catch (err) {
      console.error('Error toggling member active:', err);
    }
  };

  const filteredTeam = team.filter((m) => {
    const q = search.toLowerCase();
    const creds = Array.isArray(m.credentials) ? m.credentials.join(' ') : '';
    const specs = Array.isArray(m.specializations) ? m.specializations.join(' ') : (m.specialization || '');
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q) ||
      (m.bio || '').toLowerCase().includes(q) ||
      creds.toLowerCase().includes(q) ||
      specs.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-900/5 border border-amber-500/20 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Advisory Council CMS
            </span>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              {team.length} Active Profiles
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Advisory Team & Counselors CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage counseling experts, leadership credentials, degrees, and specializations displayed on the About page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:text-amber-700 hover:border-amber-400 transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View on /about</span>
          </Link>
          {team.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 hover:bg-red-100 transition-all"
              title="Delete all team members"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Dummy Data</span>
            </button>
          )}
          <button
            type="button"
            onClick={fetchTeam}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Counselor</span>
          </button>
        </div>
      </div>

      {/* Success/Error Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between animate-fadeIn shadow-xs ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white ${
                feedbackMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            >
              {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
            <p className="text-xs font-bold">{feedbackMsg.text}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search counselors by name, role, degree credentials, or specialties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Team Members Grid - Exactly Matches Website Design */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading counselor profiles...</p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Counselors Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {search
                ? `No counselors matched your search "${search}". Try searching something else.`
                : 'No counselor profiles currently exist. Click "+ Add Counselor" above to create your first team member.'}
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Counselor Profile</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className={`rounded-2xl bg-white border transition-all overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                member.active !== false ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                {/* Portrait Photo Container with Experience Overlay Badge */}
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      <Users className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />
                  
                  {member.experience && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[11px] font-bold text-amber-400 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 line-clamp-1">
                        {member.experience}
                      </span>
                    </div>
                  )}

                  {/* Status Tag on Top Right */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                        member.active !== false
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-slate-700/90 text-slate-200'
                      }`}
                    >
                      {member.active !== false ? 'Live on Site' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Credentials & Certifications with Emerald Checkmarks */}
                  {member.credentials && Array.isArray(member.credentials) && member.credentials.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-slate-400" />
                        <span>Credentials & Certifications:</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-700">
                        {member.credentials.map((cred: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{cred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specializations Tags */}
                  {member.specializations && Array.isArray(member.specializations) && member.specializations.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1">
                      {member.specializations.map((spec: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => toggleActive(member)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                    member.active !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {member.active !== false ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>{member.active !== false ? 'Active' : 'Disabled'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl border border-slate-200 transition-colors"
                    title="Edit Counselor Profile"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
                    title="Delete Counselor Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Counselor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingMember ? `Edit Profile: ${editingMember.name}` : 'Add New Counselor Profile'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fill in credentials, degrees, and portrait to display this counselor on the website.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Evelyn Montgomery"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    Position / Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Founder & Chief Executive Officer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Experience Overlay Badge
                </label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="e.g. 18+ Years in International Higher Education"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Displayed as the black/amber banner at the bottom of the portrait photo.
                </span>
              </div>

              {/* Portrait Photo Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <ImageUploadInput
                  label="Portrait Photo (Upload or Enter URL)"
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  placeholder="https://... or upload counselor portrait photo"
                  category="team"
                  dark={false}
                  helperText="Recommended: vertical portrait or square aspect ratio, min 600x800px."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Professional Bio Description
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Former senior admissions evaluator at top UK and Canadian institutions with nearly two decades of experience..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Credentials & Certifications (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.credentialsText}
                  onChange={(e) => setForm({ ...form, credentialsText: e.target.value })}
                  placeholder={`PhD in International Education (Oxford)\nFormer Admissions Dean\nPIER Certified (QEAC)`}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enter each degree or certification on a new line. Each line will show with a green checkmark icon.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Specialization Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.specializationsText}
                  onChange={(e) => setForm({ ...form, specializationsText: e.target.value })}
                  placeholder="Oxbridge Admissions, Institutional Strategy, Global Scholarships"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Separate tags with commas (e.g. Oxbridge Admissions, Global Scholarships).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                    Visibility Status
                  </label>
                  <ToggleSwitch
                    checked={form.active}
                    onChange={(val) => setForm({ ...form, active: val })}
                    label="Active Profile"
                    description="Show on the public About page"
                    activeColor="emerald"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingMember ? 'Update Counselor' : 'Add Counselor Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
