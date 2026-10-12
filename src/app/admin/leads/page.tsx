'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Save,
  MessageSquare,
  Send,
  Sparkles,
} from 'lucide-react';
import { Lead } from '@/lib/types';

const LEAD_REPLY_TEMPLATES = [
  {
    name: 'Consultation & Initial Review Offer',
    subject: 'Response to Your Study Abroad Inquiry | FCC Global Education',
    message: `Thank you for contacting FCC Global Education regarding your prospective academic journey.

Our senior admissions committee has reviewed your inquiry. We would be delighted to arrange a complimentary 30-minute video strategy consultation with our senior advisor to discuss:
1. Target university course offerings and entry requirements.
2. Merit scholarship eligibility and fee waiver options.
3. 2026/2027 application deadlines and student visa procedures.

Please feel free to choose a convenient consultation slot directly on our booking calendar, or reply to this email with any questions.`,
  },
  {
    name: 'Document Request & Eligibility Audit',
    subject: 'Document Audit for Your Admissions Application | FCC Global Education',
    message: `Thank you for your inquiry with FCC Global Education.

To evaluate your eligibility for top-tier universities and assess scholarship feasibility, kindly reply with clear copies of:
• Your latest academic transcripts and degree certificates.
• English language test results (IELTS / TOEFL / PTE), if already taken.
• Your updated academic CV.

Once received, our credential evaluation team will formulate a personalized shortlisting report within 48 hours.`,
  },
];

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<any>('new');
  const [saving, setSaving] = useState(false);

  // Reply Modal State
  const [replyModalLead, setReplyModalLead] = useState<Lead | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [counselorName, setCounselorName] = useState('Senior Admissions Advisor');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleOpenReplyModal = (lead: Lead) => {
    setReplyModalLead(lead);
    setReplySubject(`Re: Study Abroad Inquiry (${lead.targetCountry || 'International Admissions'})`);
    setReplyMessage(
      `Dear ${lead.fullName},\n\nThank you for reaching out to FCC Global Education regarding your prospective study journey in ${lead.targetCountry || 'your chosen destination'}.\n\nOur senior counseling committee has reviewed your inquiry. We would love to evaluate your academic transcripts and guide you on top university options, scholarship opportunities, and student visa compliance.\n\nPlease let us know your availability for a quick 30-minute video session, or reply directly with your latest marks sheets.\n\nWarm regards,\nFCC Global Education Directorate`
    );
    setReplyFeedback(null);
  };

  const handleApplyReplyTemplate = (tmpl: (typeof LEAD_REPLY_TEMPLATES)[0]) => {
    if (!replyModalLead) return;
    setReplySubject(tmpl.subject);
    const country = replyModalLead.targetCountry || 'your target destination';
    setReplyMessage(tmpl.message.replace(/\{\{country\}\}/g, country));
  };

  const handleSendReply = async () => {
    if (!replyModalLead || !replyMessage.trim()) return;
    setSendingReply(true);
    setReplyFeedback(null);

    try {
      const res = await fetch('/api/admin/leads/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: replyModalLead.id,
          email: replyModalLead.email,
          studentName: replyModalLead.fullName,
          subject: replySubject,
          replyMessage,
          counselorName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyFeedback({ type: 'success', text: data.message || 'Email reply dispatched successfully!' });
        if (data.updatedLead) {
          setLeads((prev) =>
            prev.map((l) => (l.id === replyModalLead.id ? data.updatedLead : l))
          );
          if (activeLead?.id === replyModalLead.id) {
            setActiveLead(data.updatedLead);
          }
        }
        setTimeout(() => {
          setReplyModalLead(null);
          setReplyFeedback(null);
        }, 1800);
      } else {
        setReplyFeedback({ type: 'error', text: data.error || 'Failed to dispatch email reply.' });
      }
    } catch (err: any) {
      setReplyFeedback({ type: 'error', text: err?.message || 'Network error sending reply.' });
    } finally {
      setSendingReply(false);
    }
  };

  const fetchLeads = () => {
    setLoading(true);
    let url = '/api/leads?';
    if (statusFilter !== 'all') url += `status=${statusFilter}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setLeads(d.leads);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleOpenLead = (lead: Lead) => {
    setActiveLead(lead);
    setEditNotes(lead.notes || '');
    setEditStatus(lead.status);
  };

  const handleSaveLead = async () => {
    if (!activeLead) return;
    setSaving(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLead.id,
          status: editStatus,
          notes: editNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === activeLead.id ? data.lead : l))
        );
        setActiveLead(data.lead);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this student lead?')) return;
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (activeLead?.id === id) setActiveLead(null);
  };

  const statuses = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'follow_up', label: 'Follow-up' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'converted', label: 'Converted' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Student Leads & Inquiries CRM</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Capture, qualify, assign, and track student prospective applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/backup?type=leads&format=csv"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, email, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </form>
      </div>

      {/* Leads Table */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No student leads found matching current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Destination & Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-400">From: {lead.currentCountry || 'Unspecified'}</div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-amber-400 block">{lead.targetCountry}</span>
                      <span className="text-[11px] text-slate-400">{lead.studyLevel}</span>
                      {lead.program && <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">{lead.program}</span>}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'new'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : lead.status === 'qualified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : lead.status === 'converted'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : lead.status === 'contacted'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenReplyModal(lead)}
                        className="p-1.5 rounded-lg bg-slate-900 text-blue-400 hover:text-white hover:bg-slate-800"
                        title="Reply via Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenLead(lead)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                        title="View & Edit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Details Modal / Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setActiveLead(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Lead Profile Dossier
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeLead.fullName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="text-white font-medium break-all mt-0.5 block">{activeLead.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone / WA</span>
                <span className="text-white font-medium mt-0.5 block">{activeLead.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Country</span>
                <span className="text-amber-400 font-bold mt-0.5 block">{activeLead.targetCountry}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Study Level</span>
                <span className="text-white font-medium mt-0.5 block">{activeLead.studyLevel}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Score</span>
                <span className="text-white font-medium mt-0.5 block">{activeLead.academicScore || 'Not Provided'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">English Test</span>
                <span className="text-white font-medium mt-0.5 block">{activeLead.englishTest || 'Not Provided'}</span>
              </div>
            </div>

            {activeLead.message && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Student Inquiry Message:</span>
                <p className="text-slate-200 leading-relaxed italic">&quot;{activeLead.message}&quot;</p>
              </div>
            )}

            {/* Editable Status & Counselor Notes */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Update Lead Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="new">New (Needs Initial Review)</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow_up">Follow-up Scheduled</option>
                    <option value="qualified">Qualified High-Priority</option>
                    <option value="converted">Converted (Offer Enrolled)</option>
                    <option value="closed">Closed / Ineligible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Counselor Activity & Audit Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record call summary, requested university shortlist, or student documents..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenReplyModal(activeLead)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </button>
                <a
                  href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(activeLead.fullName)}%2C%20this%20is%20FCC%20Global%20Education%20regarding%20your%20study%20abroad%20inquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  WhatsApp Student
                </a>
                <button
                  onClick={handleSaveLead}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-md disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Reply via Email Modal */}
      {replyModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => !sendingReply && setReplyModalLead(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5 z-10 text-white text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">Reply via Official Email</h3>
                  <p className="text-xs text-slate-400">
                    Dispatched from FCC Global Education with luxury template & branding
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !sendingReply && setReplyModalLead(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Recipient:</span>
                <span className="font-bold text-white">{replyModalLead.fullName}</span>{' '}
                <span className="text-blue-400 font-mono">({replyModalLead.email})</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Destination Query:</span>
                <span className="text-amber-400 font-bold">{replyModalLead.targetCountry || 'Global'}</span>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Professional Reply Templates:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {LEAD_REPLY_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyReplyTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Reply Message
                </label>
                <textarea
                  rows={7}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-400 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Counselor Sign-Off Name
                </label>
                <input
                  type="text"
                  value={counselorName}
                  onChange={(e) => setCounselorName(e.target.value)}
                  placeholder="e.g. Dr. Evelyn Montgomery, Senior Advisor"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Feedback Alert */}
            {replyFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  replyFeedback.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                <span>{replyFeedback.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                disabled={sendingReply}
                onClick={() => setReplyModalLead(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sendingReply}
                onClick={handleSendReply}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingReply ? 'Dispatching Email...' : 'Send Official Email Reply'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
