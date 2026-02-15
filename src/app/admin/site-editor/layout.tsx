// Custom layout for the site editor to make it fullscreen and not wrapped by the admin dashboard

export default function SiteEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24, background: '#23232b', borderRadius: 16, boxShadow: '0 2px 16px #0004' }}>
      {children}
    </div>
  );
}
