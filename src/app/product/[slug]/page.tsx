import { Metadata } from 'next';
import { SAMPLE_PRODUCTS } from '@/lib/products-data';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export const dynamicParams = true;

export function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === params.slug);
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  if (!product) {
    return {
      title: `Product Details | ${brandName}`,
    };
  }
  return {
    title: `${product.name} | ${brandName}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const initialProduct = SAMPLE_PRODUCTS.find((p) => p.slug === params.slug) || null;
  const initialRelated = initialProduct
    ? SAMPLE_PRODUCTS.filter(
        (p) => p.category === initialProduct.category && p.id !== initialProduct.id
      ).slice(0, 4)
    : [];

  return (
    <ProductDetailClient
      slug={params.slug}
      initialProduct={initialProduct}
      initialRelatedProducts={initialRelated}
    />
  );
}
