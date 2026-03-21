import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default async function Home() {
  const products = await prisma.product.findMany({ take: 6, orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <section className="home-hero">
        <div>
          <h1 className="home-title">Wear the vibe — anime-inspired merch</h1>
          <p className="home-subtitle">Premium tees, hoodies, and accessories made for fans. Fast shipping and easy returns.</p>
          <div className="home-hero-actions">
            <Link href="/products?new=true"><Button>Shop New</Button></Link>
            <Link href="/products?best=true"><Button variant="secondary">Best Sellers</Button></Link>
          </div>
        </div>
        <div className="home-hero-image" />
      </section>

      <section className="home-features">
        <Card><h4>Fast shipping</h4><p>Ships in 1-3 business days.</p></Card>
        <Card><h4>Premium quality</h4><p>Top materials and printing.</p></Card>
        <Card><h4>Easy returns</h4><p>30-day returns policy.</p></Card>
      </section>

      <section className="home-featured">
        <div className="home-featured-header">
          <h2>Featured products</h2>
          <Link href="/products">View all</Link>
        </div>
        <div className="home-featured-grid">
          {products.map(p => {
            let imgSrc = '/products/placeholder.svg';
            if (Array.isArray(p.images) && typeof p.images[0] === 'string' && p.images[0].trim() !== '') {
              imgSrc = p.images[0];
            } else if (typeof p.images === 'string' && p.images.trim() !== '') {
              imgSrc = p.images;
            } else if (p.imageUrl && p.imageUrl.trim() !== '') {
              imgSrc = p.imageUrl;
            }
            return (
              <Card key={p.id} className="product-card">
                <img src={imgSrc} alt={p.name} className="product-image" />
                <div className="product-info">
                  <div className="product-title">{p.name}</div>
                  <div className="product-price">{p.priceILS} ILS</div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="home-newsletter">
        <h3>Join our newsletter</h3>
        <form className="newsletter-form">
          <Input placeholder="Your email" type="email" required />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
