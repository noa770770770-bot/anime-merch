import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/account/login");

  const orders = await prisma.order.findMany({
    where: { email: session.user.email },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } }
  });

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <Link href="/account/profile">Account</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Orders</span>
      </div>

      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1>My Orders</h1>
          <p className="page-subtitle">View your past purchases</p>
        </div>
      </div>

      {!orders.length ? (
        <div className="empty-state" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Order ID</div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>#{order.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Date</div>
                  <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {order.items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
                      <img src={item.product?.imageUrl || '/products/anime-ai-placeholder.svg'} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.name || 'Unknown Product'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent3)' }}>
                      {(item.priceILS || 0) * item.qty} ₪
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div>
                  <span className={`badge ${order.status === 'PAID' ? 'badge-success' : 'badge-neutral'}`}>
                    {order.status}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>{order.totalILS} ₪</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
