import Link from 'next/link';
import CartLink from './CartLink';

export default function Header(){
  return (
    <header style={{
      position:'sticky', top:0, zIndex:50, backdropFilter:'saturate(180%) blur(6px)',
      background:'rgba(2,6,23,0.72)',
      borderBottom:'2px solid #f472b6',
      boxShadow:'0 2px 24px #f472b633, 0 0 0 2px #7c3aed33',
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', maxWidth:1200, margin:'0 auto', padding:'12px 16px'}}>
        <div style={{display:'flex', alignItems:'center', gap:20}}>
          <div style={{fontWeight:900, fontSize:22, letterSpacing:'0.04em', textShadow:'0 0 8px #f472b6'}}>
            <Link href="/">Anime<span style={{color:'#f472b6', textShadow:'0 0 12px #f472b6,0 0 24px #7c3aed'}}>Merch</span></Link>
          </div>
          <nav style={{display:'flex', gap:14, alignItems:'center'}}>
            <Link href="/products" style={{color:'#f472b6'}}>Shop</Link>
            <Link href="/products?new=true" style={{color:'#7c3aed'}}>New</Link>
            <Link href="/products?best=true" style={{color:'#f59e42'}}>Best</Link>
            <Link href="/faq">FAQ</Link>
          </nav>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <CartLink />
          <Link href="/products" style={{padding:'8px 12px', background:'linear-gradient(90deg,#f472b6,#7c3aed)', color:'#fff', borderRadius:8, boxShadow:'0 0 8px #f472b6'}}>Shop</Link>
        </div>
      </div>
    </header>
  );
}
