'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'ILS' | 'USD' | 'EUR';
const RATES = { ILS: 1, USD: 0.27, EUR: 0.25 };
const SYMBOLS = { ILS: '₪', USD: '$', EUR: '€' };

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (ilsAmount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('ILS');

  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency;
    if (saved && (saved === 'ILS' || saved === 'USD' || saved === 'EUR')) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  const formatPrice = (ilsAmount: number) => {
    const converted = ilsAmount * RATES[currency];
    const formatted = converted.toFixed(2);
    // Remove trailing dec for purely flat ILS integers
    if (currency === 'ILS') return `${Math.round(converted)} ₪`;
    return `${SYMBOLS[currency]}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
