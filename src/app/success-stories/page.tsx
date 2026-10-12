import { Metadata } from 'next';
import { db } from '@/lib/db';
import SuccessStoriesClient from '@/components/success-stories/SuccessStoriesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Student Reviews & Experiences | FCC Global Education',
  description: 'Verified student reviews, university admissions, and authentic video testimonials from real scholars.',
};

export default async function SuccessStoriesPage() {
  const reviews = ((await db.getTable('reviews' as any)) as any) || [];
  // Only display reviews managed in Admin -> Student Reviews
  const approvedReviews = reviews.filter(
    (r: any) => r.status === 'approved' || r.published === true || (r.status !== 'rejected' && r.status !== 'pending')
  );
  const videos = ((await db.getTable('videos')) as any) || [];
  const publishedVideos = videos.filter((v: any) => v.published !== false);

  return (
    <SuccessStoriesClient
      initialStories={approvedReviews}
      initialVideos={publishedVideos}
    />
  );
}
