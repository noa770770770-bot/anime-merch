'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🧾' },
  { href: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 12px',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <Link href="/admin" style={{ padding: '8px 12px', marginBottom: 32, textDecoration: 'none' }}>
          <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
            Anime<span style={{ color: 'var(--accent)' }}>Merch</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
            Admin Panel
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--radius)',
              background: isActive(item.href) ? 'rgba(124,91,245,0.12)' : 'transparent',
              color: isActive(item.href) ? 'var(--accent2)' : 'var(--text-secondary)',
              fontWeight: isActive(item.href) ? 700 : 500,
              fontSize: 14, textDecoration: 'none',
              transition: 'all 0.15s ease',
              borderLeft: isActive(item.href) ? '3px solid var(--accent2)' : '3px solid transparent',
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 'var(--radius)',
            color: 'var(--text-muted)', fontSize: 14,
          }}>
            <span>🌐</span> View Store
          </Link>
          <Link href="/api/auth/logout" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 'var(--radius)',
            color: 'var(--danger)', fontSize: 14,
          }}>
            <span>🚪</span> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', maxWidth: 'calc(100% - 240px)' }}>
        {children}
      </main>
    </div>
  );
}
