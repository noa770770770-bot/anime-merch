import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditProduct({ params }: { params: { id?: string } } | { params: Promise<{ id?: string }> }) {
  // Support both direct and Promise params (for Next.js App Router compatibility)
  const resolvedParams = typeof (params as any).then === 'function' ? await params : params;
  const { id } = resolvedParams || {};
  console.log("params.id", id);
  console.log("DATABASE_URL", process.env.DATABASE_URL);
  if (!id || typeof id !== 'string') return notFound();
  console.log("Looking for product id:", id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  console.log("Product found?", !!product, product?.id);
  if (!product) return notFound();
  return (
    <div style={{ maxWidth: 760 }}>
      <h1>Edit Product</h1>
      <form method="post" action={`/api/admin/products/${product.id}`}>
        <div><label>Name</label><input name="name" defaultValue={product.name} required /></div>
        <div><label>Slug</label><input name="slug" defaultValue={product.slug} required /></div>
        <div><label>Description</label><textarea name="description" defaultValue={product.description ?? ''} /></div>
        <div><label>Price (ILS)</label><input name="priceILS" type="number" defaultValue={String(product.priceILS)} required /></div>
        <div><label>Image URL</label><input name="imageUrl" defaultValue={product.imageUrl || ''} /></div>
        <div><label>Active</label><input name="active" type="checkbox" defaultChecked={product.active} /></div>
        <div style={{ marginTop: 12 }}><button type="submit">Save</button></div>
      </form>

      <div style={{ marginTop: 24 }}>
        <h2>Variants ({product.variants?.length ?? 0})</h2>
        <div>
          {product.variants?.map(v => (
            <div key={v.id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
              <form method="post" action={`/api/admin/products/${product.id}/variants/${v.id}`}>
                <input name="name" defaultValue={v.name} /> <input name="value" defaultValue={v.value} />
                <input name="stock" type="number" defaultValue={String(v.stock || 0)} style={{ width: 80 }} />
                <input name="priceILS" type="number" defaultValue={v.priceILS ?? ''} placeholder="price override" style={{ width: 120 }} />
                <button type="submit">Save</button>
              </form>
              <form method="post" action={`/api/admin/products/${product.id}/variants/${v.id}?_method=delete`} style={{ display: 'inline' }}>
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Add variant</h4>
          <form id="addVariant" method="post" action={`/api/admin/products/${product.id}/variants`}>
            <input name="name" placeholder="Name e.g. Size" required />
            <input name="value" placeholder="Value e.g. M" required />
            <input name="stock" type="number" defaultValue={0} />
            <input name="priceILS" type="number" placeholder="price override (optional)" />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}

