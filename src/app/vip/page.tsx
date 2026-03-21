'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function VipLandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleJoin = async () => {
    if (status === 'unauthenticated') {
      router.push('/account/login?callbackUrl=/vip');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/vip/subscribe', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        // Force session reload by refreshing the page after a tiny delay
        setTimeout(() => window.location.href = '/account/profile', 2000);
      } else {
        alert(data.error || 'Failed to join');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '64px 20px', maxWidth: 900, textAlign: 'center' }}>
      
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
        <div style={{ fontSize: 64, filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))' }}>👑</div>
      </div>
      
      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        The Otaku Club
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}>
        Ascend to the highest tier of Anime Fans. Get permanent site-wide discounts, exclusive drops, and free priority shipping forever.
      </p>

      {success ? (
        <div style={{ background: 'var(--bg-card)', padding: 48, borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent)', boxShadow: '0 0 50px rgba(212, 175, 55, 0.2)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Welcome to the Club! ⚔️</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your VIP benefits are now active. Enjoy your 15% discount!</p>
          <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, textAlign: 'left' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🔥</span> Core Benefits
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ color: 'var(--success)' }}>✓</span> 15% Off Every Order Forever</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ color: 'var(--success)' }}>✓</span> 100% Free Priority Shipping</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ color: 'var(--success)' }}>✓</span> VIP Gold Profile Badge</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ color: 'var(--success)' }}>✓</span> Early Access to Figure Drops</li>
            </ul>
          </div>

          <div style={{ background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(212, 175, 55, 0.05) 100%)', padding: 32, borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)', textAlign: 'center' }}>
              Monthly Membership
            </h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)', textAlign: 'center', marginBottom: 24 }}>
              ₪14.99<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span>
            </div>
            
            <button 
              onClick={handleJoin} 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px 24px', fontSize: 18, marginTop: 16 }}
            >
              {loading ? 'Processing...' : status === 'unauthenticated' ? 'Login to Join' : 'Join the Club Now'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
              Cancel anytime. No hidden fees.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
