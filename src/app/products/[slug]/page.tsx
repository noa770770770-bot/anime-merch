import prisma from '@/lib/prisma';
import ProductClientFeatures from './product-client-features';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function ProductDetail({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const product = await prisma.product.findUnique({ where: { slug }, include: { variants: true } });

  if (!product) notFound();

  // Handle images as array or fallback
  let images: string[] = [];
  if (Array.isArray(product.images) && typeof product.images[0] === 'string') {
    images = product.images as string[];
  } else if (typeof product.images === 'string') {
    images = [product.images];
  } else if (product.imageUrl) {
    images = [product.imageUrl];
  }
  if (!images.length || !images[0]) {
    images = ['/products/anime-ai-placeholder.svg'];
  }
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            {images.map((img, idx) => (
              <img key={idx} src={img || '/products/anime-ai-placeholder.svg'} alt={`${product.name} ${idx}`} style={{ width: 80, height:80, objectFit:'cover', borderRadius:6 }} />
            ))}
          </div>
          <div style={{ marginTop:8 }}>
            <img src={images[0] || '/products/anime-ai-placeholder.svg'} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
          </div>
        </div>
        <div>
          <ProductClientFeatures productId={product.id} productName={product.name} />
          <p className="meta">{product.description}</p>
          <p className="price" style={{ marginTop: 12 }}>{product.priceILS} ILS</p>
          <div style={{ marginTop: 18 }}>
            <AddToCartButton productId={product.id} name={product.name} price={product.priceILS} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Variant: </label>
            <select id="variant-select" name="variant">
              { (product.variants || []).map((v:any, idx:number)=> (
                <option key={v.id} value={v.id} data-price={v.priceILS ?? ''}>{v.name}: {v.value}{v.priceILS? ` (+${v.priceILS} ILS)` : ''}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 12 }}>
            <button id="size-guide">Size guide</button>
          </div>
          {/* Reviews are rendered in ProductClientFeatures */}
          <script dangerouslySetInnerHTML={{ __html: `
            (function(){
              const btn = document.querySelector('.btn');
              const sel = document.getElementById('variant-select');
              if(!sel || !btn) return;
              btn.addEventListener('click', function(){
                const opt = sel.options[sel.selectedIndex];
                const variantId = opt.value;
                const variantLabel = opt.text;
                const price = opt.dataset.price || '';
                const cart = JSON.parse(localStorage.getItem('cart')||'[]');
                const productId = '${product.id}';
                const name = '${product.name.replace(/'/g,"\\'")}';
                const item = { productId, name, priceILS: price? Number(price) : ${product.priceILS}, qty:1, variantId, variantLabel };
                cart.push(item);
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Added to cart');
              });
            })();
          `}} />
          <div style={{ marginTop: 12, padding:12, border:'1px solid #eee' }}>
            <h4>Shipping & Returns</h4>
            <p>Ships in 1-3 business days. 30 day returns.</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Related products</h3>
        <div style={{ display:'flex', gap:12 }}>
          {/* simple related: latest 3 */}
          {(await prisma.product.findMany({ take:3, orderBy:{ createdAt: 'desc' } })).filter(p=>p.id!==product.id).map(r=> (
            <div key={r.id} style={{border:'1px solid #eee', padding:8}}>
              <img src={r.imageUrl && r.imageUrl.trim() !== '' ? r.imageUrl : '/products/placeholder.svg'} alt={r.name} style={{width:120}} />
              <div>{r.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <Link href="/products">← Back to products</Link>
      </div>
    </div>
  );
}
