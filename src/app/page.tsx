
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 6, // Show only a few featured items
  });
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Welcome to Anime Merch!</h1>
        <p style={{ fontSize: 20, color: '#94a3b8' }}>You’re in the right place for the best anime goods, figures, apparel, and more. Shop our latest arrivals below!</p>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Featured Products</h2>
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
