'use client';
import React from 'react';
import { addToCart } from '@/lib/cart';

export default function AddToCartButton({ productId, name, price, variantId, variantLabel }: { productId: string; name?: string; price?: number; variantId?: string | null; variantLabel?: string | null }) {
  return (
    <button
      className="btn"
      onClick={() => {
        addToCart({ productId, name: name || 'Product', priceILS: price || 0, qty: 1, variantId: variantId || null, variantLabel: variantLabel || null });
        alert('Added to cart');
      }}
    >
      Add to cart
    </button>
  );
}
