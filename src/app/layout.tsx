import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingContact from '@/components/layout/FloatingContact';
import AiChatWidget from '@/components/layout/AiChatWidget';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

  return {
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
      'student visa guidance',
      'university admissions consultancy',
      'scholarships for international students',
    ],
    authors: [{ name: companyName }],
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
      siteName: companyName,
      images: logoUrl ? [{ url: logoUrl }] : [],
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
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-amber-400 selection:text-slate-950 pb-16 sm:pb-0">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <Navbar
          navSettings={navigationSettings}
          generalSettings={generalSettings}
          countries={liveCountries}
          universities={liveUniversities}
          topBarSettings={homepageSettings?.topBar}
        />
        <main className="flex-1">{children}</main>
        <AiChatWidget />
        <FloatingContact generalSettings={generalSettings} />
        <Footer
          footerSettings={footerSettings}
          generalSettings={generalSettings}
          countries={liveCountries}
          services={liveServices}
        />
      </body>
    </html>
  );
}
