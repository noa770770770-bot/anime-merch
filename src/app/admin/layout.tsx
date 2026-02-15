

import Link from 'next/link';
// import AdminDragDropWrapper from './layoutClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">AnimeMerch Admin</div>
        <nav>
          <ul>
            <li><Link href="/admin">Dashboard</Link></li>
            <li><Link href="/admin/products">Products</Link></li>
            <li><Link href="/admin/categories">Categories</Link></li>
            <li><Link href="/admin/orders">Orders</Link></li>
            <li><Link href="/admin/users">Users</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">Admin Panel</div>
        </header>
        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  );
}
