'use client';
import { useCurrency } from '@/context/CurrencyContext';
import { useEffect, useState } from 'react';

export default function PriceDisplay({ amountILS, className, style }: { amountILS: number | null | undefined, className?: string, style?: any }) {
  const { formatPrice } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (amountILS == null) return null;

  // Render raw ILS text on the server to prevent hydration mismatch
  if (!mounted) {
    return <span className={className} style={style}>{amountILS} ₪</span>;
  }

  return <span className={className} style={style}>{formatPrice(amountILS)}</span>;
}
