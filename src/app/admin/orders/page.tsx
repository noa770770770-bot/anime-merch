import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminOrdersPage({ searchParams }: { searchParams?: { status?: string } }){
  const status = (await searchParams as any)?.status;
  const orders = await prisma.order.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1>Admin — Orders</h1>
      <div style={{marginBottom:12}}>
        <form method="get">
          <select name="status" defaultValue={status || ''}>
            <option value="">All</option>
            <option value="CREATED">CREATED</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="FULFILLED">FULFILLED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
          <button type="submit">Filter</button>
        </form>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Created</th><th>Email</th><th>Total</th><th>Status</th><th>Tracking</th><th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: (typeof orders)[number]) => (
            <tr key={o.id} style={{borderTop:'1px solid #eee'}}>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>{o.email}</td>
              <td>{o.totalILS}</td>
              <td>{o.status}</td>
              <td>{o.trackingNumber}</td>
              <td><Link href={'/admin/orders/' + o.id}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
