import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Terms</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 32 }}>Terms of Service</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        {[
          { title: 'General', content: 'By using AnimeMerch, you agree to these terms. We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of any changes.' },
          { title: 'Orders & Pricing', content: 'All prices are displayed in Israeli Shekels (₪). We reserve the right to modify prices at any time. Once an order is placed and confirmed, the price is locked in.' },
          { title: 'Product Descriptions', content: 'We strive to display products as accurately as possible. Colors may vary slightly due to monitor settings. Product descriptions are for informational purposes.' },
          { title: 'Intellectual Property', content: 'All content on this site including logos, images, and text is the property of AnimeMerch. All anime merchandise is officially licensed where applicable.' },
          { title: 'Limitation of Liability', content: 'AnimeMerch is not liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid for the product in question.' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>{s.title}</h3>
            <p>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
