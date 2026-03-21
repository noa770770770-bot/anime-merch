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
      <article className="card" style={{ cursor: 'pointer', position: 'relative' }}>
        {/* Image */}
        <div style={{
          aspectRatio: '4/3',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          position: 'relative',
        }}>
          <img
            src={img}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseOver={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)'; }}
            onMouseOut={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
            {isNew && <span className="badge badge-new">New</span>}
          </div>

          {/* Wishlist button */}
          <WishlistHeart productId={product.id} />
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 18px' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </div>
          {product.description && (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.description}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <PriceDisplay amountILS={product.priceILS} className="price" />
            <span className="btn btn-primary btn-sm" style={{ pointerEvents: 'none' }}>View</span>
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
