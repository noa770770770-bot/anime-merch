import prisma from '@/lib/prisma';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params?.status;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  const statuses = ['CREATED', 'PAID', 'SHIPPED', 'FULFILLED', 'CANCELED', 'FAILED'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        <Link href="/admin/orders" className={`btn btn-sm ${!status ? 'btn-primary' : 'btn-secondary'}`}>All</Link>
        {statuses.map(s => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-secondary'}`}>
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧾</div>
          <h3>No orders found</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tracking</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td style={{ fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.email || o.shippingName || '—'}</td>
                  <td>{o.items?.length || 0}</td>
                  <td style={{ fontWeight: 700 }}>{o.totalILS} ₪</td>
                  <td>
                    <span className={`badge ${
                      o.status === 'PAID' || o.status === 'FULFILLED' ? 'badge-success' :
                      o.status === 'SHIPPED' ? 'badge-info' :
                      o.status === 'CANCELED' || o.status === 'FAILED' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{o.trackingNumber || '—'}</td>
                  <td><Link href={`/admin/orders/${o.id}`} className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
