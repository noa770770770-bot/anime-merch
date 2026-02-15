"use client";
import { useState } from 'react';
import { getCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';

export default function CheckoutPage(){
  const [email,setEmail]=useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [address1,setAddress1]=useState('');
  const [address2,setAddress2]=useState('');
  const [city,setCity]=useState('');
  const [zip,setZip]=useState('');
  const [country,setCountry]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const router = useRouter();

  const cart = getCart();
  const totalILS = cart.reduce((s:any,i:any)=> s + (i.priceILS||0)*i.qty, 0);

  async function placeOrder(e:any){
    e.preventDefault();
    setLoading(true);
    setError(null);
    try{
      const res = await fetch('/api/orders/create', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ items: cart, email, shippingName: name, shippingPhone: phone, shippingAddress1: address1, shippingAddress2: address2, shippingCity: city, shippingZip: zip, shippingCountry: country }) });
      const data = await res.json();
      if(!res.ok){ setError(JSON.stringify(data)); setLoading(false); return; }
      // clear cart
      localStorage.removeItem('cart');
      router.push('/order/' + data.orderId);
    }catch(err:any){ setError(String(err)); }
    setLoading(false);
  }

  return (
    <div>
      <h1>Checkout</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24}}>
        <form onSubmit={placeOrder}>
          <h3>Shipping</h3>
          <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div><input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required /></div>
          <div><input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} /></div>
          <div><input placeholder="Address line 1" value={address1} onChange={e=>setAddress1(e.target.value)} required /></div>
          <div><input placeholder="Address line 2" value={address2} onChange={e=>setAddress2(e.target.value)} /></div>
          <div><input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} required /></div>
          <div><input placeholder="ZIP" value={zip} onChange={e=>setZip(e.target.value)} /></div>
          <div><input placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} required /></div>
          <div style={{marginTop:12}}>
            <button type="submit" disabled={loading}>{loading? 'Placing...':'Place Order'}</button>
          </div>
          {error && <pre style={{whiteSpace:'pre-wrap', background:'#fee', padding:8}}>{error}</pre>}
        </form>
        <aside style={{border:'1px solid #eee', padding:12}}>
          <h3>Order Summary</h3>
          <ul>
            {cart.map((i:any)=>(<li key={i.productId + (i.variantId||'')}>{i.name} x{i.qty} — {i.priceILS} ILS</li>))}
          </ul>
          <div style={{marginTop:12}}>Total: {totalILS} ILS</div>
        </aside>
      </div>
    </div>
  );
}
