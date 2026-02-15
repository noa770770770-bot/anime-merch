"use client";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

declare global {
  interface Window { paypal: any }
}


export default function PayPalButton() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    function renderButtons() {
      const el = document.getElementById('paypal-buttons');
      if (!el) return;
      el.innerHTML = '';
      // @ts-ignore
      if (!window.paypal) {
        setErrorMsg('PayPal SDK not loaded.');
        setLoading(false);
        return;
      }
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: getCart() }) });
          const data = await res.json();
          if (!data || data.ok === false) {
            setErrorMsg(JSON.stringify(data, null, 2));
            throw new Error('create-order failed');
          }
          return data.paypalOrderId;
        },
        onApprove: async (data: any) => {
          const res = await fetch('/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paypalOrderId: data.orderID }) });
          const capture = await res.json();
          if (!capture || capture.ok === false) {
            setErrorMsg(JSON.stringify(capture, null, 2));
            return;
          }
          localStorage.removeItem('cart');
          alert('Payment successful!');
        },
        onError: (err: any) => {
          setErrorMsg(String(err?.message || err));
        }
      }).render('#paypal-buttons');
      setLoading(false);
    }

    const existing = document.querySelector('script[data-paypal="true"]');
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || (typeof window !== 'undefined' && (window as any).PAYPAL_CLIENT_ID) || '';
    if (!existing) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.dataset.paypal = 'true';
      script.onerror = () => {
        setErrorMsg('Failed to load PayPal SDK.');
        setLoading(false);
      };
      document.body.appendChild(script);
      script.onload = renderButtons;
    } else {
      renderButtons();
    }
  }, [retry]);

  return (
    <div>
      {loading && <div style={{padding:12, color:'#7c3aed'}}>Loading PayPal...</div>}
      {errorMsg && (
        <div style={{background:'#fee', color:'#b91c1c', padding:12, borderRadius:8, marginBottom:8}}>
          <div style={{fontWeight:700, marginBottom:4}}>PayPal Error</div>
          <div style={{whiteSpace:'pre-wrap', fontSize:14}}>{errorMsg}</div>
          <button onClick={()=>setRetry(r=>r+1)} style={{marginTop:8, background:'#f472b6', color:'#fff', border:'none', borderRadius:6, padding:'6px 14px', fontWeight:700}}>Retry</button>
        </div>
      )}
      <div id="paypal-buttons" />
    </div>
  );
}
