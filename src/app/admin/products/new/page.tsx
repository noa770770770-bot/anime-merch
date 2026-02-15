"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProduct(){
  const [name,setName]=useState('');
  const [slug,setSlug]=useState('');
  const [description,setDescription]=useState('');
  const [price,setPrice]=useState(0);
  const [imageUrl,setImageUrl]=useState('');
  const [active,setActive]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const router = useRouter();

  async function submit(e:any){
    e.preventDefault();
    setError(null);
    if(!name||!slug||!price||price<=0){ setError('name, slug, price required and price>0'); return; }
    try{
      const res = await fetch('/api/admin/products', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, slug, description, priceILS: Number(price), imageUrl, active }) });
      const data = await res.json();
      if(!res.ok) { setError(JSON.stringify(data)); return; }
      router.push('/admin/products/' + data.id);
    }catch(err:any){ setError(String(err)); }
  }

  return (
    <div style={{maxWidth:640}}>
      <h1>New Product</h1>
      <form onSubmit={submit}>
        <div><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><label>Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} required /></div>
        <div><label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div><label>Price (ILS)</label><input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} required /></div>
        <div><label>Image URL</label><input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} /></div>
        <div><label>Active</label><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /></div>
        <div style={{marginTop:12}}><button type="submit">Create</button></div>
        {error && <div style={{color:'salmon', marginTop:8}}>{error}</div>}
      </form>
    </div>
  );
}
