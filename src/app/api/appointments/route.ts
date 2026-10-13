import { NextResponse } from 'next/server';
import { db, addSubscriber } from '@/lib/db';
import { Appointment } from '@/lib/types';
import { saveAppointmentToMySQL } from '@/lib/mysql';
import { sendAppointmentConfirmation, sendAppointmentRescheduledEmail } from '@/lib/mailer';

// Public submission of appointment booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = body.fullName || body.studentName;
    const preferredDate = body.preferredDate || body.date;
    const preferredTime = body.preferredTime || body.time;
    const targetCountry = body.targetCountry || body.country || 'United Kingdom';

    if (!fullName || !body.email || !body.phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Name, email, phone, date, and time slot are required.' },
        { status: 400 }
      );
    }

    const meetingMode = body.meetingMode || 'video';
    const format = body.format || (meetingMode === 'in_person' ? 'In-Person Office Visit' : '1-on-1 Private Video Call');

    const appointments = await db.getTable('appointments');
    const newAppointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName,
      studentName: fullName,
      email: body.email,
      phone: body.phone,
      targetCountry,
      country: targetCountry,
      studyLevel: body.studyLevel || 'Masters',
      consultationType: body.consultationType || 'Free Initial Profile Evaluation',
      preferredDate,
      date: preferredDate,
      preferredTime,
      time: preferredTime,
      meetingMode,
      format,
      whatsapp: body.whatsapp || body.phone,
      message: body.message || '',
      status: 'pending',
      meetingLink: meetingMode === 'video' ? 'https://meet.google.com/aur-aglb-edu' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save directly to MySQL database
    await saveAppointmentToMySQL(newAppointment).catch(console.error);

    appointments.unshift(newAppointment);
    await db.updateTable('appointments', appointments);

    // Also mirror into Leads table if not already present
    const leads = await db.getTable('leads');
    const existingLead = leads.find((l) => l.email.toLowerCase() === body.email.toLowerCase());
    if (!existingLead) {
      leads.unshift({
        id: `lead_${Date.now()}`,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        targetCountry: body.targetCountry || 'United Kingdom',
        studyLevel: body.studyLevel || 'Masters',
        message: `Booked appointment for ${body.preferredDate} at ${body.preferredTime} (${body.consultationType})`,
        sourcePage: '/book-appointment',
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await db.updateTable('leads', leads);
    }

    // Register unique subscriber in audience table
    await addSubscriber(body.email, fullName, 'appointment', body.phone).catch((err) =>
      console.warn('[Subscriber Auto-Registration Warning]:', err)
    );

    // Send official branded confirmation email from FCC Global Education
    sendAppointmentConfirmation({
      fullName,
      email: body.email,
      consultationType: newAppointment.consultationType,
      preferredDate: newAppointment.preferredDate,
      preferredTime: newAppointment.preferredTime,
      targetCountry: newAppointment.targetCountry,
      meetingLink: newAppointment.meetingLink,
      meetingMode,
      format,
    }).catch((err) => console.warn('[Appointment Email Dispatch Warning]:', err));

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch {
    return NextResponse.json({ error: 'Failed to record appointment.' }, { status: 500 });
  }
}

// Admin fetch appointments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let appointments = await db.getTable('appointments');

    if (status && status !== 'all') {
      appointments = appointments.filter((a) => a.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      appointments = appointments.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q) ||
          a.targetCountry.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, appointments });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointments.' }, { status: 500 });
  }
}

// Admin update appointment
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, meetingLink, notes } = body;
    const preferredDate = body.preferredDate || body.date;
    const preferredTime = body.preferredTime || body.time;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const appointments = await db.getTable('appointments');
    const index = appointments.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const originalAppt = { ...appointments[index] };
    const oldDate = originalAppt.preferredDate || (originalAppt as any).date;
    const oldTime = originalAppt.preferredTime || (originalAppt as any).time;

    if (status) appointments[index].status = status;
    if (preferredDate) appointments[index].preferredDate = preferredDate;
    if (preferredTime) appointments[index].preferredTime = preferredTime;
    if (meetingLink !== undefined) appointments[index].meetingLink = meetingLink;
    if (notes !== undefined) appointments[index].notes = notes;
    appointments[index].updatedAt = new Date().toISOString();

    await db.updateTable('appointments', appointments);

    const updatedAppt = appointments[index];

    // If status is rescheduled, or if new date/time was set and reschedule email requested
    if (status === 'rescheduled' || body.sendRescheduleEmail === true) {
      sendAppointmentRescheduledEmail({
        fullName: updatedAppt.fullName || (updatedAppt as any).studentName || 'Student Applicant',
        email: updatedAppt.email,
        consultationType: updatedAppt.consultationType || 'Advisory Consultation',
        oldDate,
        oldTime,
        newDate: updatedAppt.preferredDate || (updatedAppt as any).date || preferredDate,
        newTime: updatedAppt.preferredTime || (updatedAppt as any).time || preferredTime,
        targetCountry: updatedAppt.targetCountry || (updatedAppt as any).country,
        meetingLink: updatedAppt.meetingLink,
        meetingMode: updatedAppt.meetingMode,
        rescheduleReason: notes || body.reason || undefined,
      }).catch((err) => console.warn('[Reschedule Email Dispatch Warning]:', err));
    }

    return NextResponse.json({ success: true, appointment: updatedAppt });
  } catch {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// Delete appointment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    let appointments = await db.getTable('appointments');
    appointments = appointments.filter((a) => a.id !== id);
    await db.updateTable('appointments', appointments);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
