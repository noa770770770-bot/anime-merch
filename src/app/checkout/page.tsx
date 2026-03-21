'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ id: string, code: string, discountPercentage: number } | null>(null);

  const [products, setProducts] = useState<Record<string, any>>({});
  useEffect(() => {
    if (items.length > 0) {
      const ids = [...new Set(items.map(i => i.productId))];
      fetch('/api/cart/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      }).then(r => r.json()).then(d => { if (d.products) setProducts(d.products); });
    }
  }, [items]);

  const cartTotalILS = items.reduce((sum, item) => sum + ((products[item.productId]?.priceILS || 0) * item.qty), 0);
  const discountAmount = appliedPromo ? Math.round(cartTotalILS * (appliedPromo.discountPercentage / 100)) : 0;
  const finalTotalILS = cartTotalILS - discountAmount;

  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setPromoError('');
    try {
      const res = await fetch('/api/checkout/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || 'Invalid promo code');
        setAppliedPromo(null);
      } else {
        setAppliedPromo(data);
        setPromoCode('');
        toast(`Promo code applied! ${data.discountPercentage}% off`, 'success');
      }
    } catch {
      setPromoError('Network error');
    }
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, qty: i.qty, variantId: i.variantId || null })),
          email, shippingName: name, shippingPhone: phone,
          shippingAddress1: address1, shippingAddress2: address2,
          shippingCity: city, shippingZip: zip, shippingCountry: country,
          promoCodeId: appliedPromo?.id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Order failed');
        setLoading(false);
        return;
      }
      clear();
      toast('Order placed successfully!', 'success');
      router.push('/order/' + data.orderId);
    } catch (err: any) {
      setError(String(err));
    }
    setLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add items before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 32 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Shipping Form */}
        <form onSubmit={placeOrder}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📦 Shipping Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+972..." />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address Line 1 *</label>
                <input className="form-input" value={address1} onChange={e => setAddress1(e.target.value)} required placeholder="Street address" />
              </div>

              <div className="form-group">
                <label className="form-label">Address Line 2</label>
                <input className="form-input" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Apartment, suite, etc." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" value={city} onChange={e => setCity(e.target.value)} required placeholder="Tel Aviv" />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input className="form-input" value={zip} onChange={e => setZip(e.target.value)} placeholder="6100000" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country *</label>
                <input className="form-input" value={country} onChange={e => setCountry(e.target.value)} required placeholder="Israel" />
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: 16, padding: 16,
              background: 'rgba(255,77,106,0.1)',
              border: '1px solid rgba(255,77,106,0.3)',
              borderRadius: 'var(--radius)',
              color: 'var(--danger)',
              fontWeight: 600, fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: 20 }}
          >
            {loading ? 'Processing...' : '🔒 Place Order'}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            position: 'sticky', top: 100,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {items.map((i, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Item × {i.qty}</span>
                </div>
              ))}
            </div>
            <div style={{
              borderTop: '1px solid var(--border)', padding: '16px 0',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 600 }}>Subtotal</span>
              <span style={{ fontWeight: 700 }}>{cartTotalILS} ₪</span>
            </div>

            {/* Promo Area */}
            {appliedPromo ? (
              <div style={{
                background: 'rgba(124, 91, 245, 0.1)', padding: 12, borderRadius: 'var(--radius)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                  Code: {appliedPromo.code} (-{appliedPromo.discountPercentage}%)
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>-{discountAmount} ₪</div>
                <button type="button" onClick={() => setAppliedPromo(null)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>✕</button>
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <button type="button" className="btn btn-secondary" onClick={handleApplyPromo}>Apply</button>
                </div>
                {promoError && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 8, fontWeight: 600 }}>{promoError}</div>}
              </div>
            )}

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 16,
              display: 'flex', justifyContent: 'space-between', fontSize: 18
            }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 900, color: 'var(--accent3)' }}>
                {finalTotalILS} ₪
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
