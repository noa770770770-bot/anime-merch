'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data.order);
        setStatus(data.order?.status || '');
        setTracking(data.order?.trackingNumber || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async () => {
    const res = await fetch(`/api/admin/orders/${id}/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) toast('Status updated!', 'success');
  };

  const setTrackingNumber = async () => {
    const res = await fetch(`/api/admin/orders/${id}/set-tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber: tracking }),
    });
    if (res.ok) toast('Tracking updated!', 'success');
  };

  if (loading) return <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h1>Order Details</h1>
          <p className="page-subtitle" style={{ fontFamily: 'monospace' }}>{order.id}</p>
        </div>
        <Link href="/admin/orders" className="btn btn-secondary">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Order Info */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> {order.email || '—'}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Total:</span> <strong>{order.totalILS} ₪</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Status:</span> <span className={`badge ${order.status === 'PAID' || order.status === 'FULFILLED' ? 'badge-success' : order.status === 'SHIPPED' ? 'badge-info' : order.status === 'CANCELED' || order.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`}>{order.status}</span></div>
            {order.paypalOrderId && <div><span style={{ color: 'var(--text-muted)' }}>PayPal:</span> {order.paypalOrderId}</div>}
          </div>
        </div>

        {/* Shipping */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Shipping</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
            <div>{order.shippingName || '—'}</div>
            <div>{order.shippingPhone || ''}</div>
            <div>{order.shippingAddress1 || ''}</div>
            {order.shippingAddress2 && <div>{order.shippingAddress2}</div>}
            <div>{order.shippingCity} {order.shippingZip}</div>
            <div>{order.shippingCountry}</div>
          </div>
        </div>
      </div>

      {/* Items */}
      {order.items?.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Items</h3>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Product</th><th>Variant</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>
                {order.items.map((i: any) => (
                  <tr key={i.id}>
                    <td>{i.product?.name || i.productId}</td>
                    <td>{i.variant ? `${i.variant.name}: ${i.variant.value}` : '—'}</td>
                    <td>{i.qty}</td>
                    <td style={{ fontWeight: 700 }}>{i.priceILS} ₪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Update Status</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1 }}>
              {['CREATED','PAID','SHIPPED','FULFILLED','CANCELED','FAILED'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={updateStatus}>Update</button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Set Tracking</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="form-input" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Tracking number" style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={setTrackingNumber}>Set</button>
          </div>
        </div>
      </div>
    </div>
  );
}
