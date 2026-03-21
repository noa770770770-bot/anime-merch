'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

export default function NewCategory() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  };

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Failed to create category', 'error');
        setLoading(false);
        return;
      }
      toast('Category created!', 'success');
      router.push('/admin/categories');
    } catch (err: any) {
      toast('Network error', 'error');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <div className="page-header">
        <div>
          <h1>New Category</h1>
          <p className="page-subtitle">Add a category to organize your merch</p>
        </div>
        <Link href="/admin/categories" className="btn btn-secondary btn-sm">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--bg-card)', padding: 24,
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'
      }}>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Category Name</label>
          <input className="form-input" value={name} onChange={e => handleNameChange(e.target.value)} required placeholder="e.g. Action Figures" />
        </div>
        
        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="form-label">Slug</label>
          <input className="form-input" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="action-figures" />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creating...' : '+ Create Category'}
        </button>
      </form>
    </div>
  );
}
