"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to register account');
        setLoading(false);
        return;
      }

      // 2. Automatically sign them in
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError('Account created, but automatic login failed. Please go to Login.');
        setLoading(false);
      } else {
        window.location.href = '/account/profile';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "64px auto", padding: '0 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 24, textAlign: 'center', fontWeight: 900 }}>Create Account</h1>
      <form onSubmit={submit} style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        
        <label className="form-label" style={{ fontSize: 13 }}>Name</label>
        <input className="form-input" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required style={{ marginBottom: 16, width: '100%' }} />
        
        <label className="form-label" style={{ fontSize: 13 }}>Email Address</label>
        <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 16, width: '100%' }} />
        
        <label className="form-label" style={{ fontSize: 13 }}>Password</label>
        <input className="form-input" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ marginBottom: 24, width: '100%' }} />
        
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 16 }} disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        
        {error && <div style={{ color: "var(--danger)", marginBottom: 16, fontSize: 13, fontWeight: 700, textAlign: 'center', background: 'rgba(255,77,106,0.1)', padding: 8, borderRadius: 6 }}>{error}</div>}

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link href="/account/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </form>
    </div>
  );
}
