'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ProductFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentQ = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || '';
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [expanded, setExpanded] = useState(false);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    if (currentQ) params.set('q', currentQ);
    if (currentSort) params.set('sort', currentSort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStock) params.set('inStock', 'true');
    router.push(`/products?${params.toString()}`);
  };

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters = !!(minPrice || maxPrice || inStock);

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Category Pills Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button
          onClick={() => setCategory('')}
          className={`btn ${!currentCategory ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          style={{ fontSize: 13, padding: '6px 14px' }}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`btn ${currentCategory === cat.slug ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            style={{ fontSize: 13, padding: '6px 14px' }}
          >
            {cat.name}
          </button>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 13, gap: 6, display: 'flex', alignItems: 'center' }}
          >
            ⚙️ Filters {hasActiveFilters && <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>!</span>}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Row */}
      {expanded && (
        <form onSubmit={applyFilters} style={{
          display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
          padding: '12px 16px',
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          animation: 'fade-in 0.2s ease'
        }}>
          <label className="form-label" style={{ fontSize: 13, margin: 0, whiteSpace: 'nowrap' }}>Price ₪</label>
          <input 
            type="number" placeholder="Min" className="form-input" 
            style={{ width: 80, padding: '6px 10px', fontSize: 13 }}
            value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0"
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input 
            type="number" placeholder="Max" className="form-input" 
            style={{ width: 80, padding: '6px 10px', fontSize: 13 }}
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0"
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <input 
              type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
            />
            In Stock
          </label>

          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 16px', fontSize: 13 }}>
            Apply
          </button>
          
          {hasActiveFilters && (
            <button 
              type="button" 
              onClick={() => {
                setMinPrice(''); setMaxPrice(''); setInStock(false);
                const params = new URLSearchParams(searchParams.toString());
                params.delete('minPrice'); params.delete('maxPrice'); params.delete('inStock'); params.delete('page');
                router.push(`/products?${params.toString()}`);
              }}
              className="btn btn-ghost btn-sm" 
              style={{ fontSize: 13, color: 'var(--text-muted)' }}
            >
              Clear
            </button>
          )}
        </form>
      )}
    </div>
  );
}
