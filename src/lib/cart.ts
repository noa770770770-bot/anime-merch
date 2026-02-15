export type CartItem = { productId: string; name: string; priceILS: number; qty: number; variantId?: string | null; variantLabel?: string | null };

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch { return []; }
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find(i => i.productId === item.productId && i.variantId === item.variantId);
  if (existing) existing.qty += item.qty;
  else cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
}
