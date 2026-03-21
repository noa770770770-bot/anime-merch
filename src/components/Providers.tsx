'use client';
import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';
import { SessionProvider } from 'next-auth/react';
import { CurrencyProvider } from '@/context/CurrencyContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
