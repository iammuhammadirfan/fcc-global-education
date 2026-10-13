'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  FileText,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Phone,
  Save,
} from 'lucide-react';
import { Subscriber, BroadcastCampaign } from '@/lib/types';

// Curated High-Converting Professional British/International English Templates
const EMAIL_TEMPLATES = [
  {
    id: 'scholarship-alert',
    name: 'Global University Scholarships & Tuition Fee Waivers',
    badge: 'High Value',
    subject: 'Exclusive 2026/2027 University Scholarships & Merit Tuition Waivers',
    campaignTitle: 'Unlock Up to 100% Tuition Waivers Across UK, USA, Canada & Australia',
    messageBody: `Dear Student,

We are pleased to announce that official scholarship allocations and early-applicant merit fellowships for the upcoming 2026/2027 academic intakes have now opened across our partner Russell Group (UK), Group of Eight (Australia), and U15 (Canada) universities.

Selected higher education institutions are offering:
• Merit-Based Tuition Reductions: Up to £10,000 / $15,000 annual deduction.
• Full-Ride Government & University Fellowships: Covering 100% tuition fees + living stipends for qualified STEM and Business applicants.
• Automatic Bursaries: Pre-approved for applicants submitting verified academic dossiers through FCC Global Education.

Given the competitive quota on merit awards, scholarship portfolios are assessed on a rolling basis. Our senior advisory council is offering priority eligibility audits this week to fast-track your university admissions and scholarship documentation.`,
    ctaText: 'Claim Your Scholarship Assessment',
    ctaLink: 'https://fccglobaleducation.com/book-appointment',
  },
  {
    id: 'visa-deadline',
    name: 'Urgent Admissions & Visa Intake Deadline Notice',
    badge: 'Urgent Notice',
    subject: 'Urgent Admissions Update: Final Document Deadline for Upcoming Intakes',
    campaignTitle: 'Final Priority Deadline for Global University Admissions & Visa Clearance',
    messageBody: `Dear Student,

This is an urgent operational briefing regarding university application deadlines and student visa processing timelines for the upcoming semester.

Consular immigration authorities and partner institutions have updated their compliance criteria:
• CAS (Confirmation of Acceptance for Studies) & I-20 issuance cut-offs are approaching rapidly.
• 28-day financial balance holding rules and blocked accounts must be completed prior to consular visa slot booking.
• Certain high-demand programs in Computing, Data Science, and Healthcare are nearing maximum international seat capacity.

To prevent admission deferrals and avoid consular processing delays, we strongly urge you to submit your pending transcripts and English proficiency certificates immediately. Our accredited immigration solicitors will audit your financial dossier to ensure 100% visa compliance.`,
    ctaText: 'Fast-Track My Application',
    ctaLink: 'https://fccglobaleducation.com/contact',
  },
  {
    id: 'free-consultation',
    name: 'Complimentary 1-on-1 Profile Strategy Window',
    badge: 'Mentorship',
    subject: 'Your Complimentary 1-on-1 Higher Education Mentorship Session',
    campaignTitle: 'Direct Strategy Session with Senior British & Global Admissions Directors',
    messageBody: `Dear Student,

Whether you are seeking entry into undergraduate degree pathways, postgraduate masters programs, or doctoral research, selecting the right academic institution defines your international career trajectory.

This week, FCC Global Education is hosting exclusive 1-on-1 Strategy Clinics via high-definition video conference. During your dedicated 30-minute consultation, our senior advisors will provide:
• Rigorous transcript evaluation and course syllabus matching across 12 countries.
• Personalized university shortlists categorized into Dream, Target, and Guaranteed Safe options.
• Post-Study Work Rights & immigration settlement analysis tailored to your chosen destination.
• IELTS / TOEFL waiver eligibility assessment based on your medium of instruction.

Spaces are strictly limited to ensure individualized attention for each prospective candidate.`,
    ctaText: 'Reserve Your 1-on-1 Strategy Call',
    ctaLink: 'https://fccglobaleducation.com/book-appointment',
  },
  {
    id: 'fee-waiver',
    name: 'University Application Fee Waiver Announcement',
    badge: 'Special Offer',
    subject: 'Special Offer: 100% University Application Fee Waivers Available',
    campaignTitle: 'Apply with Zero Application Fees Across Top-Tier Global Universities',
    messageBody: `Dear Student,

As an officially accredited university representative and verified education agency, FCC Global Education is delighted to offer exclusive institutional application fee waivers for our registered applicants.

Save hundreds of pounds and dollars in application submission charges across participating universities in the United Kingdom, United States, Canada, and Ireland.

What FCC Global Education covers for you:
• 100% University Application Fee Waiver codes.
• Expert Statement of Purpose (SOP) and academic CV refinement by native British editors.
• Expedited conditional offer letter turnaround within 48 to 72 working hours.
• Comprehensive visa mock interview preparation with licensed advisors.

Connect with your dedicated counselor today to take advantage of this fee waiver window before quota limits are reached.`,
    ctaText: 'Access Fee Waivers Now',
    ctaLink: 'https://fccglobaleducation.com/book-appointment',
  },
  {
    id: 'ad-promotional-mega-offer',
    name: '📢 Advertisement: 2026 Admissions Mega Fair & £10,000 Scholarship Promo',
    badge: '🔥 Featured Ad',
    subject: '🔥 Special Advertisement Offer: 100% Free Processing & Up to £10,000 Scholarships',
    campaignTitle: 'Exclusive FCC Global Education Partner Admissions & Scholarship Advertisement',
    messageBody: `Dear Prospective Student,

Are you planning to pursue higher education in the United Kingdom, United States, Canada, Australia, or Europe in 2026/2027?

FCC Global Education is excited to launch our SPECIAL PROMOTIONAL ADMISSIONS CAMPAIGN offering unprecedented perks:

🎁 SPECIAL ADVERTISEMENT OFFER INCLUDES:
• Guaranteed University Fee Waivers: Save £150–£300 on institutional application fees.
• Early-Bird Merit Scholarships: Direct assistance securing grants up to £10,000 / $15,000.
• Free IELTS / English Waiver Audit: Qualify based on Medium of Instruction (MOI).
• Complimentary Visa File Audit: Full dossier pre-check by British Council & PIER certified counselors.

⚡ PROMO CODE: FCC-GLOBAL-PROMO-2026
Mention this promotional advertisement during your initial counseling session to unlock priority fast-track offer letters within 48 to 72 hours.

Quota is strictly limited to the first 50 eligible student applicants this month. Don't wait until international application deadlines close!`,
    ctaText: 'Claim Exclusive Advertisement Offer',
    ctaLink: 'https://fccglobaleducation.com/book-appointment',
  },
  {
    id: 'ad-ielts-waiver-promo',
    name: '🎯 Advertisement: Fast-Track University Admissions & Zero Agency Fees',
    badge: '🎯 Direct Ad',
    subject: 'Special Announcement: Fast-Track Global Admissions with 100% Free Counseling',
    campaignTitle: 'Special Advertisement Notice: Official University Representative Direct Intakes',
    messageBody: `Dear Student,

Looking for a seamless, transparent pathway to prestigious international universities? 

As official university representatives, FCC Global Education provides 100% sponsored counseling, transparent university shortlisting, and high-success visa compliance with ZERO agency charges.

🌟 WHY APPLY THROUGH FCC GLOBAL EDUCATION:
• Official Direct Representatives of 500+ Top-Ranked Institutions across 12 countries.
• 98.6% Verified Student Visa Approval Track Record with consular interview mock drills.
• Free Statement of Purpose (SOP) & Resume Polishing by native academic editors.
• Comprehensive Post-Arrival & Foreign Accommodation Booking Assistance.

Book your direct advisory session today and take the definitive step towards your global education journey.`,
    ctaText: 'Book Free Advisory Session',
    ctaLink: 'https://fccglobaleducation.com/book-appointment',
  },
];

export default function BroadcastPage() {
  const [activeTab, setActiveTab] = useState<'audience' | 'composer' | 'history'>('audience');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    newsletter: 0,
    appointment: 0,
    contact: 0,
    manual: 0,
  });
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'newsletter' | 'appointment' | 'contact' | 'manual'>('all');

  // Add Subscriber Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubPhone, setNewSubPhone] = useState('');
  const [addingSub, setAddingSub] = useState(false);

  // Campaign Composer State
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [campaignTitle, setCampaignTitle] = useState(EMAIL_TEMPLATES[0].campaignTitle);
  const [messageBody, setMessageBody] = useState(EMAIL_TEMPLATES[0].messageBody);
  const [ctaText, setCtaText] = useState(EMAIL_TEMPLATES[0].ctaText);
  const [ctaLink, setCtaLink] = useState(EMAIL_TEMPLATES[0].ctaLink);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Persistent Draft State
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Load Data & Saved Draft
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/broadcast');
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setCampaigns(data.campaigns || []);
        setStats(data.stats || { total: 0, newsletter: 0, appointment: 0, contact: 0, manual: 0 });

        // Restore saved draft if found in DB
        if (data.draft) {
          if (data.draft.subject !== undefined) setSubject(data.draft.subject);
          if (data.draft.campaignTitle !== undefined) setCampaignTitle(data.draft.campaignTitle);
          if (data.draft.messageBody !== undefined) setMessageBody(data.draft.messageBody);
          if (data.draft.ctaText !== undefined) setCtaText(data.draft.ctaText);
          if (data.draft.ctaLink !== undefined) setCtaLink(data.draft.ctaLink);
        } else {
          // Fallback to localStorage
          try {
            const local = localStorage.getItem('fcc_broadcast_draft');
            if (local) {
              const p = JSON.parse(local);
              if (p.subject !== undefined) setSubject(p.subject);
              if (p.campaignTitle !== undefined) setCampaignTitle(p.campaignTitle);
              if (p.messageBody !== undefined) setMessageBody(p.messageBody);
              if (p.ctaText !== undefined) setCtaText(p.ctaText);
              if (p.ctaLink !== undefined) setCtaLink(p.ctaLink);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Draft Helper
  const handleSaveDraft = async (silent = false) => {
    setIsSavingDraft(true);
    try {
      // 1. Instant local storage persistence
      try {
        localStorage.setItem(
          'fcc_broadcast_draft',
          JSON.stringify({ subject, campaignTitle, messageBody, ctaText, ctaLink })
        );
      } catch {}

      // 2. Database persistence via API
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_draft',
          subject,
          campaignTitle,
          messageBody,
          ctaText,
          ctaLink,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDraftSavedMsg('Draft & target link saved!');
        setTimeout(() => setDraftSavedMsg(null), 3500);
      } else if (!silent) {
        alert(data.error || 'Failed to save draft.');
      }
    } catch (err) {
      console.error(err);
      if (!silent) alert('Save failed. Please check network.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Debounced auto-save when user is typing
  useEffect(() => {
    if (!initialLoaded) return;
    const timer = setTimeout(() => {
      handleSaveDraft(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [subject, campaignTitle, messageBody, ctaText, ctaLink, initialLoaded]);

  // Filter Subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      sub.email.toLowerCase().includes(query) ||
      (sub.name && sub.name.toLowerCase().includes(query)) ||
      (sub.phone && sub.phone.toLowerCase().includes(query));
    const matchesSource = sourceFilter === 'all' || sub.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  // Handle Add Subscriber Manually
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail || !newSubEmail.includes('@')) return;
    setAddingSub(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_subscriber',
          email: newSubEmail,
          name: newSubName,
          phone: newSubPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSubEmail('');
        setNewSubName('');
        setNewSubPhone('');
        setShowAddModal(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to add subscriber');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSub(false);
    }
  };

  // Handle Delete Subscriber
  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove "${email}" from the audience?`)) return;
    try {
      const res = await fetch(`/api/admin/broadcast?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(subscribers.filter((s) => s.id !== id));
        setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Apply Template
  const handleApplyTemplate = (tmpl: (typeof EMAIL_TEMPLATES)[0]) => {
    setSubject(tmpl.subject);
    setCampaignTitle(tmpl.campaignTitle);
    setMessageBody(tmpl.messageBody);
    setCtaText(tmpl.ctaText);
    setCtaLink(tmpl.ctaLink);

    // Save template selection immediately to DB and localStorage
    try {
      localStorage.setItem(
        'fcc_broadcast_draft',
        JSON.stringify({
          subject: tmpl.subject,
          campaignTitle: tmpl.campaignTitle,
          messageBody: tmpl.messageBody,
          ctaText: tmpl.ctaText,
          ctaLink: tmpl.ctaLink,
        })
      );
    } catch {}

    fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_draft',
        subject: tmpl.subject,
        campaignTitle: tmpl.campaignTitle,
        messageBody: tmpl.messageBody,
        ctaText: tmpl.ctaText,
        ctaLink: tmpl.ctaLink,
      }),
    }).catch(console.error);
  };

  // Handle Send Broadcast
  const handleSendBroadcast = async (isTest: boolean) => {
    if (!subject.trim() || !messageBody.trim()) {
      alert('Please provide both an Email Subject and Message Body.');
      return;
    }

    if (isTest && (!testEmail || !testEmail.includes('@'))) {
      alert('Please enter a valid test email address.');
      return;
    }

    if (!isTest) {
      const count = subscribers.filter((s) => s.status === 'active').length;
      if (count === 0) {
        alert('There are no active subscribers in your audience database.');
        return;
      }
      const confirmed = confirm(
        `Are you sure you want to send this broadcast email to all ${count} unique subscriber(s) with 1 click?`
      );
      if (!confirmed) return;
    }

    setIsSending(true);
    setSendSuccess(null);
    setSendError(null);

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_broadcast',
          subject,
          campaignTitle,
          messageBody,
          ctaText,
          ctaLink,
          testEmail: isTest ? testEmail : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSendSuccess(data.message || 'Broadcast successfully dispatched!');
        if (!isTest) {
          fetchData();
        }
      } else {
        setSendError(data.error || 'Failed to dispatch broadcast.');
      }
    } catch (err: any) {
      setSendError(err?.message || 'Network error dispatching broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Mail className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Audience & Email Broadcasts
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Centralized subscriber audience database and 1-Click mass campaign dispatch branded for FCC Global Education.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setActiveTab('composer')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Create 1-Click Broadcast</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Unique</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total}</div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1 Email / User Deduplicated</span>
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Newsletter</span>
            <Mail className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.newsletter}</div>
          <p className="text-[11px] text-slate-500">Footer Subscribers</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Appointments</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.appointment}</div>
          <p className="text-[11px] text-slate-500">Consultation Bookers</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Inquiries</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.contact}</div>
          <p className="text-[11px] text-slate-500">Contact Form Queries</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Manual</span>
            <Plus className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.manual}</div>
          <p className="text-[11px] text-slate-500">Admin Added Directly</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('audience')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audience'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Audience Database ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('composer')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'composer'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>1-Click Campaign Broadcast</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Campaign History ({campaigns.length})</span>
        </button>
      </div>

      {/* TAB 1: AUDIENCE DATABASE */}
      {activeTab === 'audience' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['all', 'newsletter', 'appointment', 'contact', 'manual'] as const).map((source) => (
                  <button
                    key={source}
                    onClick={() => setSourceFilter(source)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      sourceFilter === source
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subscriber Manually</span>
            </button>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Subscriber</th>
                    <th className="py-3.5 px-6">Phone / WhatsApp</th>
                    <th className="py-3.5 px-6">Source</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Date Added</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No subscribers found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{sub.email}</div>
                          {sub.name && <div className="text-xs text-slate-400">{sub.name}</div>}
                        </td>
                        <td className="py-4 px-6">
                          {sub.phone ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={`tel:${sub.phone}`}
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                title="Click to call"
                              >
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span>{sub.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/80 transition-colors inline-flex items-center gap-1"
                                title="Open WhatsApp Chat"
                              >
                                WhatsApp
                              </a>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 italic">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              sub.source === 'newsletter'
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : sub.source === 'appointment'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : sub.source === 'contact'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {sub.source}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('en-GB') : 'Recent'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove subscriber"
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
        </div>
      )}

      {/* TAB 2: 1-CLICK CAMPAIGN COMPOSER */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Quick Templates */}
          <div className="lg:col-span-7 space-y-6">
            {/* Template Selector Banner */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Curated High-Converting British English Templates</span>
                </span>
                <span className="text-[11px] text-amber-700 font-semibold">1-Click Auto-Fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EMAIL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-2.5 rounded-xl border border-amber-200 bg-white hover:border-amber-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        {tmpl.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* One-click Custom Advertisement Loader */}
              <div className="pt-2 border-t border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-amber-900">
                  📢 Apni Custom Advertisement / Promotional Offer Likhain:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('🔥 Special Promotional Offer: 100% Free Processing & £10,000 Scholarships');
                    setCampaignTitle('Special Promotional Advertisement: Exclusive Partner University Intakes');
                    setMessageBody(
                      `Dear Student,\n\nWe are excited to share a limited-time promotional advertisement offer from FCC Global Education:\n\n🔥 SPECIAL PROMOTION PERKS:\n• 100% University Application Fee Waiver\n• Direct Merit Scholarship Assessment up to £10,000 / $15,000\n• Free SOP Polishing & Visa Dossier Pre-Audit\n• Direct fast-track offers within 48 to 72 hours\n\n⚡ SPECIAL PROMO CODE: FCC-GLOBAL-PROMO-2026\n\nMention this code during your consultation to unlock all promotional fee waivers and priority counseling services.`
                    );
                    setCtaText('Claim Exclusive Advertisement Offer');
                    const link = 'https://fccglobaleducation.com/book-appointment';
                    setCtaLink(link);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Advertisement Template (1-Click)</span>
                </button>
              </div>
            </div>

            {/* Campaign Form */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>Campaign Content & Links</span>
                </span>
                <div className="flex items-center gap-2">
                  {draftSavedMsg ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {draftSavedMsg}
                    </span>
                  ) : isSavingDraft ? (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      Saving changes...
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Auto-saves to database
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={isSavingDraft}
                    onClick={() => handleSaveDraft(false)}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Save current subject, text & target CTA link permanently"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    <span>Save Draft</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campaign Title / Internal Headline
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  onBlur={() => handleSaveDraft(true)}
                  placeholder="e.g. Exclusive 2026/2027 Global University Scholarships"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Subject Line (Appears in Student Inbox)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onBlur={() => handleSaveDraft(true)}
                  placeholder="e.g. Confirmed: UK & Canada Scholarship Allocations 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message Body (Professional British/International English)
                </label>
                <textarea
                  rows={9}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  onBlur={() => handleSaveDraft(true)}
                  placeholder="Type your official announcement or promotional offer here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    onBlur={() => handleSaveDraft(true)}
                    placeholder="e.g. Claim Your Scholarship Assessment"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      CTA Button Target Link
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Auto-Saves
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    onBlur={() => handleSaveDraft(true)}
                    placeholder="https://fccglobaleducation.com/book-appointment"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono text-slate-800"
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Enter any URL (e.g. booking page, WhatsApp, or offer page). Changes stay saved permanently.
                  </p>
                </div>
              </div>

              {/* Status Alerts */}
              {sendSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{sendSuccess}</span>
                </div>
              )}
              {sendError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {/* Row 1: Test Email & Save Draft */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Test Send */}
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs w-full max-w-[210px] focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      disabled={isSending}
                      onClick={() => handleSendBroadcast(true)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold whitespace-nowrap disabled:opacity-50 transition shadow-2xs"
                    >
                      Send Test
                    </button>
                  </div>

                  {/* Save Draft Button */}
                  <button
                    type="button"
                    disabled={isSavingDraft}
                    onClick={() => handleSaveDraft(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{isSavingDraft ? 'Saving...' : 'Save Draft & Links'}</span>
                  </button>
                </div>

                {/* Row 2: Full-Width 1-Click Mass Send */}
                <div>
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={() => handleSendBroadcast(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                  >
                    <Send className={`w-4 h-4 ${isSending ? 'animate-bounce' : ''}`} />
                    <span>
                      {isSending
                        ? 'Dispatching Campaign...'
                        : `1-Click Send to All ${subscribers.length} Subscribers`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Luxury Email Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-slate-600 px-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Luxury Email Preview</span>
              </span>
              <span className="text-[11px] text-slate-400">Branded for FCC Global Education</span>
            </div>

            {/* Simulated Email Container */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-md text-slate-900 text-left">
              {/* Email Client Top Bar */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <div className="truncate max-w-[280px]">
                  <strong>Subject:</strong> {subject || 'New Announcement'}
                </div>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">HTML Preview</span>
              </div>

              {/* Email Content Body */}
              <div className="p-6 space-y-5 bg-white">
                {/* Header */}
                <div className="bg-[#faf6ed] -mx-6 -mt-6 p-6 text-center border-b-2 border-[#e6d7ba]">
                  <div className="mb-2 flex justify-center">
                    <img
                      src="/uploads/FCC_Global_Education_Logo__1__1791178438060.png"
                      alt="FCC Global Education"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <h3 className="text-slate-900 text-lg font-extrabold tracking-tight">FCC Global Education</h3>
                  <p className="text-amber-800 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    Premier International Education & Visa Advisory
                  </p>
                </div>

                {/* Badge */}
                <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Special Announcement
                </span>

                {/* Headline */}
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {campaignTitle || subject}
                </h4>

                {/* Body Text */}
                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed border-t border-slate-100 pt-3">
                  {messageBody}
                </div>

                {/* CTA Button */}
                {ctaText && (
                  <div className="text-center pt-2">
                    <span className="inline-block bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm">
                      {ctaText} &rarr;
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1">
                  <p className="font-bold text-slate-600">FCC Global Education &bull; Mayfair, London W1J 6BD</p>
                  <p>Confidential student communication under GDPR compliance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGN HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Subject Line</th>
                  <th className="py-3.5 px-6">Campaign Title</th>
                  <th className="py-3.5 px-6">Recipients Reached</th>
                  <th className="py-3.5 px-6">Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      No broadcast campaigns have been dispatched yet.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-slate-900">{camp.subject}</td>
                      <td className="py-4 px-6 text-xs text-slate-600">{camp.campaignTitle}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{camp.recipientCount} Recipients</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {camp.sentAt ? new Date(camp.sentAt).toLocaleString('en-GB') : 'Recently'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>Add Subscriber Manually</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate Name (Optional)
                </label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Maya Sterling"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={newSubPhone}
                  onChange={(e) => setNewSubPhone(e.target.value)}
                  placeholder="e.g. +92 323 5502570"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingSub}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
                >
                  {addingSub ? 'Adding...' : 'Add to Audience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
