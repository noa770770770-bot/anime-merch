'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          style={{ width: '100%', paddingLeft: 36, background: 'var(--bg-surface)', border: 'none', height: 40 }}
          placeholder="Search characters or figures..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
          🔍
        </div>
        {loading && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: 12 }}>
            ...
          </div>
        )}
      </form>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
          background: 'var(--bg-nav)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          overflow: 'hidden', zIndex: 100
        }}>
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {results.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} onClick={() => setIsOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: '1px solid var(--border)', transition: 'background 0.2s'
                }} className="hover:bg-surface">
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                    <img src={p.imageUrl || '/products/anime-ai-placeholder.svg'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    {p.category && <div style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 800 }}>{p.category.name}</div>}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--accent3)', fontSize: 13 }}>
                    {p.priceILS} ₪
                  </div>
                </Link>
              ))}
              <Link href={`/products?q=${encodeURIComponent(query)}`} onClick={() => setIsOpen(false)} style={{
                display: 'block', padding: '12px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)'
              }} className="hover:text-primary">
                View all results &rarr;
              </Link>
            </div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No figures found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
