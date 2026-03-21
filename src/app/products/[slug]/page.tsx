import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import ReviewForm from '@/components/ReviewForm';
import Recommendations from '@/components/Recommendations';
import PriceDisplay from '@/components/PriceDisplay';
import Script from 'next/script';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true, reviews: { orderBy: { createdAt: 'desc' }, take: 10 }, category: true },
  });

  if (!product) notFound();

  // Handle images
  let images: string[] = [];
  if (Array.isArray(product.images)) images = product.images.filter((i): i is string => typeof i === 'string' && i.trim() !== '');
  if (!images.length && product.imageUrl) images = [product.imageUrl];
  if (!images.length) images = ['/products/anime-ai-placeholder.svg'];

  // Related products
  const related = await prisma.product.findMany({
    where: { 
      active: true, 
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {})
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  // Average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <>
      {/* JSON-LD Schema for Google Rich Results */}
      <Script id="product-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: images,
          description: product.description || `Buy ${product.name} at Otaku Merch`,
          offers: {
            "@type": "Offer",
            url: `https://anime-merch-israel.com/products/${product.slug}`,
            priceCurrency: "ILS",
            price: product.priceILS,
            availability: product.variants.some((v: any) => v.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
          aggregateRating: product.reviews.length > 0 ? {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: product.reviews.length
          } : undefined
        })
      }} />

      <div className="container" style={{ padding: '32px 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <Link href="/products">Products</Link>
        <span className="separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </div>

      {/* Product Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Image Gallery */}
        <div>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
            marginBottom: 12,
          }}>
            <img
              src={images[0]}
              alt={product.name}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
              id="main-image"
            />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  style={{
                    width: 72, height: 72,
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    border: idx === 0 ? '2px solid var(--accent2)' : '2px solid var(--border)',
                    background: 'var(--bg-surface)',
                    padding: 0, cursor: 'pointer',
                  }}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`star ${s <= Math.round(avgRating) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent3)', marginBottom: 24 }}>
            <PriceDisplay amountILS={product.priceILS} />
          </div>

          {/* Description */}
          {product.description && (
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Available Options</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variants.map((v: any) => (
                  <div key={v.id} style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    fontSize: 14,
                    color: v.stock > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                    opacity: v.stock > 0 ? 1 : 0.5,
                  }}>
                    <span style={{ fontWeight: 600 }}>{v.name}: {v.value}</span>
                    {v.priceILS && <span style={{ color: 'var(--accent3)', marginLeft: 8 }}><PriceDisplay amountILS={v.priceILS} /></span>}
                    {v.stock <= 0 && <span style={{ color: 'var(--danger)', marginLeft: 8, fontSize: 12 }}>Out of stock</span>}
                    {v.stock > 0 && v.stock < 5 && (
                      <span style={{ color: 'var(--danger)', marginLeft: 8, fontSize: 13, fontWeight: 800, textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>
                        🔥 Hurry! Only {v.stock} left!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton productId={product.id} productName={product.name} />

          {/* Shipping info */}
          <div style={{
            marginTop: 24, padding: 20,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>🚀</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Ships in 1-3 business days</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>🔄</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>30-day easy returns</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>🔒</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Secure checkout via PayPal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligent Recommendations Engine */}
      <Recommendations slug={product.slug} />

      {/* Reviews Section */}
      <section style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>
          Customer Reviews {product.reviews.length > 0 && `(${product.reviews.length})`}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 40, alignItems: 'start' }}>
          <div>
            {product.reviews.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '24px 0' }}>
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {product.reviews.map((review: any) => (
                  <div key={review.id} style={{
                    padding: 20,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    <div className="stars" style={{ marginBottom: 8 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`star ${s <= review.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                    {review.title && <div style={{ fontWeight: 700, marginBottom: 4 }}>{review.title}</div>}
                    {review.body && <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{review.body}</div>}
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ position: 'sticky', top: 100 }}>
            {/* Using a key force-remounts the form when client router pushes instead of a full reload */}
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>You May Also Like</h2>
          <div className="product-grid">
            {related.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
    </>
  );
}
