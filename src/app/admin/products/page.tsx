import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminProducts(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q;
  const category = searchParams?.category;

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
      // include: { variants: true, category: true } // Temporarily disable to debug 500
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Products Management 📦</h1>
          <p className="page-subtitle">{products.length} active items in your catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary" style={{ boxShadow: 'var(--shadow-glow-accent)' }}>+ Add New Product</Link>
      </div>

      {/* Advanced Filters */}
      <div className="glass" style={{ display: 'flex', gap: 16, marginBottom: 32, padding: '24px', borderRadius: 'var(--radius-lg)', alignItems: 'center', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
        <form method="get" style={{ display: 'flex', gap: 12, flex: 1, minWidth: 320 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>🔍</span>
            <input
              name="q" defaultValue={q || ''}
              placeholder="Filter by name or description..."
              className="form-input"
              style={{ paddingLeft: 42, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <select
            name="category" defaultValue={category || ''}
            className="form-select"
            style={{ width: 200, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            onChange={(e) => e.target.form?.submit()}
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-secondary">Filter</button>
          {(q || category) && (
            <Link href="/admin/products" className="btn btn-ghost" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>✕</span> Reset
            </Link>
          )}
        </form>
      </div>

      {products.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🥡</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No products found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 24px' }}>
            We couldn't find any products matching your search or filters.
          </p>
          <Link href="/admin/products/new" className="btn btn-primary">Create Your First Product</Link>
        </div>
      ) : (
        <div className="table-container" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table className="data-table">
            <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
              <tr>
                <th style={{ padding: '16px 20px' }}>Product Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Global Stock</th>
                <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => {
                const totalStock = p.variants?.reduce((s: number, v: any) => s + (v.stock || 0), 0) || 0;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                          <img
                            src={p.imageUrl || '/products/anime-ai-placeholder.svg'}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                           <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                           <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                       {p.category ? (
                         <span className="badge" style={{ background: 'rgba(124,91,245,0.1)', color: 'var(--accent2)', border: '1px solid rgba(124,91,245,0.2)', fontSize: 11, fontWeight: 700 }}>
                           {p.category.name}
                         </span>
                       ) : <span style={{ opacity: 0.3 }}>Uncategorized</span>}
                    </td>
                    <td style={{ fontWeight: 800, fontSize: 15 }}>{p.priceILS} ₪</td>
                    <td>
                      <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`} style={{ 
                        fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' 
                      }}>
                        {p.active ? '● LIVE' : '○ DRAFT'}
                      </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ 
                            width: 8, height: 8, borderRadius: '50%',
                            background: totalStock === 0 ? 'var(--accent)' : totalStock < 5 ? 'var(--warning)' : 'var(--success)',
                            boxShadow: totalStock === 0 ? '0 0 8px var(--accent)' : 'none'
                          }}></span>
                          <span style={{ 
                            fontWeight: 700,
                            color: totalStock === 0 ? 'var(--accent)' : 'var(--text-primary)',
                            fontSize: 13
                          }}>
                            {totalStock} Left
                          </span>
                       </div>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 20 }}>
                      <Link href={`/admin/products/${p.id}`} className="btn btn-ghost btn-sm" style={{ fontWeight: 700 }}>Edit</Link>
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
