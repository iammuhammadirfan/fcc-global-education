import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const leads = await db.getTable('leads');
    const appointments = await db.getTable('appointments');
    const countries = await db.getTable('countries');
    const universities = await db.getTable('universities');
    const successStories = await db.getTable('successStories');
    const videos = await db.getTable('videos');
    const blogPosts = await db.getTable('blogPosts');

    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;
    const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed').length;

    // Aggregate Leads by Country
    const countryCounts: Record<string, number> = {};
    leads.forEach((l) => {
      const c = l.targetCountry || 'Other';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });

    const leadsByCountry = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Mock trend over past 7 months for interactive charts
    const monthlyTrends = [
      { month: 'Apr', leads: 28, appointments: 12 },
      { month: 'May', leads: 42, appointments: 21 },
      { month: 'Jun', leads: 65, appointments: 34 },
      { month: 'Jul', leads: 84, appointments: 48 },
      { month: 'Aug', leads: 110, appointments: 68 },
      { month: 'Sep', leads: 145, appointments: 92 },
      { month: 'Oct', leads: totalLeads + 160, appointments: totalAppointments + 104 },
    ];

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        newLeads,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        totalCountries: countries.length,
        totalUniversities: universities.length,
        totalStories: successStories.length,
        totalVideos: videos.length,
        totalBlogs: blogPosts.length,
        leadsByCountry,
        monthlyTrends,
        recentLeads: leads.slice(0, 5),
        recentAppointments: appointments.slice(0, 5),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to aggregate statistics.' }, { status: 500 });
  }
}
