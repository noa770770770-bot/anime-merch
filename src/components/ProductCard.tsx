'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PriceDisplay from '@/components/PriceDisplay';

export default function ProductCard({ product }: { product: any }) {
  const img = (product.images && product.images[0]) || product.imageUrl || '/products/anime-ai-placeholder.svg';
  const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <article className="card product-card-hover" style={{ 
        cursor: 'pointer', position: 'relative', overflow: 'hidden', 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}>
        {/* Subtle top gradient line for premium feel */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', zIndex: 10, opacity: 0.8 }}></div>

        {/* Image Container */}
        <div style={{
          aspectRatio: '1/1',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          position: 'relative',
        }}>
          <img
            src={img}
            alt={product.name}
            className="product-image-zoom"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6, zIndex: 2 }}>
            {isNew && (
              <span className="badge" style={{ 
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase',
                padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                boxShadow: '0 4px 12px rgba(255, 61, 113, 0.4)',
                letterSpacing: '0.05em'
              }}>
                New Arrival
              </span>
            )}
          </div>

          {/* Glass Overlay on Hover */}
          <div className="product-overlay" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,18,0.9), transparent)',
            opacity: 0, transition: 'opacity 0.4s ease',
            display: 'flex', alignItems: 'flex-end', padding: 24, zIndex: 1
          }}>
             <span style={{ color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Quick View →</span>
          </div>

          {/* Wishlist button */}
          <WishlistHeart productId={product.id} />
        </div>

        {/* Info */}
        <div style={{ padding: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <PriceDisplay amountILS={product.priceILS} className="price-tag" style={{ fontSize: '1.35rem' }} />
            <div className="btn-details" style={{ 
              padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              transition: 'all 0.3s ease', color: 'var(--text-secondary)'
            }}>
              Details
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function WishlistHeart({ productId }: { productId: string }) {
  const { data: session, status } = useSession();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      try {
        const w = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setInWishlist(w.includes(productId));
      } catch {}
    } else if (status === 'authenticated') {
      // To avoid N+1 requests ideally this is a global store, but for simplicity we fetch the user's wishlist
      fetch('/api/wishlist')
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.wishlist) {
            setInWishlist(data.wishlist.some((item: any) => item.productId === productId));
          }
        })
        .catch(console.error);
    }
  }, [productId, status]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;

    if (status === 'unauthenticated') {
      try {
        let w: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (w.includes(productId)) w = w.filter(id => id !== productId);
        else w.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(w));
        setInWishlist(w.includes(productId));
      } catch {}
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.ok) {
        setInWishlist(data.action === 'added');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      style={{
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        border: 'none', borderRadius: 'var(--radius-full)',
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 18,
        color: inWishlist ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'all 0.2s ease',
        transform: inWishlist ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {inWishlist ? '♥' : '♡'}
    </button>
  );
}
