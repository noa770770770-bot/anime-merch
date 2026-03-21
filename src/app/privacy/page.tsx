import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Privacy</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 32 }}>Privacy Policy</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Information We Collect</h3>
          <p>When you make a purchase, we collect your name, email address, shipping address, and payment information. We do not store credit card details — payments are processed securely through PayPal.</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>How We Use Your Data</h3>
          <p>Your information is used solely to process orders, send shipping notifications, and provide customer support. We never sell or share your personal data with third parties for marketing purposes.</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Cookies</h3>
          <p>We use essential cookies for authentication and cart functionality. No third-party tracking cookies are used.</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Contact</h3>
          <p>Questions about your privacy? <Link href="/contact" style={{ color: 'var(--accent)' }}>Contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
}
