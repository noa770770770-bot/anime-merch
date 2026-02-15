"use client";
import { useState } from 'react';

export default function ContactPage(){
  const [msg, setMsg] = useState('');
  return (
    <div>
      <h1>Contact</h1>
      <form onSubmit={(e)=>{ e.preventDefault(); console.log('contact form', msg); alert('Submitted'); }}>
        <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} style={{width:'100%',height:120}} />
        <div><button type="submit">Send</button></div>
      </form>
    </div>
  );
}
