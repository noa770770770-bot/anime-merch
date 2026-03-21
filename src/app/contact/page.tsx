'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Message sent! We\'ll get back to you within 24 hours.', 'success');
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 700 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Contact</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Get in Touch</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Have a question? We'd love to hear from you.</p>

      {submitted ? (
        <div style={{
          textAlign: 'center', padding: 48,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <h3 style={{ marginBottom: 8 }}>Message Sent!</h3>
          <p style={{ color: 'var(--text-muted)' }}>We'll respond within 24 hours on business days.</p>
          <button className="btn btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: 20 }}>
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's this about?" />
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Tell us how we can help..." style={{ minHeight: 150 }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
