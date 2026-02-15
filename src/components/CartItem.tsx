'use client';
import React, { useEffect, useState } from 'react';
import type { CartItem as CI, ProductLite } from '@/types/cart';
import { useCart } from '@/context/CartContext';

export default function CartItem({ item, product }: { item: CI; product?: ProductLite | null }) {
  const { update, remove } = useCart();
  const [qty, setQty] = useState(item.qty);

  useEffect(() => {
    setQty(item.qty);
  }, [item.qty]);

  const onChange = (v: number) => {
    const nv = Math.max(1, v);
    setQty(nv);
    update(item.productId, nv);
  };

  if (!product) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>Unavailable</div>
          <div className="meta">This product is no longer available</div>
        </div>
        <div>
          <button className="btn" onClick={() => remove(item.productId)}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <img src={product.image_url && product.image_url.trim() !== '' ? product.image_url : '/products/placeholder.svg'} alt={product.name} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{product.name}</div>
        <div className="meta">{product.description}</div>
        <div style={{ marginTop: 8 }}>
          <strong>{product.price_ils} ILS</strong>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        <div>
          <button className="btn" onClick={() => onChange(qty - 1)}>-</button>
          <span style={{ margin: '0 8px' }}>{qty}</span>
          <button className="btn" onClick={() => onChange(qty + 1)}>+</button>
        </div>
        <div>
          <button className="btn" onClick={() => remove(item.productId)}>Remove</button>
        </div>
      </div>
    </div>
  );
}
