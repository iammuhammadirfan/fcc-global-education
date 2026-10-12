import { Metadata } from 'next';
import { db } from '@/lib/db';
import BookAppointmentClient from '@/components/book-appointment/BookAppointmentClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book a Free Consultation | FCC Global Education',
  description: 'Schedule a 1-on-1 personalized video consultation with a senior university admissions and student visa strategist.',
};

export default async function BookAppointmentPage() {
  const countries = (await db.getTable('countries')) || [];
  const appointmentSettings = (await db.getTable('appointmentSettings')) || {};

  return (
    <BookAppointmentClient
      countries={countries}
      appointmentSettings={appointmentSettings}
    />
  );
}
