'use client';

import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, Clock4, 
  Search, Filter, Mail, Phone, Video, ExternalLink, 
  Trash2, User, Globe, AlertCircle, RefreshCw, Download,
  Building2, GraduationCap, Send, X, Eye, Check, MessageSquare
} from 'lucide-react';
import { Appointment } from '@/lib/types';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [sendRescheduleEmail, setSendRescheduleEmail] = useState(true);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [isEditingMeetingLink, setIsEditingMeetingLink] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

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

  const openApptModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setStatusNote(appt.notes || '');
    setRescheduleDate(appt.preferredDate || (appt as any).date || '');
    setRescheduleTime(appt.preferredTime || (appt as any).time || '');
    setRescheduleReason('');
    setMeetingLinkInput(appt.meetingLink || '');
    setIsEditingMeetingLink(false);
    setActionSuccessMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppt(null);
  };

  const showTempSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const payload: any = { id, status };
      if (statusNote) payload.notes = statusNote;

      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.map((a) => (a.id === id ? data.appointment : a)));
        if (selectedAppt?.id === id) {
          setSelectedAppt(data.appointment);
        }
        showTempSuccess(`Status successfully changed to "${status.toUpperCase()}".`);
      } else {
        alert(data.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveReschedule = async () => {
    if (!selectedAppt) return;
    if (!rescheduleDate) {
      alert('Please select a valid new date for the consultation.');
      return;
    }

    setUpdating(true);
    try {
      const payload: any = {
        id: selectedAppt.id,
        status: 'rescheduled',
        preferredDate: rescheduleDate,
        preferredTime: rescheduleTime || selectedAppt.preferredTime || (selectedAppt as any).time || '10:00 AM',
        notes: statusNote || undefined,
        reason: rescheduleReason || undefined,
        sendRescheduleEmail,
      };

      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.map((a) => (a.id === selectedAppt.id ? data.appointment : a)));
        setSelectedAppt(data.appointment);
        showTempSuccess('✅ Appointment rescheduled successfully! Student has been notified via email.');
      } else {
        alert(data.error || 'Failed to reschedule.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to execute reschedule.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveMeetingLink = async () => {
    if (!selectedAppt) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAppt.id,
          meetingLink: meetingLinkInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.map((a) => (a.id === selectedAppt.id ? data.appointment : a)));
        setSelectedAppt(data.appointment);
        setIsEditingMeetingLink(false);
        showTempSuccess('Meeting room link updated.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAppt) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAppt.id,
          notes: statusNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.map((a) => (a.id === selectedAppt.id ? data.appointment : a)));
        setSelectedAppt(data.appointment);
        showTempSuccess('Counselor notes saved.');
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
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        if (selectedAppt?.id === id) closeModal();
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

  const filtered = appointments.filter((a) => {
    const studentName = a.fullName || a.studentName || '';
    const email = a.email || '';
    const phone = a.phone || '';
    const country = a.targetCountry || a.country || '';
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
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5 shadow-2xs">
            <Clock4 className="w-3.5 h-3.5 text-amber-700" /> Pending Review
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Confirmed
          </span>
        );
      case 'rescheduled':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1.5 shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 text-blue-700" /> Rescheduled
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-900 border border-purple-300 inline-flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-900 border border-rose-300 inline-flex items-center gap-1.5 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-700" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-amber-500" />
            Appointments Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage online and in-office counseling consultations booked by prospective students.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={fetchAppointments}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: 'All Sessions', count: appointments.length, color: 'text-slate-900', filter: 'all' },
          { label: 'Pending', count: appointments.filter((a) => a.status === 'pending').length, color: 'text-amber-600', filter: 'pending' },
          { label: 'Confirmed', count: appointments.filter((a) => a.status === 'confirmed').length, color: 'text-emerald-600', filter: 'confirmed' },
          { label: 'Rescheduled', count: appointments.filter((a) => a.status === 'rescheduled').length, color: 'text-blue-600', filter: 'rescheduled' },
          { label: 'Completed', count: appointments.filter((a) => a.status === 'completed').length, color: 'text-purple-600', filter: 'completed' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setStatusFilter(item.filter)}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-xs ${
              statusFilter === item.filter
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`text-xs font-bold ${statusFilter === item.filter ? 'text-amber-100' : 'text-slate-500'}`}>
              {item.label}
            </div>
            <div className={`text-2xl font-black mt-1 ${statusFilter === item.filter ? 'text-white' : item.color}`}>
              {item.count}
            </div>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, phone, or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 shadow-xs cursor-pointer"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Full Width Table (Spacious, No Cutoffs) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Student Information</th>
                <th className="py-3.5 px-5">Consultation Session</th>
                <th className="py-3.5 px-5">Destination & Level</th>
                <th className="py-3.5 px-5">Scheduled Slot</th>
                <th className="py-3.5 px-5">Format</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading appointments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="font-bold text-slate-800 text-sm">No consultations found matching your filters.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => {
                  const studentName = appt.fullName || appt.studentName || 'Student Applicant';
                  const country = appt.targetCountry || appt.country || 'Global';
                  const date = appt.preferredDate || (appt as any).date || 'Pending';
                  const time = appt.preferredTime || (appt as any).time || 'Pending';
                  const isOffice =
                    appt.meetingMode === 'in_person' ||
                    appt.format?.toLowerCase().includes('office');

                  return (
                    <tr
                      key={appt.id}
                      onClick={() => openApptModal(appt)}
                      className="hover:bg-amber-50/40 cursor-pointer transition group"
                    >
                      {/* Student Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                              {studentName}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" /> {appt.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Consultation Type */}
                      <td className="py-4 px-5">
                        <span className="text-xs font-bold text-slate-800 block">
                          {appt.consultationType || 'Free Initial Profile Evaluation'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                          ID: {appt.id}
                        </span>
                      </td>

                      {/* Destination & Degree */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                          <Globe className="w-3 h-3 text-amber-700" /> {country}
                        </span>
                        {(appt.targetUniversity || (appt as any).university) && (
                          <div className="text-[11px] text-amber-900 font-semibold mt-1 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-amber-600" />
                            <span>{appt.targetUniversity || (appt as any).university}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                          <GraduationCap className="w-3 h-3 text-slate-400" /> {appt.studyLevel || 'Degree Program'}
                        </div>
                      </td>

                      {/* Slot Date & Time */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          {date}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {time} (UK / GMT)
                        </div>
                      </td>

                      {/* Format (In-Person / Online) */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {isOffice ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300">
                            <Building2 className="w-3.5 h-3.5 text-blue-700" /> In-Person Office
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                            <Video className="w-3.5 h-3.5 text-emerald-700" /> Online Video
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getStatusBadge(appt.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openApptModal(appt);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer border border-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(appt.id);
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 FULL APPOINTMENT DETAILS & ACTIONS MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && selectedAppt && (() => {
        const studentName = selectedAppt.fullName || selectedAppt.studentName || 'Student Applicant';
        const country = selectedAppt.targetCountry || selectedAppt.country || 'Global / Multiple';
        const date = selectedAppt.preferredDate || (selectedAppt as any).date || 'Date TBD';
        const time = selectedAppt.preferredTime || (selectedAppt as any).time || 'Time TBD';
        const isOffice =
          selectedAppt.meetingMode === 'in_person' ||
          selectedAppt.format?.toLowerCase().includes('office');

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
            <div
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-slate-900 p-5 sm:p-6 text-white flex items-start justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                    {studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-xl font-extrabold text-white tracking-tight">{studentName}</h2>
                      {getStatusBadge(selectedAppt.status)}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Consultation ID: {selectedAppt.id} &bull; Booked on {new Date(selectedAppt.createdAt || Date.now()).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Notification Banner */}
              {actionSuccessMsg && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* Modal Body */}
              <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN: SESSION DETAILS */}
                  <div className="space-y-4">
                    {/* Session Type Pill */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                        Selected Consultation Session
                      </span>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">
                        {selectedAppt.consultationType || 'Free Initial Profile Evaluation'}
                      </div>
                    </div>

                    {/* Mode (In-Person / Video) */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-500 font-bold">Consultation Mode:</span>
                      {isOffice ? (
                        <span className="font-extrabold text-blue-900 flex items-center gap-1.5 bg-blue-100 px-3 py-1 rounded-xl border border-blue-300">
                          <Building2 className="w-4 h-4 text-blue-700" /> In-Person Office Visit
                        </span>
                      ) : (
                        <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                          <Video className="w-4 h-4 text-emerald-700" /> 1-on-1 Online Video Call
                        </span>
                      )}
                    </div>

                    {/* 4 Stat Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Destination & Target University */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>Destination & Target Uni</span>
                        </span>
                        <div className="font-black text-amber-700 text-sm mt-1 truncate">
                          {country}
                        </div>
                        {(selectedAppt.targetUniversity || (selectedAppt as any).university) && (
                          <div className="text-[11px] text-slate-700 font-semibold mt-0.5 truncate flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-amber-600" />
                            <span>{selectedAppt.targetUniversity || (selectedAppt as any).university}</span>
                          </div>
                        )}
                      </div>

                      {/* Study Level */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                          <span>Study Level</span>
                        </span>
                        <div className="font-bold text-slate-900 text-sm mt-1 truncate">
                          {selectedAppt.studyLevel || 'Masters'}
                        </div>
                      </div>

                      {/* Scheduled Date */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Scheduled Date</span>
                        </span>
                        <div className="font-black text-slate-900 text-sm mt-1 truncate">
                          {date}
                        </div>
                      </div>

                      {/* Time Window */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Time Slot (GMT)</span>
                        </span>
                        <div className="font-black text-amber-700 text-sm mt-1 truncate">
                          {time}
                        </div>
                      </div>
                    </div>

                    {/* Google Meet / Video Room Link Editor */}
                    {!isOffice && (
                      <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-950 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-sky-600" />
                            Virtual Meeting Room Link:
                          </span>
                          {!isEditingMeetingLink && (
                            <button
                              type="button"
                              onClick={() => setIsEditingMeetingLink(true)}
                              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline cursor-pointer"
                            >
                              Edit Link
                            </button>
                          )}
                        </div>

                        {isEditingMeetingLink ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={meetingLinkInput}
                              onChange={(e) => setMeetingLinkInput(e.target.value)}
                              placeholder="https://meet.google.com/xxx-xxxx-xxx"
                              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-sky-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                            />
                            <button
                              type="button"
                              onClick={handleSaveMeetingLink}
                              disabled={updating}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingMeetingLink(false)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-slate-700 truncate max-w-[280px]">
                              {selectedAppt.meetingLink || 'https://meet.google.com/aur-aglb-edu'}
                            </span>
                            <a
                              href={selectedAppt.meetingLink || 'https://meet.google.com/aur-aglb-edu'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shrink-0"
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Student Notes / Inquiry */}
                    {selectedAppt.message && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Student Inquiry / Notes:
                        </div>
                        <p className="text-slate-800 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
                          &ldquo;{selectedAppt.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: CONTACT, STATUS BUTTONS, RESCHEDULE */}
                  <div className="space-y-4">
                    {/* Contact Student Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                      <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                        Student Contact Channels
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-amber-600" /> Email:
                        </span>
                        <a href={`mailto:${selectedAppt.email}`} className="text-slate-900 font-bold hover:underline">
                          {selectedAppt.email}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone:
                        </span>
                        <a href={`tel:${selectedAppt.phone}`} className="text-slate-900 font-bold hover:underline">
                          {selectedAppt.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp:
                        </span>
                        <a
                          href={`https://wa.me/${(selectedAppt.whatsapp || selectedAppt.phone).replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          {selectedAppt.whatsapp || selectedAppt.phone}
                        </a>
                      </div>

                      {/* Direct Action Links */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                        <a
                          href={`mailto:${selectedAppt.email}?subject=Regarding%20Your%20FCC%20Global%20Education%20Consultation`}
                          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Email Student</span>
                        </a>
                        <a
                          href={`https://wa.me/${(selectedAppt.whatsapp || selectedAppt.phone).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(studentName)}%2C%20this%20is%20FCC%20Global%20Education%20regarding%20your%20scheduled%20consultation.`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Chat</span>
                        </a>
                      </div>
                    </div>

                    {/* STATUS ACTION BUTTONS (HIGH CONTRAST SOLID COLORS - FIXING SCREENSHOT 3) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Update Session Status:
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {/* 1. Confirm Session */}
                        <button
                          type="button"
                          disabled={updating || selectedAppt.status === 'confirmed'}
                          onClick={() => handleStatusChange(selectedAppt.id, 'confirmed')}
                          className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>

                        {/* 2. Mark Completed */}
                        <button
                          type="button"
                          disabled={updating || selectedAppt.status === 'completed'}
                          onClick={() => handleStatusChange(selectedAppt.id, 'completed')}
                          className="py-2.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </button>

                        {/* 3. Cancel Booking */}
                        <button
                          type="button"
                          disabled={updating || selectedAppt.status === 'cancelled'}
                          onClick={() => handleStatusChange(selectedAppt.id, 'cancelled')}
                          className="py-2.5 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>

                    {/* RESCHEDULE SECTION WITH AUTOMATED EMAIL NOTIFICATION */}
                    <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/60 p-4 rounded-2xl border-2 border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />
                          Reschedule Consultation
                        </div>
                        <span className="text-[10px] font-extrabold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full">
                          Auto-Emails Student
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">New Date:</label>
                          <input
                            type="date"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">New Time Window:</label>
                          <input
                            type="text"
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            placeholder="e.g. 11:30 AM – 12:00 PM"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Counselor Reschedule Note (Included in student email):
                        </label>
                        <input
                          type="text"
                          value={rescheduleReason}
                          onChange={(e) => setRescheduleReason(e.target.value)}
                          placeholder="e.g. Counselor attending official Russell Group conference."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-950 select-none pt-0.5">
                        <input
                          type="checkbox"
                          checked={sendRescheduleEmail}
                          onChange={(e) => setSendRescheduleEmail(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                        <span>Send Automated Confirmation Email to Student</span>
                      </label>

                      <button
                        type="button"
                        disabled={!rescheduleDate || updating}
                        onClick={handleSaveReschedule}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        {updating ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Confirm & Send Rescheduled Email</span>
                      </button>
                    </div>

                    {/* Counselor Internal Audit Notes */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        Counselor Activity / Audit Notes:
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Add internal notes on profile, required academic docs..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        disabled={!statusNote || updating}
                        onClick={handleSaveNotes}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-40"
                      >
                        Save Internal Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedAppt.id)}
                  className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 border border-red-200 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Appointment</span>
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
