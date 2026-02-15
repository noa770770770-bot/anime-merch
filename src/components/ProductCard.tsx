"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from './ui/Card';


export default function ProductCard({ product }: any){
  let img = (product.images && product.images[0]) || product.imageUrl;
  if (!img || (typeof img === 'string' && img.trim() === '')) img = '/products/anime-ai-placeholder.svg';
  return (
    <article style={{borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', position:'relative'}}>
      <div style={{aspectRatio:'4/3', background:'#0f1724', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {img ? <img src={img} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#94a3b8'}}>{product.name}</div>}
      </div>
      <div style={{padding:12}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontWeight:700}}>{product.name}</div>
          <WishlistButton productId={product.id} />
        </div>
        <div style={{color:'#94a3b8', marginTop:6}}>{product.description}</div>
        <div style={{marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontWeight:700}}>{product.priceILS} ILS</div>
          <Link href={'/products/' + product.slug} style={{padding:'6px 12px', background:'#111827', color:'#fff', borderRadius:8}}>Details</Link>
        </div>
      </div>
    </article>
  );
}

function WishlistButton({ productId }: { productId: string }) {
  const [inWishlist, setInWishlist] = useState(false);
  useEffect(() => {
    const w = JSON.parse(localStorage.getItem('wishlist')||'[]');
    setInWishlist(w.includes(productId));
  }, [productId]);
  const toggle = (e: any) => {
    e.preventDefault();
    let w = JSON.parse(localStorage.getItem('wishlist')||'[]');
    if (w.includes(productId)) {
      w = w.filter((id: string) => id !== productId);
    } else {
      w.push(productId);
    }
    localStorage.setItem('wishlist', JSON.stringify(w));
    setInWishlist(w.includes(productId));
  };
  return (
    <button onClick={toggle} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'} style={{background:'none', border:'none', cursor:'pointer', fontSize:22, color:inWishlist ? '#f472b6' : '#aaa', marginLeft:8}}>
      {inWishlist ? '♥' : '♡'}
    </button>
  );
}
