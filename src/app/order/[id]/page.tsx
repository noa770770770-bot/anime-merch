import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;
  const order = await prisma.order.findUnique({ 
    where: { id }, 
    include: { items: { include: { product: true, variant: true } } } 
  });
  
  if (!order) return notFound();

  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: 800 }}>
      {/* Success Hero */}
      <div style={{
        textAlign: 'center', marginBottom: 40,
        padding: 40, background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Thank you for your purchase. Your anime merch is being prepared.</p>
        <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Order #{order.id}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
        {/* Order Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Items */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {order.items.map((i: any) => (
                <div key={i.id} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={i.product?.imageUrl || '/products/placeholder.svg'} alt={i.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{i.product?.name ?? i.productId}</div>
                    {i.variant && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{i.variant.name}: {i.variant.value}</div>}
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Qty: {i.qty}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {i.priceILS * i.qty} ₪
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--accent)' }}>{order.totalILS} ₪</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Shipping Info */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 12 }}>Shipping Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.shippingName}</div>
              <div style={{ color: 'var(--text-muted)' }}>
                {order.shippingAddress1}<br />
                {order.shippingAddress2 && <>{order.shippingAddress2}<br /></>}
                {order.shippingCity}, {order.shippingZip}<br />
                {order.shippingCountry}
              </div>
            </div>
          </div>

          <Link href="/products" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
