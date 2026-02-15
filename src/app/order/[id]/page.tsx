import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function OrderPage({ params }: { params: { id: string } }){
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: { include: { product: true, variant: true } } } });
  if(!order) return (<div>Order not found</div> as any);

  return (
    <div>
      <h1>Order {order.id}</h1>
      <div>Status: {order.status}</div>
      <div>Total: {order.totalILS} ILS</div>
      {order.paypalOrderId && <div>PayPal ID: {order.paypalOrderId}</div>}
      <h3>Items</h3>
      {order.items.length === 0 ? <div>No items</div> : (
        <ul>
          {order.items.map(i=> (
            <li key={i.id}>
              {i.qty} x {i.product?.name ?? i.productId} {i.variant ? `(${i.variant.name}: ${i.variant.value})` : ''} — {i.priceILS} ILS = {i.priceILS * i.qty} ILS
            </li>
          ))}
        </ul>
      )}

      <h3>Shipping</h3>
      <div>{order.shippingName}</div>
      <div>{order.shippingAddress1}{order.shippingAddress2 ? ', ' + order.shippingAddress2 : ''}</div>
      <div>{order.shippingCity} {order.shippingZip}</div>
      <div>{order.shippingCountry}</div>
      <div>{order.shippingPhone}</div>

      <div style={{marginTop:12}}><Link href="/">Back</Link></div>
    </div>
  );
}
