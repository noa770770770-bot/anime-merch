'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  { q: 'How long does shipping take?', a: 'Domestic orders (Israel) ship within 3-5 business days. International orders take 7-14 business days depending on location.' },
  { q: 'What payment methods do you accept?', a: 'We accept PayPal and all major credit cards through PayPal\'s secure checkout.' },
  { q: 'Can I return or exchange an item?', a: 'Yes! We offer 30-day returns on all items in their original condition. See our Returns page for details.' },
  { q: 'Are the products authentic/licensed?', a: 'Yes, all our merchandise is sourced from authorized distributors and is officially licensed.' },
  { q: 'Do you ship internationally?', a: 'Absolutely! We ship worldwide. Shipping costs and delivery times vary by destination.' },
  { q: 'How can I track my order?', a: 'Once shipped, you\'ll receive an email with tracking information. You can also view your order status in your account dashboard.' },
  { q: 'What if an item is out of stock?', a: 'You can sign up for notifications on the product page. We restock popular items regularly.' },
  { q: 'How do I contact customer support?', a: 'Visit our Contact page or email us. We respond within 24 hours on business days.' },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>FAQ</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Frequently Asked Questions</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Find answers to common questions below.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
          }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: '100%', padding: '16px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                color: openIndex === i ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: 600, fontSize: 15, textAlign: 'left',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span>{faq.q}</span>
              <span style={{
                transition: 'transform 0.2s ease',
                transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                fontSize: 12, opacity: 0.6,
              }}>
                ▼
              </span>
            </button>
            {openIndex === i && (
              <div style={{
                padding: '0 20px 16px',
                color: 'var(--text-secondary)',
                fontSize: 14,
                lineHeight: 1.7,
                animation: 'fade-in 0.2s ease',
              }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, textAlign: 'center', padding: 32, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: 8 }}>Still have questions?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Our team is here to help.</p>
        <Link href="/contact" className="btn btn-primary">Contact Us</Link>
      </div>
    </div>
  );
}
