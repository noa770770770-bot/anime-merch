'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

export default function PromosAdmin() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [active, setActive] = useState(true);

  async function loadPromos() {
    setLoading(true);
    const res = await fetch('/api/admin/promos');
    const data = await res.json();
    if (data.promos) setPromos(data.promos);
    setLoading(false);
  }

  useEffect(() => { loadPromos(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code || !discount) return;
    const res = await fetch('/api/admin/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, discountPercentage: discount, usageLimit, active })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || 'Failed to create promo', 'error');
      return;
    }
    toast('Promo code created', 'success');
    setCode(''); setDiscount(''); setUsageLimit('');
    await loadPromos();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Promo Codes</h1>
          <p className="page-subtitle">Manage discounts and promotions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Used</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5}>Loading...</td></tr> : promos.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 800 }}>{p.code}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.discountPercentage}% OFF</td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{p.usageCount}</td>
                  <td>{p.usageLimit || '∞'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleCreate} style={{
          background: 'var(--bg-card)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
          alignSelf: 'start'
        }}>
          <h3 style={{ marginBottom: 16 }}>New Promo Code</h3>
          
          <div className="form-group">
            <label className="form-label">Code *</label>
            <input className="form-input" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required placeholder="e.g. SUMMER20" />
          </div>

          <div className="form-group">
            <label className="form-label">Discount % *</label>
            <input className="form-input" type="number" value={discount} onChange={e => setDiscount(e.target.value)} required min="1" max="100" />
          </div>

          <div className="form-group">
            <label className="form-label">Usage Limit (Optional)</label>
            <input className="form-input" type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} min="1" placeholder="e.g. 100" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
             <input type="checkbox" id="active" className="form-checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
             <label htmlFor="active" style={{ fontSize: 13, fontWeight: 600 }}>Active immediately</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Code</button>
        </form>
      </div>
    </div>
  );
}
