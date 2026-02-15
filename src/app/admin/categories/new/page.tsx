"use client";
import { useState } from 'react';

export default function AdminCategoryNew() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!name || !slug) { setError('Name and slug are required'); return; }
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error creating category'); return; }
      setSuccess(true);
      setName('');
      setSlug('');
    } catch (err: any) {
      setError('Network error');
    }
  }

  return (
    <div style={{maxWidth:480}}>
      <h1>New Category</h1>
      <form onSubmit={submit}>
        <div><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><label>Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} required /></div>
        <div style={{marginTop:12}}><button type="submit">Create</button></div>
        {error && <div style={{color:'salmon', marginTop:8}}>{error}</div>}
        {success && <div style={{color:'green', marginTop:8}}>Category created (not yet saved to backend)</div>}
      </form>
    </div>
  );
}
