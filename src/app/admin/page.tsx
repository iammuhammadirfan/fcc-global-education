'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Globe,
  Building,
  Award,
  Video,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Inquiries / Leads',
      value: stats?.totalLeads || 0,
      subValue: `${stats?.newLeads || 0} New Unhandled`,
      icon: Users,
      color: 'from-blue-500 to-blue-700',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
      href: '/admin/leads',
    },
    {
      title: 'Appointments',
      value: stats?.totalAppointments || 0,
      subValue: `${stats?.pendingAppointments || 0} Pending Confirmation`,
      icon: Calendar,
      color: 'from-amber-400 to-amber-600',
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
      href: '/admin/appointments',
    },
    {
      title: 'Destinations',
      value: stats?.totalCountries || 0,
      subValue: 'Active Countries',
      icon: Globe,
      color: 'from-emerald-500 to-emerald-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      href: '/admin/countries',
    },
    {
      title: 'Universities',
      value: stats?.totalUniversities || 0,
      subValue: 'World-Ranked Partners',
      icon: Building,
      color: 'from-purple-500 to-purple-700',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
      href: '/admin/universities',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            FCC Global Education CMS Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Welcome to the Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Real-time inquiries, appointment requests, destination content, and site customizer.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/countries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Country</span>
          </Link>
          <Link
            href="/admin/universities"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Add University</span>
          </Link>
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Review</span>
          </Link>
          <Link
            href="/admin/visa-success"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Visa Proof</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${card.badgeColor}`}>
                    {card.subValue}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (Leads & Appointments) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Leads & Appointments Growth Trajectory</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly performance metrics across all digital acquisition channels
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Leads
              </span>
              <span className="flex items-center gap-1.5 text-cyan-700">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Appointments
              </span>
            </div>
          </div>

          {/* SVG Multi-Line Chart */}
          <div className="h-56 w-full pt-4">
            <div className="h-44 w-full flex items-end justify-between gap-3 px-2">
              {stats?.monthlyTrends?.map((item: any, idx: number) => {
                const maxLead = 200;
                const leadHeight = Math.min(100, Math.max(15, (item.leads / maxLead) * 100));
                const aptHeight = Math.min(100, Math.max(10, (item.appointments / maxLead) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Leads bar */}
                      <div
                        style={{ height: `${leadHeight}%` }}
                        className="w-1/2 rounded-t-md bg-gradient-to-t from-amber-500 to-amber-400 group-hover:brightness-105 transition-all relative shadow-xs"
                        title={`${item.month}: ${item.leads} leads`}
                      />
                      {/* Appointments bar */}
                      <div
                        style={{ height: `${aptHeight}%` }}
                        className="w-1/2 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-105 transition-all relative shadow-xs"
                        title={`${item.month}: ${item.appointments} appointments`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Destinations Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Inquiries by Destination</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Top targeted countries</p>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.leadsByCountry?.map((c: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{c.country}</span>
                  <span className="text-amber-700 font-bold">{c.count} Inquiries</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    style={{ width: `${Math.min(100, c.count * 25)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Student Inquiries</h2>
              <span className="text-xs text-slate-500">Latest leads from contact & calculator</span>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {stats?.recentLeads?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">No leads registered yet.</div>
            ) : (
              stats?.recentLeads?.map((lead: any) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <div className="font-bold text-slate-900 truncate">{lead.fullName}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {lead.email} • Target: {lead.targetCountry}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'new'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : lead.status === 'qualified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Appointments</h2>
              <span className="text-xs text-slate-500">Scheduled video strategy consultations</span>
            </div>
            <Link
              href="/admin/appointments"
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {stats?.recentAppointments?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">No appointments scheduled yet.</div>
            ) : (
              stats?.recentAppointments?.map((apt: any) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <div className="font-bold text-slate-900 truncate">{apt.fullName}</div>
                    <div className="text-[11px] text-amber-800 font-semibold truncate">
                      {apt.preferredDate} at {apt.preferredTime}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
