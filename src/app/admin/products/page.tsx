import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, include: { variants: true } });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
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
                <th>Slug</th>
                <th>Price</th>
                <th>Status</th>
                <th>Variants</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={p.imageUrl || '/products/anime-ai-placeholder.svg'}
                        alt={p.name}
                        style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--bg-surface)' }}
                      />
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.slug}</td>
                  <td style={{ fontWeight: 700 }}>{p.priceILS} ₪</td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{p.variants?.length || 0}</td>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
