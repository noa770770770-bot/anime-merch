'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function Recommendations({ slug }: { slug: string }) {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}/recommend`)
      .then(res => res.json())
      .then(d => { 
        if (d.ok && d.recommendations) setRecs(d.recommendations);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading || (!recs || recs.length === 0)) return null;

  return (
    <div style={{ marginTop: 64, borderTop: '1px solid var(--border)', paddingTop: 40, marginBottom: 40 }}>
      <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        ✨ Frequently Bought Together
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: 24 
      }}>
        {recs.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
