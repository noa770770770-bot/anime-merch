import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

type Props = { params: Promise<{ id: string }> };

export default async function TrackingPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });

  if (!order) notFound();

  const statuses = ['CREATED', 'PAID', 'SHIPPED', 'FULFILLED'];
  let currentIndex = statuses.indexOf(order.status);
  
  // If canceled or failed, we just show a red alert instead of the timeline
  const isError = order.status === 'CANCELED' || order.status === 'FAILED';
  if (isError) currentIndex = -1;

  // Calculate percentage for the progress bar linking the dots
  // 0% for CREATED, 33% for PAID, 66% for SHIPPED, 100% for FULFILLED
  const progressPercent = currentIndex <= 0 ? 0 : (currentIndex / (statuses.length - 1)) * 100;

  const steps = [
    { key: 'CREATED', label: 'Order Placed', icon: '🛒' },
    { key: 'PAID', label: 'Processing', icon: '💳' },
    { key: 'SHIPPED', label: 'Dispatched', icon: '🚚' },
    { key: 'FULFILLED', label: 'Delivered', icon: '📦' }
  ];

  return (
    <div className="container" style={{ padding: '64px 20px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Track Your Order</h1>
          <p style={{ color: 'var(--text-muted)' }}>Order ID: {order.id.split('-')[0].toUpperCase()}</p>
        </div>

        {isError ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: 24, borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--danger)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Order {order.status}</h2>
            <p style={{ marginTop: 8 }}>We're sorry, but this order has been halted. Please contact support if you believe this is a mistake.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', marginBottom: 64, padding: '0 20px' }}>
            {/* The horizontal track line */}
            <div style={{ position: 'absolute', top: 24, left: 40, right: 40, height: 4, background: 'var(--bg-surface)', zIndex: 0, borderRadius: 2 }} />
            
            {/* The animated fill line */}
            <div style={{ 
              position: 'absolute', top: 24, left: 40, height: 4, 
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))', 
              zIndex: 1, 
              width: `calc(${progressPercent}% - 40px)`,
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: 2
            }} />

            {/* The nodes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {steps.map((step, idx) => {
                const isCompleted = currentIndex >= idx;
                const isCurrent = currentIndex === idx;
                
                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 80 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: isCompleted ? 'var(--bg-card)' : 'var(--bg-surface)',
                      border: isCompleted ? '3px solid var(--accent)' : '3px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24,
                      boxShadow: isCurrent ? '0 0 20px rgba(124, 91, 245, 0.4)' : 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}>
                      {step.icon}
                      {isCompleted && !isCurrent && (
                        <div style={{ position: 'absolute', bottom: -4, right: -4, background: 'var(--success)', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, border: '2px solid var(--bg-card)' }}>
                          ✓
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: isCompleted ? 800 : 500, color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Details List */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Items in your package</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {order.items.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-surface)', padding: 16, borderRadius: 'var(--radius)' }}>
                {item.product?.imageUrl && (
                  <img src={item.product.imageUrl} alt={item.product.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{item.product?.name || 'Unknown Product'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty: {item.qty} {item.variantInfo ? `| ${item.variantInfo}` : ''}</div>
                </div>
                <div style={{ fontWeight: 800 }}>{item.priceILS} ₪</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, fontSize: 18, fontWeight: 900 }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--accent3)' }}>{order.totalILS} ₪</span>
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/products" className="btn btn-ghost">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
