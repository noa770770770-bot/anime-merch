

import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Shop Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          products.map((product: any) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </div>
  );
}
