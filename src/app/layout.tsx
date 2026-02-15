import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Anime Merch',
  description: 'Anime merch store'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Inter:wght@700&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Montserrat', 'Inter', Arial, sans-serif; font-weight: 900; letter-spacing: 0.01em; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Montserrat', Arial, sans-serif; font-weight: 900; letter-spacing: 0.01em; }
        `}</style>
      <script async defer data-domain="anime-merch.local" src="https://plausible.io/js/plausible.js"></script>
      </head>
      <body style={{background:'linear-gradient(180deg,#0b1220 0%, #23232b 100%)', color:'#fff', minHeight:'100dvh', fontFamily: 'Montserrat, Inter, Arial, sans-serif'}}>
        <Header />
        <main style={{maxWidth:1100, margin:'0 auto', padding:'32px 16px'}}>
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
