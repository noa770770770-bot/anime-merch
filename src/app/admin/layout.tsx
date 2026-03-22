import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', maxWidth: 'calc(100% - 240px)' }}>
        {children}
      </main>
    </div>
  );
}
