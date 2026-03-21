"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) setError('Invalid credentials');
    else window.location.href = '/account/profile';
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: "64px auto", padding: '0 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 24, textAlign: 'center', fontWeight: 900 }}>Welcome Back</h1>
      <form onSubmit={submit} style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <input className="form-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 16, width: '100%' }} />
        <input className="form-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 24, width: '100%' }} />
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 16 }} disabled={loading}>
          {loading ? 'Please wait...' : 'Sign In'}
        </button>
        {error && <div style={{ color: "var(--danger)", marginBottom: 16, fontSize: 13, fontWeight: 700, textAlign: 'center', background: 'rgba(255,77,106,0.1)', padding: 8, borderRadius: 6 }}>{error}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', opacity: 0.5 }}>
          <hr style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>OR</span>
          <hr style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
        </div>

        <button type="button" onClick={() => signIn('discord', { callbackUrl: '/account/profile' })} className="btn btn-secondary btn-lg" style={{ width: '100%', marginBottom: 12, background: '#5865F2', color: '#fff', border: 'none' }}>
           Log in with Discord
        </button>
        <button type="button" onClick={() => signIn('google', { callbackUrl: '/account/profile' })} className="btn btn-secondary btn-lg" style={{ width: '100%', background: '#fff', color: '#000', border: 'none', marginBottom: 24 }}>
           Log in with Google
        </button>

        <div style={{ textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link href="/account/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
