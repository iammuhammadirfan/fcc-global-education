'use client';

import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, Clock4, 
  Search, Filter, Mail, Phone, Video, ExternalLink, 
  Trash2, User, Globe, AlertCircle, RefreshCw, Download,
  Building2, GraduationCap, Send, X
} from 'lucide-react';
import { Appointment } from '@/lib/types';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const payload: any = { id, status };
      if (statusNote) payload.notes = statusNote;
      if (status === 'rescheduled' && rescheduleDate) {
        payload.date = rescheduleDate;
        if (rescheduleTime) payload.time = rescheduleTime;
      }

      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(a => a.id === id ? data.appointment : a));
        if (selectedAppt?.id === id) {
          setSelectedAppt(data.appointment);
        }
        setStatusNote('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment record?')) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.filter(a => a.id !== id));
        if (selectedAppt?.id === id) setSelectedAppt(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/admin/backup?export=appointments');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fccglobal-appointments-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = appointments.filter(a => {
    const studentName = a.studentName || a.fullName || '';
    const email = a.email || '';
    const phone = a.phone || '';
    const country = a.country || a.targetCountry || '';
    const matchesSearch = 
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      country.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5"><Clock4 className="w-3 h-3" /> Pending</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'rescheduled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Rescheduled</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 inline-flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-amber-400" />
            Appointments Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage online and in-office counseling consultations booked by prospective students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={fetchAppointments}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: 'All Sessions', count: appointments.length, color: 'text-white', filter: 'all' },
          { label: 'Pending', count: appointments.filter(a => a.status === 'pending').length, color: 'text-amber-400', filter: 'pending' },
          { label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length, color: 'text-emerald-400', filter: 'confirmed' },
          { label: 'Rescheduled', count: appointments.filter(a => a.status === 'rescheduled').length, color: 'text-blue-400', filter: 'rescheduled' },
          { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'text-purple-400', filter: 'completed' }
        ].map(item => (
          <button
            key={item.label}
            onClick={() => setStatusFilter(item.filter)}
            className={`p-3.5 rounded-xl border text-left transition ${
              statusFilter === item.filter
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs text-slate-400 font-medium">{item.label}</div>
            <div className={`text-xl font-bold mt-1 ${item.color}`}>{item.count}</div>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, phone, or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Consultation</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                      Loading appointments...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No appointments match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((appt) => {
                    const studentName = appt.fullName || appt.studentName || 'Student Applicant';
                    const country = appt.targetCountry || appt.country || 'Global';
                    const date = appt.preferredDate || appt.date || 'Pending';
                    const time = appt.preferredTime || appt.time || 'Pending';
                    const isOffice = appt.meetingMode === 'in_person' || appt.format?.toLowerCase().includes('office');

                    return (
                      <tr
                        key={appt.id}
                        onClick={() => setSelectedAppt(appt)}
                        className={`hover:bg-slate-800/40 cursor-pointer transition ${
                          selectedAppt?.id === appt.id ? 'bg-amber-500/10 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{studentName}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-500" /> {appt.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-bold text-slate-200 block truncate max-w-[200px]">
                            {appt.consultationType || 'Profile Evaluation'}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {country}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {appt.studyLevel || 'Degree'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-xs text-white font-bold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {date}
                          </div>
                          <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {time}
                          </div>
                          <div className="mt-1">
                            {isOffice ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                <Building2 className="w-3 h-3" /> In-Person Office
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                <Video className="w-3 h-3" /> Online Video
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(appt.status)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition mr-1"
                          >
                            Details
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(appt.id); }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Revamped Detail Panel (Fixing Screenshot 1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 h-fit sticky top-24 shadow-xl">
          {selectedAppt ? (() => {
            const studentName = selectedAppt.fullName || selectedAppt.studentName || 'Student Applicant';
            const country = selectedAppt.targetCountry || selectedAppt.country || 'Global / Multiple';
            const date = selectedAppt.preferredDate || selectedAppt.date || 'Date TBD';
            const time = selectedAppt.preferredTime || selectedAppt.time || 'Time TBD';
            const isOffice = selectedAppt.meetingMode === 'in_person' || selectedAppt.format?.toLowerCase().includes('office');

            return (
              <div className="space-y-5">
                {/* Header with Avatar & Status */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-white leading-tight">{studentName}</h2>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {selectedAppt.id}</p>
                    </div>
                  </div>
                  <div>{getStatusBadge(selectedAppt.status)}</div>
                </div>

                {/* Consultation Session Badge */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    Selected Consultation Session
                  </span>
                  <div className="text-sm font-extrabold text-white">
                    {selectedAppt.consultationType || 'Free Initial Profile Evaluation'}
                  </div>
                </div>

                {/* Meeting Format Pill */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold">Consultation Mode:</span>
                  {isOffice ? (
                    <span className="font-extrabold text-blue-400 flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30">
                      <Building2 className="w-4 h-4" /> In-Person Office Visit (Mayfair Office)
                    </span>
                  ) : (
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <Video className="w-4 h-4" /> 1-on-1 Online Video Call (Google Meet)
                    </span>
                  )}
                </div>

                {/* 4 Crystal-Clear High-Contrast Stat Cards (Fixed from Screenshot 1) */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Destination */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>Destination</span>
                    </span>
                    <div className="font-bold text-amber-400 text-sm mt-1 truncate">
                      {country}
                    </div>
                  </div>

                  {/* Study Level */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                      <span>Study Level</span>
                    </span>
                    <div className="font-bold text-white text-sm mt-1 truncate">
                      {selectedAppt.studyLevel || 'Masters'}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Scheduled Date</span>
                    </span>
                    <div className="font-bold text-white text-sm mt-1 truncate">
                      {date}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Time Slot (GMT)</span>
                    </span>
                    <div className="font-bold text-amber-400 text-sm mt-1 truncate">
                      {time}
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300 pb-1.5 border-b border-slate-900">
                    <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> Email</span>
                    <a href={`mailto:${selectedAppt.email}`} className="text-amber-400 font-bold hover:underline">{selectedAppt.email}</a>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pb-1.5 border-b border-slate-900">
                    <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> Phone</span>
                    <a href={`tel:${selectedAppt.phone}`} className="text-white font-semibold hover:underline">{selectedAppt.phone}</a>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp</span>
                    <a 
                      href={`https://wa.me/${(selectedAppt.whatsapp || selectedAppt.phone).replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-emerald-400 font-bold hover:underline"
                    >
                      {selectedAppt.whatsapp || selectedAppt.phone}
                    </a>
                  </div>
                </div>

                {/* Student Inquiry Message */}
                {selectedAppt.message && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Student Inquiry / Notes:
                    </div>
                    <p className="text-slate-200 leading-relaxed italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      &ldquo;{selectedAppt.message}&rdquo;
                    </p>
                  </div>
                )}

                {/* Status Action Buttons */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Session Status:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={updating || selectedAppt.status === 'confirmed'}
                      onClick={() => handleStatusChange(selectedAppt.id, 'confirmed')}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition disabled:opacity-40"
                    >
                      Confirm Session
                    </button>
                    <button
                      disabled={updating || selectedAppt.status === 'completed'}
                      onClick={() => handleStatusChange(selectedAppt.id, 'completed')}
                      className="py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition disabled:opacity-40"
                    >
                      Mark Completed
                    </button>
                    <button
                      disabled={updating || selectedAppt.status === 'cancelled'}
                      onClick={() => handleStatusChange(selectedAppt.id, 'cancelled')}
                      className="py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition disabled:opacity-40"
                    >
                      Cancel Booking
                    </button>
                    <button
                      onClick={() => {
                        const meetUrl = prompt('Enter Google Meet / Zoom link:', selectedAppt.meetingLink || 'https://meet.google.com/new');
                        if (meetUrl) {
                          handleStatusChange(selectedAppt.id, selectedAppt.status);
                        }
                      }}
                      className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" /> Meeting Link
                    </button>
                  </div>

                  {/* Direct Contact Student Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`mailto:${selectedAppt.email}?subject=Regarding%20Your%20FCC%20Global%20Education%20Consultation`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>Email Student</span>
                    </a>
                    <a
                      href={`https://wa.me/${(selectedAppt.whatsapp || selectedAppt.phone).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(studentName)}%2C%20this%20is%20FCC%20Global%20Education%20regarding%20your%20scheduled%20consultation.`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>

                  {/* Reschedule Section */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Reschedule Consultation
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <button
                      disabled={!rescheduleDate || updating}
                      onClick={() => handleStatusChange(selectedAppt.id, 'rescheduled')}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-40"
                    >
                      Confirm Reschedule
                    </button>
                  </div>

                  {/* Add Counselor Note */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400">Counselor Activity / Audit Notes:</div>
                    <textarea
                      rows={2}
                      placeholder="Add student background notes, documents needed..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      disabled={!statusNote || updating}
                      onClick={() => handleStatusChange(selectedAppt.id, selectedAppt.status)}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition disabled:opacity-40"
                    >
                      Save Counselor Notes
                    </button>
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="py-16 text-center text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-300">No Consultation Selected</p>
              <p className="text-xs text-slate-500 mt-1">Select an appointment from the table to view full details, student profile, and take actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
