'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { CartItem } from '@/types/cart';

type CartState = {
  items: CartItem[];
  add: (productId: number, qty?: number) => void;
  update: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  totalQuantity: number;
};

const CartContext = createContext<CartState | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart_v1', []);

  const add = (productId: number, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) {
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId, qty }];
    });
  };

  const update = (productId: number, qty: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const remove = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clear = () => setItems([]);

  const totalQuantity = items.reduce((s, it) => s + it.qty, 0);

  const state: CartState = { items, add, update, remove, clear, totalQuantity };

  return <CartContext.Provider value={state}>{children}</CartContext.Provider>;
}
