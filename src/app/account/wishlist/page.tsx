"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/wishlist")
        .then(res => res.json())
        .then(data => {
          if (data.ok) setItems(data.wishlist.map((w: any) => w.product));
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading || status === 'loading') {
    return <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>Loading wishlist...</div>;
  }

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 1200 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <Link href="/account/profile">Account</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Wishlist</span>
      </div>

      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1>My Wishlist</h1>
          <p className="page-subtitle">Your saved products</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div className="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Explore our store and save items you love!</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
