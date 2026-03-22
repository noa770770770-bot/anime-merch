"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrdersPage from "../orders/page"; // We can reuse or embed the logic

export default function AccountHub() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [address, setAddress] = useState({ addressLine1: "", city: "", zipCode: "", phoneNumber: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchWishlist();
      fetchAddress();
    }
  }, [status]);

  const fetchWishlist = async () => {
    const res = await fetch("/api/wishlist");
    const data = await res.json();
    if (data.ok) setWishlist(data.wishlist);
  };

  const fetchAddress = async () => {
    const res = await fetch("/api/account/address");
    const data = await res.json();
    if (data.ok && data.address) setAddress(data.address);
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await fetch("/api/account/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address)
    });
    setIsSaving(false);
    alert("Address updated successfully!");
  };

  if (status === "loading") return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Loading your dashboard...</div>;
  if (!session?.user) return null;

  return (
    <div className="container" style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
      {/* Header Profile Section */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, padding: 32, 
        background: 'rgba(20,20,35,0.6)', backdropFilter: 'blur(10px)', 
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ 
          width: 80, height: 80, borderRadius: 'var(--radius-full)', 
          background: 'var(--bg-card)', padding: 3, border: '2px solid var(--accent)'
        }}>
          <img src={session.user.image || "/logo.png"} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Hi, {session.user.name || "Anime Fan"}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Member since March 2026</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
           <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'overview', icon: '🏠', label: 'Overview' },
            { id: 'orders', icon: '📦', label: 'My Orders' },
            { id: 'wishlist', icon: '❤️', label: 'My Wishlist' },
            { id: 'address', icon: '📍', label: 'Address Book' },
            { id: 'settings', icon: '⚙️', label: 'Account Settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                justifyContent: 'flex-start',
                padding: '12px 20px',
                background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                gap: 12,
                fontSize: 14,
                fontWeight: 600,
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main style={{ minHeight: 500 }}>
          {activeTab === 'overview' && (
            <div style={{ animation: 'fade-in 0.3s ease' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(124,91,245,0.1), rgba(255,107,107,0.1))',
                border: '1px solid rgba(124,91,245,0.2)',
                borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 32,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
              }}>
                <div>
                   <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                     ⭐ Otaku VIP Rewards
                     <span className="badge badge-accent" style={{ fontSize: 10 }}>LEVEL 1</span>
                   </h2>
                   <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>You have <strong>450</strong> points. 50 more points until your next 10% discount!</p>
                </div>
                <Link href="/products" className="btn btn-primary btn-sm" style={{ boxShadow: 'var(--shadow-glow-accent)' }}>Shop & Earn</Link>
              </div>

              <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <div onClick={() => setActiveTab('orders')} style={{ cursor: 'pointer', padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'transform 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                   <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
                   <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Orders Placed</div>
                   <div style={{ fontSize: 24, fontWeight: 800 }}>Check History</div>
                </div>
                <div onClick={() => setActiveTab('wishlist')} style={{ cursor: 'pointer', padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'transform 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                   <div style={{ fontSize: 32, marginBottom: 12 }}>❤️</div>
                   <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Saved Items</div>
                   <div style={{ fontSize: 24, fontWeight: 800 }}>{wishlist.length} Products</div>
                </div>
                <div onClick={() => setActiveTab('address')} style={{ cursor: 'pointer', padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'transform 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                   <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
                   <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Default Address</div>
                   <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{address.city || "Not Set"}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ animation: 'fade-in 0.3s ease' }}>
               <iframe src="/account/orders" style={{ width: '100%', height: '800px', border: 'none', borderRadius: 'var(--radius)' }} />
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div style={{ animation: 'fade-in 0.3s ease' }}>
              <h2 style={{ marginBottom: 24, fontSize: 24 }}>My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Your wishlist is empty.</p>
                  <Link href="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Go Shopping</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
                  {wishlist.map(item => (
                    <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                      <div style={{ aspectRatio: '1/1', background: 'var(--bg-surface)' }}>
                        <img src={item.product.imageUrl || "/products/anime-ai-placeholder.svg"} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{item.product.name}</div>
                        <div style={{ fontSize: 14, color: 'var(--accent3)', fontWeight: 800 }}>{item.product.priceILS} ₪</div>
                        <Link href={`/products/${item.product.slug}`} className="btn btn-ghost" style={{ width: '100%', fontSize: 11, marginTop: 8, padding: '4px' }}>View Details</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <div style={{ animation: 'fade-in 0.3s ease' }}>
              <h2 style={{ marginBottom: 24, fontSize: 24 }}>Default Shipping Address</h2>
              <form onSubmit={saveAddress} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
                <div className="form-group">
                  <label style={{ fontSize: 12, marginBottom: 6, display: 'block' }}>Street Address</label>
                  <input 
                    type="text" className="input" placeholder="e.g. 123 Main St" 
                    value={address.addressLine1} 
                    onChange={e => setAddress({...address, addressLine1: e.target.value})}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label style={{ fontSize: 12, marginBottom: 6, display: 'block' }}>City</label>
                    <input 
                      type="text" className="input" placeholder="City" 
                      value={address.city} 
                      onChange={e => setAddress({...address, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 12, marginBottom: 6, display: 'block' }}>Zip Code</label>
                    <input 
                      type="text" className="input" placeholder="12345" 
                      value={address.zipCode} 
                      onChange={e => setAddress({...address, zipCode: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: 12, marginBottom: 6, display: 'block' }}>Phone Number</label>
                  <input 
                    type="text" className="input" placeholder="+972..." 
                    value={address.phoneNumber} 
                    onChange={e => setAddress({...address, phoneNumber: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ marginTop: 12 }}>
                  {isSaving ? "Saving..." : "Save Address"}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ animation: 'fade-in 0.3s ease' }}>
              <h2 style={{ marginBottom: 24, fontSize: 24 }}>Account Settings</h2>
              <div style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>More profile settings coming soon.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                      <span>Email</span>
                      <span style={{ color: 'var(--text-muted)' }}>{session.user.email}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Password</span>
                      <span style={{ color: 'var(--text-muted)' }}>Managed by {session.user.image ? "Social Login" : "Email"}</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 240px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          aside {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 12px;
          }
          aside button {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
