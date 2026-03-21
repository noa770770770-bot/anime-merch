'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { CartItem } from '@/types/cart';

type CartState = {
  items: CartItem[];
  add: (productId: string, qty?: number, variantId?: string) => void;
  update: (productId: string, qty: number, variantId?: string | null) => void;
  remove: (productId: string, variantId?: string | null) => void;
  clear: () => void;
  totalQuantity: number;
};

const CartContext = createContext<CartState | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

function cartKey(productId: string, variantId?: string | null) {
  return variantId ? `${productId}__${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart_v1', []);

  const add = (productId: string, qty = 1, variantId?: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId && (i.variantId || null) === (variantId || null));
      if (found) {
        return prev.map((i) =>
          i.productId === productId && (i.variantId || null) === (variantId || null)
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { productId, qty, variantId: variantId || undefined }];
    });
  };

  const update = (productId: string, qty: number, variantId?: string | null) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && (i.variantId || null) === (variantId || null)
          ? { ...i, qty: Math.max(1, qty) }
          : i
      )
    );
  };

  const remove = (productId: string, variantId?: string | null) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && (i.variantId || null) === (variantId || null))));
  };

  const clear = () => setItems([]);

  const totalQuantity = items.reduce((s, it) => s + it.qty, 0);

  const state: CartState = { items, add, update, remove, clear, totalQuantity };

  return <CartContext.Provider value={state}>{children}</CartContext.Provider>;
}
