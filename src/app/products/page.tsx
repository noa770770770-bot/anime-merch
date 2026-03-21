import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ category?: string; sort?: string; q?: string; minPrice?: string; maxPrice?: string; inStock?: string; page?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { category, sort, q, minPrice, maxPrice, inStock, page: queryPage } = params;

  const page = Number(queryPage) || 1;
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

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
    if (minPrice) where.priceILS.gte = Number(minPrice);
    if (maxPrice) where.priceILS.lte = Number(maxPrice);
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
      include: { reviews: true, variants: true }
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1>Shop All Products</h1>
          <p className="page-subtitle">{totalItems} product{totalItems !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Top Search & Sort Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <form method="get" style={{ display: 'flex', gap: 8, flex: '1 1 280px' }}>
          {category && <input type="hidden" name="category" value={category} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <input name="q" type="text" placeholder="🔍 Search products..." defaultValue={q || ''} className="form-input" style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <form method="get" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {category && <input type="hidden" name="category" value={category} />}
          {q && <input type="hidden" name="q" value={q} />}
          <select name="sort" defaultValue={sort || 'newest'} className="form-select" style={{ minWidth: 160 }}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name">Name A-Z</option>
          </select>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 12px' }}>Sort</button>
        </form>
      </div>

      {/* Compact Category & Filter Row */}
      <ProductFilters categories={categories} />

      {/* Product Grid — Full Width */}
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters.</p>
          <Link href="/products" className="btn btn-secondary" style={{ marginTop: 16 }}>Clear Filters</Link>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48, padding: '24px 0', borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const paramsObj = new URLSearchParams();
                if (category) paramsObj.set('category', category);
                if (sort) paramsObj.set('sort', sort);
                if (q) paramsObj.set('q', q);
                if (minPrice) paramsObj.set('minPrice', minPrice);
                if (maxPrice) paramsObj.set('maxPrice', maxPrice);
                if (inStock) paramsObj.set('inStock', inStock);
                paramsObj.set('page', p.toString());
                
                return (
                  <Link
                    key={p}
                    href={`/products?${paramsObj.toString()}`}
                    className={`btn ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: 40, padding: 8, textAlign: 'center' }}
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
  );
}
