'use client';
import React from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';

export default function AddToCartButton({ productId, productName, variantId }: { productId: string; productName?: string; variantId?: string | null }) {
  const cart = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    cart.add(productId, 1, variantId || undefined);
    toast(`${productName || 'Item'} added to cart!`, 'success');
  };

  return (
    <button className="btn btn-primary btn-lg" onClick={handleAdd} style={{ width: '100%' }}>
      🛒 Add to Cart
    </button>
  );
}
