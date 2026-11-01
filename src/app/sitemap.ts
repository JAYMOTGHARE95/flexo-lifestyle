import { MetadataRoute } from 'next';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/products-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flexolifestyle.vercel.app';

  // Static Pages
  const staticRoutes = [
    '',
    '/shop',
    '/cart',
    '/track-order',
    '/about',
    '/contact',
    '/shipping',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Product Pages
  const productRoutes = SAMPLE_PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Category Shop Links
  const categoryRoutes = CATEGORIES.map((category) => ({
    url: `${baseUrl}/shop?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
