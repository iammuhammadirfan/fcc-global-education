import { db } from '@/lib/db';
import DestinationsClient from '@/components/destinations/DestinationsClient';

export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
  const allCountries = (await db.getTable('countries')) || [];
  const publishedCountries = allCountries.filter((c: any) => c.published !== false);

  return <DestinationsClient initialCountries={publishedCountries} />;
}
