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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Header />
          <main style={{ minHeight: 'calc(100dvh - var(--header-height) - 200px)' }}>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
