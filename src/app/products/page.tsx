import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import SortSelect from '@/components/SortSelect';
import Link from 'next/link';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{ category?: string; sort?: string; q?: string; minPrice?: string; maxPrice?: string; inStock?: string; page?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { category, sort, q, minPrice, maxPrice, inStock, page: queryPage } = params;

  const page = Number(queryPage) || 1;
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const [categories, contentList] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.siteContent.findMany()
  ]);

  const content: Record<string, string> = contentList.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  // Build where clause
  const where: any = { active: true };
  if (category) {
    where.category = { slug: category };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (minPrice || maxPrice) {
    where.priceILS = {};
    if (minPrice && !isNaN(Number(minPrice))) where.priceILS.gte = Number(minPrice);
    if (maxPrice && !isNaN(Number(maxPrice))) where.priceILS.lte = Number(maxPrice);
  }
  if (inStock === 'true') {
    where.variants = { some: { stock: { gt: 0 } } };
  }

  // Build orderBy
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { priceILS: 'asc' };
  else if (sort === 'price_desc') orderBy = { priceILS: 'desc' };
  else if (sort === 'name') orderBy = { name: 'asc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      // include: { reviews: true, variants: true } // Temporarily disable to debug 500
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasActiveFilters = !!(minPrice || maxPrice || inStock || q || category);

  const showArrivals = sort === 'newest';
  const heroTitle = showArrivals 
    ? (content['arrivals_hero_title'] || '✨ New Arrivals') 
    : (content['shop_hero_title'] || '🛍️ Shop All');
  const heroSubtitle = showArrivals 
    ? (content['arrivals_hero_subtitle'] || 'The Fresh Drops direct from Tokyo') 
    : (content['shop_hero_subtitle'] || 'Exclusive Japanese Collectibles');
  const heroImage = content.shop_hero_image || 'https://images.unsplash.com/photo-1578632738980-4334635c890a?q=80&w=2000';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '100px 20px 80px',
        textAlign: 'center',
        background: `linear-gradient(rgba(10,10,18,0.3), rgba(10,10,18,0.8)), url("${heroImage}") center/cover no-repeat`,
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
        marginBottom: 40
      }}>
        <div style={{ position: 'relative', zIndex: 1, animation: 'fade-up 0.8s ease' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: 16 }}>
            {heroTitle}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            {heroSubtitle}
          </p>
        </div>
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '150%', height: '150%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          opacity: 0.4, pointerEvents: 'none'
        }}></div>
      </div>

      <div className="container">
        {/* Unified Search & Filter Bar */}
        <div className="glass" style={{ 
          display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', 
          alignItems: 'center', padding: '16px 24px', borderRadius: 'var(--radius-lg)',
          position: 'sticky', top: 'calc(var(--header-height) + 12px)', zIndex: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          {/* Search form */}
          <form method="get" style={{ display: 'flex', gap: 10, flex: '1 1 320px' }}>
            {category && <input type="hidden" name="category" value={category} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input 
                name="q" type="text" placeholder="Search characters, figures, apparel..." 
                defaultValue={q || ''} className="form-input" 
                style={{ paddingLeft: 40, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>Find</button>
          </form>

          {/* Sort Select */}
          <Suspense fallback={<div style={{ width: 180, height: 40, background: 'rgba(255,255,255,0.05)' }}></div>}>
            <SortSelect defaultValue={sort || 'newest'} />
          </Suspense>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: 32 }}>
          <Suspense fallback={<div className="glass" style={{ height: 60, borderRadius: 'var(--radius)' }}></div>}>
            <ProductFilters categories={categories} />
          </Suspense>
        </div>

        {/* Results Info */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
             Showing <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{products.length}</span> of <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{totalItems}</span> items
          </div>
          {hasActiveFilters && (
            <Link href="/products" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>✕ Clear all filters</Link>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ 
            padding: '100px 20px', textAlign: 'center', background: 'var(--bg-card)', 
            borderRadius: 'var(--radius-lg)', border: '1px dotted var(--border)' 
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🥡</div>
            <h3 style={{ fontSize: 24, marginBottom: 8 }}>Empty Box!</h3>
            <p style={{ color: 'var(--text-muted)' }}>We couldn't find any products matching your specific filters.</p>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: 24 }}>Reset Search</Link>
          </div>
        ) : (
          <>
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 32 }}>
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Upgrade */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, 
                marginTop: 64, padding: '32px 0', borderTop: '1px solid var(--border)' 
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginRight: 12 }}>PAGE</span>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                  const paramsObj = new URLSearchParams();
                  if (category) paramsObj.set('category', category);
                  if (sort) paramsObj.set('sort', sort);
                  if (q) paramsObj.set('q', q);
                  paramsObj.set('page', p.toString());
                  
                  return (
                    <Link
                      key={p}
                      href={`/products?${paramsObj.toString()}`}
                      className={`btn ${page === p ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ 
                        minWidth: 44, height: 44, padding: 0, 
                        background: page === p ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius)'
                      }}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Decorative background flare */}
      <div style={{ 
        position: 'fixed', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', 
        background: 'radial-gradient(circle, var(--accent2-glow) 0%, transparent 70%)',
        opacity: 0.1, pointerEvents: 'none', zIndex: -1 
      }}></div>
    </div>
  );
}
