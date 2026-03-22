import prisma from '@/lib/prisma';
import Link from 'next/link';
import AdminCharts from '@/components/AdminCharts';

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  // Calculate revenue
  const orders = await prisma.order.findMany({ where: { status: { in: ['CREATED', 'PAID', 'FULFILLED', 'SHIPPED'] } } });
  const revenue = orders.reduce((s: number, o: any) => s + o.totalILS, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your store</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{productCount}</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{orderCount}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent3)' }}>{revenue} ₪</div>
          <div className="stat-label">Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{userCount}</div>
          <div className="stat-label">Registered Users</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        <Link href="/admin/products" className="btn btn-secondary">📦 Manage Products</Link>
        <Link href="/admin/editor" className="btn btn-secondary" style={{ background: 'var(--accent)', color: 'white' }}>🏗️ Site Editor</Link>
        <Link href="/admin/orders" className="btn btn-secondary">🧾 View Orders</Link>
        <Link href="/admin/categories" className="btn btn-secondary">🗂️ Categories</Link>
        <Link href="/admin/promos" className="btn btn-secondary">🎫 Promos</Link>
        <Link href="/admin/users" className="btn btn-secondary">👤 Users</Link>
      </div>

      {/* Advanced Revenue Visualization Engine */}
      <AdminCharts />

      {/* Recent Orders */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: 24 }}>No orders yet.</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>{o.email || '—'}</td>
                    <td style={{ fontWeight: 700 }}>{o.totalILS} ₪</td>
                    <td>
                      <span className={`badge ${o.status === 'PAID' || o.status === 'FULFILLED' ? 'badge-success' : o.status === 'SHIPPED' ? 'badge-info' : o.status === 'CANCELED' || o.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className="btn btn-ghost btn-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
