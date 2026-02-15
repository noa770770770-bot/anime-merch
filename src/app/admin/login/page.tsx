"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin(){
  const [password,setPassword] = useState('');
  const [error,setError] = useState<string|null>(null);
  const router = useRouter();

  async function submit(e:any){
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
    const data = await res.json();
    if(!res.ok){ setError(data.error || 'Login failed'); return; }
    // redirect
    router.push('/admin/orders');
  }

  return (
    <div style={{maxWidth:480, margin:'40px auto'}}>
      <h1>Admin Login</h1>
      <form onSubmit={submit}>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:12}}><button type="submit">Login</button></div>
        {error && <div style={{color:'salmon', marginTop:8}}>{error}</div>}
      </form>
    </div>
  );
}
