"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCart } from '@/lib/cart';

export default function CartLink(){
  const [count,setCount] = useState(0);
  useEffect(()=>{
    const update = ()=>{ const cart = getCart(); const total = cart.reduce((s:any,i:any)=> s + (i.qty||0), 0); setCount(total); };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('focus', update);
    return ()=>{ window.removeEventListener('storage', update); window.removeEventListener('focus', update); };
  },[]);
  return (
    <Link href="/cart" className="relative inline-block">
      Cart {count>0 && (<span style={{marginLeft:8, display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:999, padding:'2px 8px', fontSize:12, background:'#000', color:'#fff'}}>{count}</span>)}
    </Link>
  );
}
