'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Upload,
  LogIn,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Globe,
  Monitor,
  Eye,
  X,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AuditLogEntry } from '@/lib/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    logins: 0,
    uploads: 0,
    updates: 0,
    creates: 0,
    deletions: 0,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (actionFilter !== 'all') params.set('action', actionFilter);
      if (entityFilter !== 'all') params.set('entity', entityFilter);
      if (userFilter !== 'all') params.set('user', userFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter, userFilter]);

  // Handle Enter key in search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <LogIn className="w-3 h-3 text-emerald-400" /> LOGIN
          </span>
        );
      case 'UPLOAD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Upload className="w-3 h-3 text-amber-400" /> UPLOAD
          </span>
        );
      case 'UPDATE':
      case 'STATUS_CHANGE':
      case 'SETTINGS_CHANGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Edit className="w-3 h-3 text-blue-400" /> {action}
          </span>
        );
      case 'CREATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-3 h-3 text-purple-400" /> CREATE
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Trash2 className="w-3 h-3 text-rose-400" /> DELETE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
            {action}
          </span>
        );
    }
  };

  const uniqueUsers = Array.from(new Set(logs.map((l) => l.userEmail).filter(Boolean)));
  const uniqueEntities = Array.from(new Set(logs.map((l) => l.entity).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <span>User Activity & Audit Logs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Permanent, tamper-proof record of all user logins, document uploads, content edits, and administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {/* Security Compliance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="font-extrabold text-white text-xs block">
              Immutable Audit Trail (Read-Only Security Guarantee)
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              Ye logs permanent hain aur kisi bhi user ya admin se delete ya update nahi ho sakte. Tamam user logins, file uploads aur edits yahan record hoti hain.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>WORM Compliant</span>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Logged Events
          </span>
          <span className="text-2xl font-black text-white mt-1 block">{stats.total || logs.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-md">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <LogIn className="w-3.5 h-3.5" /> User Logins
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.logins}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-md">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> File Uploads
          </span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{stats.uploads}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 shadow-md">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Edit className="w-3.5 h-3.5" /> CMS Updates
          </span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">
            {stats.updates + stats.creates}
          </span>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user, email, action details, IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Actions</option>
              <option value="LOGIN">Logins</option>
              <option value="UPLOAD">Uploads</option>
              <option value="UPDATE">Updates</option>
              <option value="STATUS_CHANGE">Status Changes</option>
              <option value="CREATE">Creations</option>
              <option value="DELETE">Deletions</option>
            </select>

            {/* Entity Filter */}
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Entities</option>
              {uniqueEntities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>

            {/* User Filter */}
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Users / Actors</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
            <p className="text-xs">Loading secure audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Shield className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-bold text-white">No audit records match the current filter</p>
            <p className="text-xs text-slate-500">Change your search keywords or reset filter dropdowns.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User / Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Activity Details</th>
                  <th className="py-3 px-4">IP &amp; Device</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {logs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });
                  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        <div className="flex items-center gap-1.5 text-white font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span>{formattedTime}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-amber-400">
                            {(log.userName || log.userEmail || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-bold leading-tight truncate max-w-[140px]" title={log.userName}>
                              {log.userName || 'Administrator'}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={log.userEmail}>
                              {log.userEmail || 'admin@system'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                          {log.entity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-slate-200 line-clamp-2 leading-relaxed" title={log.details}>
                          {log.details}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                        <div className="flex items-center gap-1 text-slate-300 font-mono">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span>{log.ip || '127.0.0.1'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px] mt-0.5 flex items-center gap-1">
                          <Monitor className="w-3 h-3 text-slate-600" />
                          <span>{log.userAgent?.includes('Chrome') ? 'Chrome' : log.userAgent?.includes('Firefox') ? 'Firefox' : 'Browser'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="View Event Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Audit Event Details</h3>
                  <p className="text-[11px] text-slate-400">ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Action</span>
                <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Entity</span>
                <span className="font-mono text-white text-xs mt-1 block">{selectedLog.entity}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">User / Actor</span>
                <span className="text-white font-bold block mt-0.5">{selectedLog.userName}</span>
                <span className="text-slate-400 text-[11px] block">{selectedLog.userEmail}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Role</span>
                <span className="text-amber-400 font-bold uppercase text-xs mt-0.5 block">{selectedLog.userRole || 'admin'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">IP Address</span>
                <span className="font-mono text-white text-xs mt-0.5 block">{selectedLog.ip || '127.0.0.1'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Exact Timestamp</span>
                <span className="text-white text-xs mt-0.5 block">{selectedLog.timestamp}</span>
              </div>
            </div>

            {/* Event Description */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Full Activity Log</span>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedLog.details}</p>
            </div>

            {/* User Agent */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">User Agent Header</span>
              <p className="font-mono text-slate-400 break-all text-[10px]">{selectedLog.userAgent}</p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Permanent &amp; Immutable
              </span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
