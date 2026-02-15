import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminOrderDetail({ params }: { params: { id?: string } }){
  const id = params?.id;
  if(!id) return (<div>Missing order id in URL.</div> as any);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true, variant: true } } } });
  if(!order) return (<div>Order not found</div> as any);

  return (
    <div>
      <h1>Order {order.id}</h1>
      <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
      <div>Status: {order.status}</div>
      <div>Email: {order.email}</div>
      <h3>Shipping</h3>
      <div>{order.shippingName}</div>
      <div>{order.shippingAddress1}</div>
      <div>{order.shippingCity} {order.shippingZip}</div>
      <div>{order.shippingCountry}</div>

      <h3>Items</h3>
      <ul>
        {order.items.map((i: any) => (
          <li key={i.id}>
            {i.qty}x {i.product?.name ?? i.productId}{" "}
            {i.variant ? `(${i.variant.name}:${i.variant.value})` : ""} — {i.priceILS} ILS
          </li>
        ))}
      </ul>

      <h3>Admin Actions</h3>
      <form method="post" action={`/api/admin/orders/${order.id}/update-status`}>
        <select name="status" defaultValue={order.status}>
          <option value="CREATED">CREATED</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
          <option value="FULFILLED">FULFILLED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="CANCELED">CANCELED</option>
        </select>
        <button type="submit">Update Status</button>
      </form>

      <form method="post" action={`/api/admin/orders/${order.id}/set-tracking`} style={{marginTop:12}}>
        <input name="trackingNumber" placeholder="Tracking number" defaultValue={order.trackingNumber || ''} />
        <button type="submit">Set Tracking</button>
      </form>

      <div style={{marginTop:12}}><Link href="/admin/orders">Back</Link></div>
    </div>
  );
}
