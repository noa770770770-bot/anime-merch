"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>Loading profile...</div>;
  if (!session?.user) return null;

  return (
    <div className="container" style={{ maxWidth: 800, margin: "64px auto", padding: "0 20px" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
          <img src={session.user.image || "/products/anime-ai-placeholder.svg"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{session.user.name || "Anime Fan"}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{session.user.email}</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
        <div style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>My Orders</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>View and track your previous purchases.</p>
          <Link href="/account/orders" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>View Orders</Link>
        </div>
        
        <div style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-primary" style={{ width: '100%', background: 'var(--danger)', border: 'none' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
