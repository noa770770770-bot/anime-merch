import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Shipping Info</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 32 }}>Shipping Information</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { title: '🇮🇱 Domestic (Israel)', content: 'Standard shipping: 3-5 business days. Express shipping: 1-2 business days. Free shipping on orders over 200 ₪.' },
          { title: '🌍 International', content: 'Standard international shipping: 7-14 business days. Tracking provided for all orders. Customs duties may apply depending on your country.' },
          { title: '📦 Order Processing', content: 'Orders are processed within 1-2 business days. You will receive a confirmation email with tracking details once shipped.' },
          { title: '💰 Shipping Rates', content: 'Domestic: 25 ₪ standard, 45 ₪ express. Free on orders over 200 ₪. International: varies by destination, calculated at checkout.' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
