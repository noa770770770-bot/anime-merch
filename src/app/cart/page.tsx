"use client";
import PayPalButton from '@/components/PayPalButton';
import { useEffect, useState } from 'react';
import { getCart } from '@/lib/cart';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any>({});
  useEffect(() => {
    const c = getCart();
    setCart(c);
    if (c.length > 0) {
      fetch('/api/cart/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: c.map(i => i.productId) })
      })
        .then(res => res.json())
        .then(data => setProducts(data.products || {}));
    }
  }, []);

  const total = cart.reduce((sum, i) => sum + (i.priceILS * i.qty), 0);

  return (
    <div style={{maxWidth:700, margin:'0 auto'}}>
      <h1 style={{fontSize:36, fontWeight:900, marginBottom:24}}>Your Cart</h1>
      {cart.length === 0 ? (
        <div style={{textAlign:'center', color:'#aaa', fontSize:20, margin:'40px 0'}}>Your cart is empty.</div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:24}}>
          {cart.map((item, idx) => {
            const product = products[item.productId];
            let img = (product?.images?.[0] && product?.images?.[0].trim() !== '' ? product.images[0] : null)
              || (product?.imageUrl && product?.imageUrl.trim() !== '' ? product.imageUrl : null)
              || '/products/placeholder.svg';
            // Use array index in key to guarantee uniqueness
            const key = item.productId + '|' + (item.variantId || '') + '|' + idx;
            return (
              <Card key={key} style={{display:'flex', gap:18, alignItems:'center', padding:18}}>
                <img src={img} alt={product?.name || item.name} style={{width:100, height:100, objectFit:'cover', borderRadius:10, background:'#18181b'}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:800, fontSize:20}}>{product?.name || item.name}</div>
                  {item.variantLabel && <div style={{color:'#f59e42', fontWeight:600, margin:'4px 0'}}>{item.variantLabel}</div>}
                  <div style={{color:'#aaa', margin:'4px 0'}}>{product?.description}</div>
                  <div style={{fontWeight:700, marginTop:6}}>{item.priceILS} ILS x {item.qty} = <span style={{color:'#f472b6'}}>{item.priceILS * item.qty} ILS</span></div>
                  <div style={{marginTop:8}}>
                    <Link href={'/products/' + (product?.slug || '')} style={{color:'#7c3aed', textDecoration:'underline'}}>View product</Link>
                  </div>
                </div>
              </Card>
            );
          })}
          <div style={{textAlign:'right', fontSize:22, fontWeight:900, marginTop:12}}>Total: <span style={{color:'#f472b6'}}>{total} ILS</span></div>
          <div style={{ marginTop: 12 }}>
            <PayPalButton />
          </div>
        </div>
      )}
    </div>
  );
}
