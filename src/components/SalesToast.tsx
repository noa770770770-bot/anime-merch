'use client';
import { useEffect, useState } from 'react';

const FAKE_USERS = ['Alex in Tel Aviv', 'Sarah in Haifa', 'David in Jerusalem', 'Omer in Eilat', 'Noa in Ramat Gan', 'Daniel in Ashdod', 'Maya in Netanya'];
const FAKE_ITEMS = ['Gojo Satoru Premium Figure', 'Naruto Akatsuki Cloak', 'Demon Slayer Katana Prop', 'Attack on Titan Scout Jacket', 'One Piece Luffy Wanted Poster', 'Neon Genesis Evangelion Tee'];

export default function SalesToast() {
  const [toast, setToast] = useState<{ user: string, item: string } | null>(null);

  useEffect(() => {
    const showRandomToast = () => {
      const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
      const item = FAKE_ITEMS[Math.floor(Math.random() * FAKE_ITEMS.length)];
      setToast({ user, item });
      
      setTimeout(() => setToast(null), 5000); // Hide after 5 sec
    };

    // Show first toast after 8 seconds of browsing
    const initialTimeout = setTimeout(showRandomToast, 8000);
    
    // Then show organically every 30-90 seconds randomly
    const interval = setInterval(() => {
      setTimeout(showRandomToast, Math.random() * 45000);
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
      background: 'var(--bg-card)', border: '1px solid var(--accent)',
      padding: '16px 20px', borderRadius: 'var(--radius-lg)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: 16,
      animation: 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: 320
    }}>
      <div style={{ fontSize: 24, padding: 8, background: 'rgba(124, 91, 245, 0.1)', borderRadius: '50%' }}>🛍️</div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
          <strong>{toast.user}</strong> recently purchased
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {toast.item}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Verified Buyer • Just now
        </div>
      </div>
    </div>
  );
}
