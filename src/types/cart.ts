export type CartItem = {
  productId: string;
  qty: number;
  variantId?: string | null;
};

export type ProductLite = {
  id: string;
  name: string;
  slug: string;
  priceILS: number;
  imageUrl?: string | null;
  images?: string[] | null;
  description?: string | null;
};
