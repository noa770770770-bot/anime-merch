'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1'); // Reset to page 1 on sort change
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>SORT BY</span>
      <select 
        defaultValue={defaultValue} 
        onChange={(e) => handleSortChange(e.target.value)}
        className="form-select" style={{ minWidth: 180, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <option value="newest">Featured: Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Alphabetical (A-Z)</option>
      </select>
    </div>
  );
}
