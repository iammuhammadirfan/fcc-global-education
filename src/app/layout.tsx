import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingContact from '@/components/layout/FloatingContact';
import AiChatWidget from '@/components/layout/AiChatWidget';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f59e0b',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const generalSettings = (await db.getTable('generalSettings')) || {};
  const companyName = generalSettings.companyName || 'FCC Global Education';
  const tagline = generalSettings.tagline || 'World-Class Study Abroad Counseling';
  const logoUrl = generalSettings.faviconUrl || generalSettings.logoUrl || '/logo.svg';
  const description = generalSettings.shortDescription || `${companyName} - Premier international education consultancy providing end-to-end university shortlisting, fast-track admissions, scholarship counseling, and student visa approvals across top universities worldwide.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fccglobaleducation.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${companyName} | ${tagline}`,
      template: `%s | ${companyName}`,
    },
    description,
    keywords: [
      'study abroad consultants',
      'overseas education consultancy',
      'study in UK',
      'study in USA',
      'study in Canada',
      'study in Australia',
      'study in Germany',
      'student visa guidance',
      'university admissions consultancy',
      'scholarships for international students',
      'FCC Global Education sitemap',
    ],
    authors: [{ name: companyName }],
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: logoUrl, sizes: 'any' },
        { url: logoUrl, type: 'image/png' },
      ],
      shortcut: logoUrl,
      apple: logoUrl,
    },
    openGraph: {
      title: `${companyName} | ${tagline}`,
      description,
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: companyName,
      images: logoUrl ? [{ url: logoUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${companyName} | ${tagline}`,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
  };
}

import { Suspense } from 'react';
import TopProgressBar from '@/components/ui/TopProgressBar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    generalSettings,
    navigationSettings,
    footerSettings,
    homepageSettings,
    allCountries,
    allUniversities,
    allServices,
  ] = await Promise.all([
    db.getTable('generalSettings').then((res) => res || {}),
    db.getTable('navigationSettings').then((res) => res || {}),
    db.getTable('footerSettings').then((res) => res || {}),
    db.getTable('homepageSettings').then((res) => res || {}),
    db.getTable('countries').then((res) => res || []),
    db.getTable('universities').then((res) => res || []),
    db.getTable('services').then((res) => res || []),
  ]);

  const liveCountries = allCountries.filter((c: any) => c.published !== false);
  const liveUniversities = allUniversities.filter((u: any) => u.published !== false);
  const liveServices = allServices.filter((s: any) => s.active !== false);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#f59e0b" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'EducationalOrganization',
                  '@id': 'https://fccglobaleducation.com/#organization',
                  name: generalSettings?.companyName || 'FCC Global Education',
                  url: 'https://fccglobaleducation.com',
                  logo: generalSettings?.logoUrl || 'https://fccglobaleducation.com/logo.svg',
                  description: generalSettings?.shortDescription || 'Premier international education consultancy facilitating admissions, scholarship strategy, and visa success.',
                  telephone: generalSettings?.phone || '+44 (0) 20 7946 0912',
                  email: generalSettings?.email || 'admissions@fccglobaleducation.com',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: generalSettings?.address || 'Level 4, 30 St Mary Axe',
                    addressCountry: 'UK',
                  },
                  sameAs: [
                    'https://facebook.com/fccglobaleducation',
                    'https://instagram.com/fccglobaleducation',
                    'https://linkedin.com/company/fccglobaledu',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://fccglobaleducation.com/#website',
                  url: 'https://fccglobaleducation.com',
                  name: generalSettings?.companyName || 'FCC Global Education',
                  publisher: {
                    '@id': 'https://fccglobaleducation.com/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://fccglobaleducation.com/universities?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-amber-400 selection:text-slate-950 pb-16 sm:pb-0 overflow-x-clip w-full max-w-full relative">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <div className="w-full max-w-full overflow-x-clip flex flex-col min-h-screen">
          <Navbar
            navSettings={navigationSettings}
            generalSettings={generalSettings}
            countries={liveCountries}
            universities={liveUniversities}
            topBarSettings={homepageSettings?.topBar}
          />
          <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
          <Footer
            footerSettings={footerSettings}
            generalSettings={generalSettings}
            countries={liveCountries}
            services={liveServices}
          />
        </div>
        <AiChatWidget />
        <FloatingContact generalSettings={generalSettings} />
      </body>
    </html>
  );
}
