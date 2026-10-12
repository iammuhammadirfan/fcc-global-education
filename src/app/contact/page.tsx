import { Metadata } from 'next';
import { db } from '@/lib/db';
import ContactClient from '@/components/contact/ContactClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us | FCC Global Education Consultants',
  description: 'Reach our admissions counselors, book a consultation, or visit one of our global offices across the UK, Canada, Australia, and UAE.',
};

export default async function ContactPage() {
  const countries = (await db.getTable('countries')) || [];
  const generalSettings = (await db.getTable('generalSettings')) || {};

  return (
    <ContactClient
      countries={countries}
      generalSettings={generalSettings}
    />
  );
}
