'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { use } from 'react';
import Link from 'next/link';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [priceILS, setPriceILS] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  // Variant form
  const [vName, setVName] = useState('');
  const [vValue, setVValue] = useState('');
  const [vStock, setVStock] = useState(0);
  const [vPrice, setVPrice] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => {
      if (d.categories) setCategories(d.categories);
    });

    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.product) {
          const p = data.product;
          setProduct(p);
          setName(p.name);
          setSlug(p.slug);
          setDescription(p.description || '');
          setPriceILS(p.priceILS);
          setImageUrl(p.imageUrl || '');
          setActive(p.active);
          setCategoryId(p.categoryId || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, priceILS, imageUrl, active, categoryId: categoryId || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Save failed'); setSaving(false); return; }
      toast('Product saved!', 'success');
      router.refresh();
    } catch (err: any) { setError(String(err)); }
    setSaving(false);
  }

  async function handleAddVariant(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/products/${id}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: vName, value: vValue, stock: vStock, priceILS: vPrice ? Number(vPrice) : null }),
      });
      if (res.ok) {
        toast('Variant added!', 'success');
        setVName(''); setVValue(''); setVStock(0); setVPrice('');
        // Refresh product data
        const r = await fetch(`/api/admin/products/${id}`);
        const d = await r.json();
        if (d.product) setProduct(d.product);
      }
    } catch {}
  }

  async function handleDeleteVariant(vid: string) {
    if (!confirm('Delete this variant?')) return;
    try {
      await fetch(`/api/admin/products/${id}/variants/${vid}`, { method: 'DELETE' });
      toast('Variant deleted', 'info');
      const r = await fetch(`/api/admin/products/${id}`);
      const d = await r.json();
      if (d.product) setProduct(d.product);
    } catch {}
  }

  async function handleDeleteProduct() {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Product deleted', 'info');
        router.push('/admin/products');
      }
    } catch {}
  }

  if (loading) return <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <h1>Edit Product</h1>
          <p className="page-subtitle">{product.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/products/${product.slug}`} className="btn btn-secondary btn-sm" target="_blank">👁 View in Store</Link>
          <button className="btn btn-danger btn-sm" onClick={handleDeleteProduct}>🗑 Delete</button>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 32,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Slug *</label>
            <input className="form-input" value={slug} onChange={e => setSlug(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">-- No Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Price (₪) *</label>
            <input className="form-input" type="number" value={priceILS} onChange={e => setPriceILS(Number(e.target.value))} required />
          </div>
          <div className="form-group" style={{ 
             background: 'rgba(124,91,245,0.05)', padding: 16, border: '1px dashed var(--accent2)', borderRadius: 'var(--radius)' 
          }}>
            <label className="form-label" style={{ color: 'var(--accent2)', fontWeight: 800 }}>Cover Image URL ✨</label>
            <input className="form-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Paste direct image link here (e.g. from Imgur or Discord)" />
          </div>
          {imageUrl && (
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg-surface)', maxWidth: 200 }}>
              <img src={imageUrl} alt="Preview" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input className="form-checkbox" type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} />
            <label htmlFor="active" style={{ fontSize: 14, fontWeight: 600 }}>Active</label>
          </div>
        </div>
        {error && <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,77,106,0.1)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: 14, fontWeight: 600 }}>{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width: '100%', marginTop: 20 }}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </form>

      {/* Variants */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 28,
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Variants ({product.variants?.length || 0})</h2>

        {product.variants?.length > 0 && (
          <div className="table-container" style={{ marginBottom: 24 }}>
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Value</th><th>Stock</th><th>Price</th><th></th></tr>
              </thead>
              <tbody>
                {product.variants.map((v: any) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td>{v.value}</td>
                    <td><span className={`badge ${v.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{v.stock}</span></td>
                    <td>{v.priceILS != null ? `${v.priceILS} ₪` : '—'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteVariant(v.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Variant */}
        <form onSubmit={handleAddVariant}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Add Variant</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 100px auto', gap: 8, alignItems: 'end' }}>
            <div className="form-group">
              <input className="form-input" placeholder="Name (e.g. Size)" value={vName} onChange={e => setVName(e.target.value)} required />
            </div>
            <div className="form-group">
              <input className="form-input" placeholder="Value (e.g. M)" value={vValue} onChange={e => setVValue(e.target.value)} required />
            </div>
            <div className="form-group">
              <input className="form-input" type="number" placeholder="Stock" value={vStock} onChange={e => setVStock(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <input className="form-input" type="number" placeholder="Price" value={vPrice} onChange={e => setVPrice(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
