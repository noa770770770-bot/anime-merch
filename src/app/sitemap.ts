import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // In a real Vercel deployment, this would be an environment variable.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anime-merch-israel.com'; 
  
  // Get all active products
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true }
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const routes = ['', '/products', '/faq', '/contact', '/vip'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...routes, ...productUrls];
}
