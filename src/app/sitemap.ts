import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fccglobaleducation.com';
  const now = new Date();

  // Static Core Marketing & Informational Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/visa-success`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/success-stories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-appointment`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const [countries, universities, services, blogPosts, customPages] = await Promise.all([
      db.getTable('countries').then((res) => res || []).catch(() => []),
      db.getTable('universities').then((res) => res || []).catch(() => []),
      db.getTable('services').then((res) => res || []).catch(() => []),
      db.getTable('blogPosts').then((res) => res || []).catch(() => []),
      db.getTable('customPages').then((res) => res || []).catch(() => []),
    ]);

    // Destination Country Routes
    const destinationRoutes: MetadataRoute.Sitemap = countries
      .filter((c: any) => c.published !== false && c.slug)
      .map((c: any) => ({
        url: `${baseUrl}/destinations/${c.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));

    // University Routes
    const universityRoutes: MetadataRoute.Sitemap = universities
      .filter((u: any) => u.published !== false && u.slug)
      .map((u: any) => ({
        url: `${baseUrl}/universities/${u.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));

    // Services Routes
    const serviceRoutes: MetadataRoute.Sitemap = services
      .filter((s: any) => s.active !== false && s.slug)
      .map((s: any) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

    // Blog Post Routes
    const blogRoutes: MetadataRoute.Sitemap = blogPosts
      .filter((b: any) => b.published !== false && b.slug)
      .map((b: any) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.publishedAt ? new Date(b.publishedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }));

    // Custom CMS Pages Routes
    const customPageRoutes: MetadataRoute.Sitemap = customPages
      .filter((p: any) => p.published !== false && p.slug)
      .map((p: any) => ({
        url: `${baseUrl}/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    return [
      ...staticRoutes,
      ...destinationRoutes,
      ...universityRoutes,
      ...serviceRoutes,
      ...blogRoutes,
      ...customPageRoutes,
    ];
  } catch (error) {
    console.error('[Sitemap Generator Error]:', error);
    return staticRoutes;
  }
}
