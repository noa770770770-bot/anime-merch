'use client';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { items, update, remove, clear, totalQuantity } = useCart();
  const [products, setProducts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length > 0) {
      const ids = [...new Set(items.map(i => i.productId))];
      fetch('/api/cart/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
        .then(res => res.json())
        .then(data => { setProducts(data.products || {}); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [items]);

  const total = items.reduce((sum, i) => {
    const p = products[i.productId];
    return sum + (p?.priceILS || 0) * i.qty;
  }, 0);

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h1>Shopping Cart</h1>
          <p className="page-subtitle">{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</p>
        </div>
        {items.length > 0 && (
          <button className="btn btn-ghost" onClick={clear}>Clear Cart</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some awesome anime merch to get started!</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
            Browse Products
          </Link>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {items.map((item, idx) => {
              const product = products[item.productId];
              const img = (product?.images?.[0] || product?.imageUrl || '/products/anime-ai-placeholder.svg');

              return (
                <div key={`${item.productId}-${item.variantId || ''}-${idx}`} style={{
                  display: 'flex', gap: 16, padding: 20,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  alignItems: 'center',
                }}>
                  <img src={img} alt={product?.name || 'Product'} style={{
                    width: 100, height: 100,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-surface)',
                  }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                      {product?.name || 'Product'}
                    </div>
                    {product?.description && (
                      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.description}
                      </div>
                    )}
                    <div className="price">{product?.priceILS || 0} ₪</div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <button
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => update(item.productId, item.qty - 1, item.variantId)}
                      style={{ width: 32, height: 32, fontSize: 18 }}
                    >
                      −
                    </button>
                    <span style={{ width: 40, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                    <button
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => update(item.productId, item.qty + 1, item.variantId)}
                      style={{ width: 32, height: 32, fontSize: 18 }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div style={{ minWidth: 80, textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent3)' }}>
                      {(product?.priceILS || 0) * item.qty} ₪
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => remove(item.productId, item.variantId)}
                    style={{ color: 'var(--text-muted)', fontSize: 18 }}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div style={{
            padding: 24,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent3)' }}>{total} ₪</span>
            </div>
            <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Proceed to Checkout →
            </Link>
            <Link href="/products" className="btn btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
