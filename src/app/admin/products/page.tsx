
console.log("LIST DATABASE_URL", process.env.DATABASE_URL);
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminProducts(){
  console.log("DATABASE_URL (list page)", process.env.DATABASE_URL);
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, include: { variants: true } });

  return (
    <div>
      <h1>Admin — Products</h1>
      <div style={{marginBottom:12}}>
        <Link href="/admin/products/new">New Product</Link>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Name</th><th>Slug</th><th>Price</th><th>Active</th><th>Variants</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p=> (
            <tr key={p.id} style={{borderTop:'1px solid #eee'}}>
              <td>{p.name}</td>
              <td>{p.slug}</td>
              <td>{p.priceILS}</td>
              <td>{p.active ? 'Yes' : 'No'}</td>
              <td>{p.variants?.length ?? 0}</td>
              <td><Link href={`/admin/products/${p.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
