import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import ScrollToTop from '@/components/ScrollToTop';
import type { ReactNode } from 'react';

import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Otaku Merch — Premium Israeli Anime Store',
  description: 'Shop the best anime figures, apparel, accessories, and collectibles in Israel. Premium quality, fast priority shipping.',
  keywords: 'anime, merch, israel, figures, apparel, collectibles, otaku',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://anime-merch-israel.com',
    title: 'Otaku Merch — Premium Israeli Anime Store',
    description: 'Shop the best anime figures, apparel, accessories, and collectibles. Premium quality, fast shipping.',
    siteName: 'Otaku Merch Israel',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'Otaku Merch Logo' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Otaku Merch — Premium Israeli Anime Store',
    description: 'Shop the best anime figures, apparel, accessories, and collectibles in Israel. Premium quality, fast priority shipping.',
    images: ['/logo.png'],
  }
};

import prisma from '@/lib/prisma';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const contentList = await prisma.siteContent.findMany();
  const content: Record<string, string> = contentList.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />
        <title>{content.site_title || 'Otaku Merch — Premium Israeli Anime Store'}</title>
      </head>
      <body>
        <Providers>
          {content.announcement_bar && (
            <div style={{ 
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))', 
              color: '#fff', textAlign: 'center', padding: '10px 20px', 
              fontSize: 13, fontWeight: 800, letterSpacing: '0.02em' 
            }}>
              {content.announcement_bar}
            </div>
          )}
          <Header content={content} />
          <main style={{ minHeight: 'calc(100dvh - var(--header-height) - 200px)' }}>
            {children}
          </main>
          <Footer content={content} />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
