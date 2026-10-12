import { Metadata } from 'next';
import { db } from '@/lib/db';
import FAQClient from '@/components/faq/FAQClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | FCC Global Education',
  description: 'Instant answers to student questions on admission criteria, IELTS waivers, financial proof for visas, scholarships, and post-study work regulations.',
};

export default async function FAQPage() {
  const faqs = await db.getTable('faqs');

  return <FAQClient initialFaqs={faqs || []} />;
}
