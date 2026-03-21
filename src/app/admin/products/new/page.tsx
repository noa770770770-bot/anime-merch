'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

export default function NewProduct() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => {
      if (d.categories) setCategories(d.categories);
    });
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(value));
    }
  };

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name || !slug || !price || Number(price) <= 0) {
      setError('Name, slug, and a valid price are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, priceILS: Number(price), imageUrl, active, categoryId: categoryId || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === 'slug_taken' ? 'This slug is already taken.' : data.error || 'Failed to create product');
        setLoading(false);
        return;
      }
      toast('Product created successfully!', 'success');
      router.push('/admin/products/' + data.id);
    } catch (err: any) {
      setError(String(err));
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <h1>New Product</h1>
          <p className="page-subtitle">Add a new product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={name} onChange={e => handleNameChange(e.target.value)} required placeholder="e.g. Naruto Figure" />
          </div>

          <div className="form-group">
            <label className="form-label">Slug * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(auto-generated from name)</span></label>
            <input className="form-input" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="naruto-figure" />
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
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₪) *</label>
              <input className="form-input" type="number" min="1" value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')} required placeholder="99" />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          {imageUrl && (
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg-surface)', maxWidth: 200 }}>
              <img src={imageUrl} alt="Preview" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input className="form-checkbox" type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} />
            <label htmlFor="active" style={{ fontSize: 14, fontWeight: 600 }}>Active (visible in store)</label>
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 16, padding: 12, background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)',
            borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: 14, fontWeight: 600,
          }}>{error}</div>
        )}

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 20 }}>
          {loading ? 'Creating...' : '+ Create Product'}
        </button>
      </form>
    </div>
  );
}
