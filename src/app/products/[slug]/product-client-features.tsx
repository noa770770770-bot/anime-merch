"use client";
import { useEffect, useState } from 'react';

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
    <button onClick={toggle} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'} style={{background:'none', border:'none', cursor:'pointer', fontSize:28, color:inWishlist ? '#f472b6' : '#aaa', marginLeft:8}}>
      {inWishlist ? '♥' : '♡'}
    </button>
  );
}

function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then(res => res.json())
      .then(data => { setReviews(data.reviews || []); setLoading(false); });
  }, [productId]);

  const submit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...form })
    });
    if (res.ok) {
      setForm({ rating: 5, title: '', body: '' });
      const data = await res.json();
      setReviews([data.review, ...reviews]);
    } else {
      const data = await res.json();
      setError(data.error || 'Error submitting review');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={submit} style={{marginBottom:18, background:'#18181b', padding:12, borderRadius:8}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <label>Rating:</label>
          <select value={form.rating} onChange={e=>setForm(f=>({...f, rating:Number(e.target.value)}))}>
            {[5,4,3,2,1].map(r=>(<option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5-r)}</option>))}
          </select>
          <input required placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} style={{padding:6, borderRadius:6, border:'1px solid #333', flex:1}} />
        </div>
        <textarea required placeholder="Write your review..." value={form.body} onChange={e=>setForm(f=>({...f, body:e.target.value}))} style={{marginTop:8, width:'100%', minHeight:48, borderRadius:6, border:'1px solid #333', padding:6}} />
        <button type="submit" disabled={submitting} style={{marginTop:8, background:'#f472b6', color:'#fff', border:'none', borderRadius:6, padding:'8px 16px', fontWeight:700}}>Submit Review</button>
        {error && <div style={{color:'#f472b6', marginTop:6}}>{error}</div>}
      </form>
      {loading ? <div>Loading reviews...</div> : (
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {reviews.length === 0 && <div style={{color:'#aaa'}}>No reviews yet.</div>}
          {reviews.map((r, i) => (
            <div key={r.id || i} style={{background:'#23232b', borderRadius:8, padding:10}}>
              <div style={{fontWeight:700, color:'#f59e42'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)} {r.title}</div>
              <div style={{color:'#cbd5e1', marginTop:2}}>{r.body}</div>
              <div style={{fontSize:12, color:'#aaa', marginTop:2}}>{new Date(r.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductClientFeatures({ productId, productName }: { productId: string, productName: string }) {
  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <h1>{productName}</h1>
        <WishlistButton productId={productId} />
      </div>
      <div style={{ marginTop: 12 }}>
        <h4>Reviews</h4>
        <div id="reviews">
          <ProductReviews productId={productId} />
        </div>
      </div>
    </>
  );
}
