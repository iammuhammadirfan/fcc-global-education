import { Metadata } from 'next';
import { db } from '@/lib/db';
import ServicesClient from '@/components/services/ServicesClient';
import { ServicesPageSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings: ServicesPageSettings = (await db.getTable('servicesPageSettings')) || {};
  return {
    title: settings.heroTitle ? `${settings.heroTitle} ${settings.heroTitleHighlight || ''} | FCC Global Education` : 'Our Services | FCC Global Education Consultants',
    description: settings.heroDescription || 'Explore full-suite international education services: university admissions, scholarship guidance, Turnitin SOP review, visa filing, and pre-departure briefings.',
  };
}

export default async function ServicesPage() {
  const [services, pageSettings] = await Promise.all([
    db.getTable('services'),
    db.getTable('servicesPageSettings'),
  ]);

  return (
    <ServicesClient
      initialServices={services || []}
      initialSettings={pageSettings || {}}
    />
  );
}
