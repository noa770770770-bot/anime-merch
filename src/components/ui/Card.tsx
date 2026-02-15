export function Card({ children, className = '', style = {} }: any) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 shadow-sm ${className}`}
      style={{
        border: '2px solid #f472b6',
        boxShadow: '0 2px 24px #f472b633, 0 0 0 2px #7c3aed55',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{position:'absolute', inset:0, zIndex:0, pointerEvents:'none', background:'radial-gradient(circle at 80% 10%, #f472b622 0%, transparent 70%)'}} />
      <div style={{position:'relative', zIndex:1}}>{children}</div>
    </div>
  );
}
