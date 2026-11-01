import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SAMPLE_PRODUCTS } from '@/lib/products-data';
import ProductDetailClient from '@/components/product/ProductDetailClient';

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
  if (!product) return {};
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
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
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
