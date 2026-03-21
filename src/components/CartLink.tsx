'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

import { useState, useEffect } from 'react';

export default function CartLink() {
  const { totalQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius)', transition: 'all var(--transition)' }}>
      <span style={{ fontSize: 20 }}>🛒</span>
      <span style={{ fontWeight: 600 }}>Cart</span>
      {mounted && totalQuantity > 0 && (
        <span className="cart-badge-anim" style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          color: '#fff', fontSize: 11, fontWeight: 800,
          minWidth: 20, height: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-full)',
        }}>
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
