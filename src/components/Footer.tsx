import Link from 'next/link';

export default function Footer({ content = {} }: { content?: Record<string, string> }) {
  return (
    <footer style={{
      marginTop: 80,
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '48px 20px 32px',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-heading)', marginBottom: 12 }}>
              {content.site_title?.split(' ')[0] || 'Anime'}<span style={{ color: 'var(--accent)' }}>{content.site_title?.split(' ').slice(1).join(' ') || 'Merch'}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
              {content.home_hero_subtitle || 'Your one-stop shop for premium anime merchandise, figures, apparel, and collectibles.'}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/products" style={{ color: 'var(--text-muted)', fontSize: 14, transition: 'color 0.2s' }}>All Products</Link>
              <Link href="/products?sort=newest" style={{ color: 'var(--text-muted)', fontSize: 14 }}>New Arrivals</Link>
              <Link href="/products?sort=price_asc" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Best Deals</Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>Help</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/faq" style={{ color: 'var(--text-muted)', fontSize: 14 }}>FAQ</Link>
              <Link href="/shipping" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Shipping Info</Link>
              <Link href="/returns" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Returns</Link>
              <Link href="/contact" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Contact Us</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/privacy" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            © {new Date().getFullYear()} {content.site_title || 'AnimeMerch'}. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>🇮🇱 Prices in ILS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
