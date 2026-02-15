export type CartItem = {
  productId: number;
  qty: number;
};

export type ProductLite = {
  id: number;
  name: string;
  price_ils: number;
  image_url?: string | null;
  description?: string | null;
};
