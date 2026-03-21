import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Returns</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 32 }}>Returns Policy</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { title: '🔄 30-Day Returns', content: 'Not happy with your purchase? Return it within 30 days of delivery for a full refund. Items must be in original, unused condition with all tags attached.' },
          { title: '📋 How to Return', content: '1. Contact us at our Contact page with your order number. 2. We\'ll send you a return shipping label. 3. Ship the item back. 4. Refund processed within 5-7 business days after we receive the item.' },
          { title: '⚠️ Exceptions', content: 'Custom/personalized items, opened collectible figures with broken seals, and clearance items marked "Final Sale" cannot be returned.' },
          { title: '🔀 Exchanges', content: 'Want a different size or color? Contact us and we\'ll arrange an exchange at no extra shipping cost within Israel.' },
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
