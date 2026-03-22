'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSession, signOut } from 'next-auth/react';
import LiveSearch from './LiveSearch';

export default function Header({ content = {} }: { content?: Record<string, string> }) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalQuantity } = useCart();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,18,0.95)' : 'rgba(10,10,18,0.8)',
      backdropFilter: 'saturate(180%) blur(16px)',
      borderBottom: '1px solid var(--border)',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="Otaku Merch Logo" style={{ height: 44, width: 44, objectFit: 'contain' }} />
          <span className="desktop-logo-text" style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            {content.site_title?.includes(' ') ? (
              <>
                {content.site_title.split(' ')[0]}
                <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {content.site_title.split(' ').slice(1).join(' ')}
                </span>
              </>
            ) : (
              content.site_title || 'AnimeMerch'
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          <Link href="/products" className="btn btn-ghost">{content.nav_shop || 'Shop All'}</Link>
          <Link href="/products?sort=newest" className="btn btn-ghost">{content.nav_arrivals || 'New Arrivals'}</Link>
          <Link href="/faq" className="btn btn-ghost">{content.nav_faq || 'FAQ'}</Link>
          <Link href="/contact" className="btn btn-ghost">{content.nav_contact || 'Contact'}</Link>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="desktop-search" style={{ width: 240, marginRight: 8 }}>
            <LiveSearch />
          </div>

          {status === 'authenticated' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }} className="group">
              <Link href="/account/profile" className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 700, gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <img src={session.user?.image || "/logo.png"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span className="desktop-nav">{session.user?.name?.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link href="/account" className="btn btn-ghost btn-icon" aria-label="Account" style={{ fontSize: 20 }}>
              👤
            </Link>
          )}

          <select 
            className="currency-select"
            value={currency} 
            onChange={e => setCurrency(e.target.value as any)}
            style={{
              background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)',
              padding: '4px 8px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="ILS">ILS ₪</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>

          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius)', color: 'var(--text-primary)', transition: 'all var(--transition)' }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            {totalQuantity > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                color: '#fff', fontSize: 11, fontWeight: 800,
                minWidth: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-glow-accent)',
                animation: 'pulse-glow 2s infinite',
              }}>
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-icon mobile-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{ display: 'none', fontSize: 22 }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'var(--header-height)', left: 0, right: 0,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fade-in 0.2s ease',
        }}>
          <div style={{ marginBottom: 8 }}><LiveSearch /></div>
          <Link href="/products" className="btn btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>🛍️ Shop All</Link>
          <Link href="/products?sort=newest" className="btn btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>✨ New Arrivals</Link>
          <Link href="/faq" className="btn btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>❓ FAQ</Link>
          <Link href="/contact" className="btn btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>📧 Contact</Link>
          <Link href="/account" className="btn btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>👤 My Account</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-search { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .desktop-logo-text { display: none !important; }
        }
      `}</style>
    </header>
  );
}
