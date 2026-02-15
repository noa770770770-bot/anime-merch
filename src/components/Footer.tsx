import Link from 'next/link';

export default function Footer(){
  return (
    <footer style={{
      padding:24,
      borderTop:'2px solid #f472b6',
      marginTop:48,
      color:'#94a3b8',
      background:'rgba(2,6,23,0.82)',
      boxShadow:'0 -2px 24px #f472b633',
      fontWeight:600,
      letterSpacing:'0.02em',
    }}>
      <div style={{display:'flex', justifyContent:'space-between', gap:24, flexWrap:'wrap'}}>
        <div style={{minWidth:160}}>
          <div style={{fontWeight:700}}>Shipping</div>
          <div><Link href="/shipping">Shipping</Link></div>
        </div>
        <div style={{minWidth:160}}>
          <div style={{fontWeight:700}}>Returns</div>
          <div><Link href="/returns">Returns</Link></div>
        </div>
        <div style={{minWidth:160}}>
          <div style={{fontWeight:700}}>Legal</div>
          <div><Link href="/privacy">Privacy</Link> | <Link href="/terms">Terms</Link></div>
        </div>
        <div style={{minWidth:160}}>
          <div style={{fontWeight:700}}>Contact</div>
          <div><Link href="/contact">Contact</Link></div>
        </div>
      </div>
    </footer>
  );
}
