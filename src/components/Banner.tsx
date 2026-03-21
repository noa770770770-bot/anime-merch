'use client';
import React, { useState, useEffect } from 'react';

export default function Banner() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => {});
  }, []);

  if (!visible || !message) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
      color: '#fff',
      padding: '10px 48px 10px 20px',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '0.01em',
      position: 'relative',
      zIndex: 99,
    }}>
      <span>{message}</span>
      <button
        onClick={() => setVisible(false)}
        style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 'var(--radius-full)',
          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, cursor: 'pointer', transition: 'background 0.2s',
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
