import { db } from '@/lib/db';
import UniversitiesClient from '@/components/universities/UniversitiesClient';

export const dynamic = 'force-dynamic';

export default async function UniversitiesPage() {
  const allUnis = (await db.getTable('universities')) || [];
  const publishedUnis = allUnis.filter((u: any) => u.published !== false);

  return <UniversitiesClient initialUniversities={publishedUnis} />;
}
