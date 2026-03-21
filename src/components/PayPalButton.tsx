'use client';
import { useEffect, useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';

declare global {
  interface Window { paypal: any }
}

export default function PayPalButton() {
  const { items, clear } = useCart();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);

    function renderButtons() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      if (!window.paypal) {
        setErrorMsg('PayPal SDK not loaded.');
        setLoading(false);
        return;
      }
      
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch('/api/paypal/create-order', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, qty: i.qty, variantId: i.variantId || null })) }) 
          });
          const data = await res.json();
          if (!data || data.ok === false) {
            setErrorMsg(JSON.stringify(data, null, 2));
            throw new Error('create-order failed');
          }
          return data.paypalOrderId;
        },
        onApprove: async (data: any) => {
          const res = await fetch('/api/paypal/capture-order', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ paypalOrderId: data.orderID }) 
          });
          const capture = await res.json();
          if (!capture || capture.ok === false) {
            setErrorMsg(JSON.stringify(capture, null, 2));
            return;
          }
          clear();
          alert('Payment successful!');
        },
        onError: (err: any) => {
          setErrorMsg(String(err?.message || err));
        }
      }).render(containerRef.current);
      setLoading(false);
    }

    const existing = document.querySelector('script[data-paypal="true"]');
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || (typeof window !== 'undefined' && (window as any).PAYPAL_CLIENT_ID) || 'test';
    
    if (!existing) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ILS`;
      script.async = true;
      script.dataset.paypal = 'true';
      script.onerror = () => {
        setErrorMsg('Failed to load PayPal SDK.');
        setLoading(false);
      };
      document.body.appendChild(script);
      script.onload = renderButtons;
    } else {
      if (window.paypal) renderButtons();
      else setTimeout(renderButtons, 500);
    }
  }, [items, clear]);

  return (
    <div>
      {loading && <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius)' }} />}
      {errorMsg && (
        <div style={{
          padding: 12, marginBottom: 16,
          background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)',
          borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: 14, fontWeight: 600,
        }}>
          PayPal Error: {errorMsg}
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
