'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!session) {
    return (
      <div style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
        <p style={{ marginBottom: 16 }}>Sign in to write a verified review.</p>
        <button className="btn btn-secondary" onClick={() => router.push('/account/login')}>Log In</button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ productId, rating, title, body })
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.message || data.error || 'Failed to submit review');
        return;
      }

      setStatus('success');
      setRating(5);
      setTitle('');
      setBody('');
      router.refresh();
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e.message || 'Network error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: 24, background: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--success)' }}>
        <h3 style={{ marginBottom: 8 }}>✅ Review Submitted!</h3>
        <p>Thank you for your feedback.</p>
        <button onClick={() => setStatus('idle')} className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Write another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>Write a Review</h3>
      
      {status === 'error' && (
        <div style={{ color: 'var(--danger)', fontSize: 13, padding: 12, background: 'rgba(255,77,106,0.1)', borderRadius: 6, marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Rating</label>
        <div style={{ display: 'flex', gap: 4, cursor: 'pointer', fontSize: 24 }}>
          {[1,2,3,4,5].map(star => (
            <div key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? 'var(--accent)' : 'var(--text-muted)' }}>
              ★
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Title (Optional)</label>
        <input className="form-input" style={{ width: '100%' }} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Amazing quality!" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Review (Optional)</label>
        <textarea className="form-input" style={{ width: '100%', minHeight: 80, resize: 'vertical' }} value={body} onChange={e => setBody(e.target.value)} placeholder="What did you like about this product?" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ width: '100%' }}>
        {status === 'loading' ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
