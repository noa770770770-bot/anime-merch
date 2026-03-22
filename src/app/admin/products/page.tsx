import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const { q, category } = params;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { variants: true, category: true }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {/* Admin Filters */}
      <div className="glass" style={{ display: 'flex', gap: 16, marginBottom: 24, padding: 20, borderRadius: 'var(--radius-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
        <form method="get" style={{ display: 'flex', gap: 12, flex: 1, minWidth: 300 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            <input
              name="q" defaultValue={q || ''}
              placeholder="Search products..."
              className="form-input"
              style={{ paddingLeft: 36, background: 'rgba(255,255,255,0.03)' }}
            />
          </div>
          <select
            name="category" defaultValue={category || ''}
            className="form-select"
            style={{ width: 180, background: 'rgba(255,255,255,0.03)' }}
            onChange={(e) => e.target.form?.submit()}
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-secondary">Search</button>
          {(q || category) && (
            <Link href="/admin/products" className="btn btn-ghost" style={{ fontSize: 13 }}>✕ Reset</Link>
          )}
        </form>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products yet</h3>
          <p>Add your first product to get started.</p>
          <Link href="/admin/products/new" className="btn btn-primary" style={{ marginTop: 16 }}>Add Product</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => {
                const totalStock = p.variants?.reduce((s: number, v: any) => s + (v.stock || 0), 0) || 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={p.imageUrl || '/products/anime-ai-placeholder.svg'}
                          alt={p.name}
                          style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--bg-surface)' }}
                        />
                        <div>
                           <div style={{ fontWeight: 600 }}>{p.name}</div>
                           <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                       {p.category ? (
                         <span className="badge badge-ghost" style={{ fontSize: 11 }}>{p.category.name}</span>
                       ) : <span style={{ opacity: 0.3 }}>—</span>}
                    </td>
                    <td style={{ fontWeight: 700 }}>{p.priceILS} ₪</td>
                    <td>
                      <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                       <span style={{ 
                         color: totalStock === 0 ? 'var(--accent)' : 'var(--text-primary)', 
                         fontWeight: totalStock === 0 ? 800 : 500,
                         fontSize: 13
                       }}>
                         {totalStock} in stock
                       </span>
                    </td>
                    <td>
                      <Link href={`/admin/products/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
