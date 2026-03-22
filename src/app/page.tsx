import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function Home() {
  const [products, categories, contentList] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.category.findMany({ take: 6 }),
    prisma.siteContent.findMany()
  ]);

  const content: Record<string, string> = contentList.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(10,10,18,0.4), rgba(10,10,18,0.7)), url("${content.home_hero_image || 'https://images.unsplash.com/photo-1578632738980-4334635c890a?q=80&w=2000'}") center/cover no-repeat`
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            {content.home_hero_tagline || '✦ Premium Anime Merchandise ✦'}
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            {content.home_hero_title?.split(' ').map((word: string, i: number) => 
               i === content.home_hero_title.split(' ').length - 1 ? (
                 <span key={i} style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> {word}</span>
               ) : <span key={i}> {word}</span>
            )}
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {content.home_hero_subtitle || 'Discover hand-picked figures, apparel, accessories, and collectibles from your favorite anime series.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-primary btn-lg">
              {content.home_hero_cta_primary || '🛍️ Shop Now'}
            </Link>
            <Link href="/products?sort=newest" className="btn btn-secondary btn-lg">
              {content.home_hero_cta_secondary || '✨ New Arrivals'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 20px 48px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '🚀', title: 'Fast Shipping', desc: 'Worldwide delivery in 3-7 days' },
              { icon: '🔒', title: 'Secure Payment', desc: 'PayPal & credit card checkout' },
              { icon: '🔄', title: 'Easy Returns', desc: '30-day hassle-free returns' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Authentic licensed merchandise' },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                textAlign: 'center',
                transition: 'all var(--transition)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="page-section" style={{ padding: '0 20px 48px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.75rem' }}>Shop by Category</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 15,
                  transition: 'all var(--transition)',
                }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="page-section" style={{ padding: '0 20px 64px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.75rem' }}>Featured Products</h2>
            <Link href="/products" className="btn btn-ghost">
              View All →
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛍️</div>
              <h3>No products yet</h3>
              <p>Check back soon for amazing anime merch!</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{
        padding: '64px 20px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Stay in the Loop</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Get notified about new drops, exclusive deals, and anime news.</p>
          <form action="/#subscribe" style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
